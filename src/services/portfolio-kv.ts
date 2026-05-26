import { legacyEntryToRecord } from "@/lib/portfolio-record";
import { getRedisClient, isRedisConfigured } from "@/lib/redis-client";
import type { PortfolioProjectRecord } from "@/types/portfolio-admin";
import type { ProjectCategory } from "@/types/project";

export { isRedisConfigured };

const KV_KEY = "portfolio:projects";
const LEGACY_KEY = "portfolio:overrides";

/** Formato antigo em `portfolio:overrides` (pré-migração híbrida). */
type LegacyKvEntry = {
  repoFullName: string;
  category?: ProjectCategory;
  hidden?: boolean;
  priority?: number;
};

function isLegacyKvEntry(value: unknown): value is LegacyKvEntry {
  return (
    typeof value === "object" &&
    value !== null &&
    "repoFullName" in value &&
    typeof (value as LegacyKvEntry).repoFullName === "string"
  );
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

function parseLegacyEntries(data: unknown): LegacyKvEntry[] {
  if (!Array.isArray(data)) return [];
  return data.filter(isLegacyKvEntry);
}

function migrateLegacyEntries(entries: LegacyKvEntry[]): PortfolioProjectRecord[] {
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

    const legacy = parseLegacyEntries(JSON.parse(legacyRaw));
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
  const editedAt = new Date().toISOString();
  if (index >= 0) {
    next[index] = { ...next[index], ...record, id: record.id, editedAt };
  } else {
    next.push({ ...record, editedAt });
  }
  await setPortfolioProjectsInKv(next);

  const saved = index >= 0 ? next[index] : next.at(-1);
  if (!saved) {
    throw new Error("Falha ao persistir projeto no KV.");
  }
  return saved;
}

export async function patchPortfolioProject(
  id: string,
  patch: Partial<PortfolioProjectRecord>
): Promise<PortfolioProjectRecord | null> {
  const records = await getPortfolioProjectsFromKv();
  const index = records.findIndex((r) => r.id === id);
  if (index < 0) return null;

  const existing = records[index];
  if (!existing) return null;

  const updated: PortfolioProjectRecord = {
    ...existing,
    ...patch,
    id,
    editedAt: new Date().toISOString(),
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
