import { createClient } from "redis";
import { legacyEntryToRecord } from "@/lib/portfolio-record";
import type {
  PortfolioAdminEntry,
  PortfolioProjectRecord,
} from "@/types/portfolio-admin";

const KV_KEY = "portfolio:projects";
const LEGACY_KEY = "portfolio:overrides";

type PortfolioRedis = ReturnType<typeof createClient>;

const globalRedis = globalThis as typeof globalThis & {
  __portfolioRedis?: PortfolioRedis;
  __portfolioRedisConnect?: Promise<PortfolioRedis>;
};

export function isRedisConfigured(): boolean {
  return Boolean(process.env.KV_REDIS_URL?.trim());
}

async function getRedisClient(): Promise<PortfolioRedis> {
  const url = process.env.KV_REDIS_URL?.trim();
  if (!url) {
    throw new Error("Redis não configurado. Adicione KV_REDIS_URL.");
  }

  if (globalRedis.__portfolioRedis?.isOpen) {
    return globalRedis.__portfolioRedis;
  }

  if (!globalRedis.__portfolioRedisConnect) {
    globalRedis.__portfolioRedisConnect = (async () => {
      const redis = createClient({ url });
      redis.on("error", (err) => console.error("[portfolio-kv]", err));
      await redis.connect();
      globalRedis.__portfolioRedis = redis;
      return redis;
    })();
  }

  return globalRedis.__portfolioRedisConnect;
}

function normalizeRecords(data: unknown): PortfolioProjectRecord[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (item): item is PortfolioProjectRecord =>
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof (item as PortfolioProjectRecord).id === "string"
  );
}

function migrateLegacyEntries(
  entries: PortfolioAdminEntry[]
): PortfolioProjectRecord[] {
  return entries.map(legacyEntryToRecord);
}

async function readRawProjects(): Promise<PortfolioProjectRecord[]> {
  if (!isRedisConfigured()) return [];
  try {
    const redis = await getRedisClient();
    const raw = await redis.get(KV_KEY);
    if (raw) {
      return normalizeRecords(JSON.parse(raw));
    }

    const legacyRaw = await redis.get(LEGACY_KEY);
    if (!legacyRaw) return [];

    const legacy = JSON.parse(legacyRaw) as PortfolioAdminEntry[];
    if (!Array.isArray(legacy)) return [];

    const migrated = migrateLegacyEntries(legacy);
    if (migrated.length > 0) {
      await redis.set(KV_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    return [];
  }
}

export async function getPortfolioProjectsFromKv(): Promise<
  PortfolioProjectRecord[]
> {
  return readRawProjects();
}

export async function setPortfolioProjectsInKv(
  records: PortfolioProjectRecord[]
): Promise<void> {
  if (!isRedisConfigured()) {
    throw new Error(
      "Redis não configurado. Conecte o Redis na Vercel e defina KV_REDIS_URL."
    );
  }
  const redis = await getRedisClient();
  await redis.set(KV_KEY, JSON.stringify(records));
}

export async function getPortfolioProjectById(
  id: string
): Promise<PortfolioProjectRecord | undefined> {
  const records = await getPortfolioProjectsFromKv();
  return records.find((r) => r.id === id);
}

export async function upsertPortfolioProject(
  record: PortfolioProjectRecord
): Promise<PortfolioProjectRecord> {
  const records = await getPortfolioProjectsFromKv();
  const index = records.findIndex((r) => r.id === record.id);
  const next = [...records];
  if (index >= 0) {
    next[index] = { ...next[index], ...record, id: record.id };
  } else {
    next.push(record);
  }
  await setPortfolioProjectsInKv(next);
  return index >= 0 ? next[index]! : next[next.length - 1]!;
}

export async function patchPortfolioProject(
  id: string,
  patch: Partial<PortfolioProjectRecord>
): Promise<PortfolioProjectRecord | null> {
  const records = await getPortfolioProjectsFromKv();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) return null;
  const updated: PortfolioProjectRecord = {
    ...records[index]!,
    ...patch,
    id,
  };
  const next = [...records];
  next[index] = updated;
  await setPortfolioProjectsInKv(next);
  return updated;
}

export async function deletePortfolioProject(id: string): Promise<boolean> {
  const records = await getPortfolioProjectsFromKv();
  const next = records.filter((r) => r.id !== id);
  if (next.length === records.length) return false;
  await setPortfolioProjectsInKv(next);
  return true;
}

export async function mergePortfolioProjects(
  updates: PortfolioProjectRecord[]
): Promise<void> {
  const records = await getPortfolioProjectsFromKv();
  const map = new Map(records.map((r) => [r.id, r]));
  for (const update of updates) {
    const existing = map.get(update.id);
    map.set(update.id, existing ? { ...existing, ...update, id: update.id } : update);
  }
  await setPortfolioProjectsInKv(Array.from(map.values()));
}

/** @deprecated */
export async function getPortfolioOverridesFromKv(): Promise<
  PortfolioAdminEntry[]
> {
  const records = await getPortfolioProjectsFromKv();
  return records
    .filter((r) => r.source === "github" && r.repoFullName)
    .map((r) => ({
      repoFullName: r.repoFullName!,
      category: r.category,
      hidden: r.hidden,
      priority: r.priority,
    }));
}

/** @deprecated */
export async function setPortfolioOverridesInKv(
  entries: PortfolioAdminEntry[]
): Promise<void> {
  await mergePortfolioProjects(entries.map(legacyEntryToRecord));
}
