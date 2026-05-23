import { createClient } from "redis";
import type { PortfolioAdminEntry } from "@/types/portfolio-admin";

const KV_KEY = "portfolio:overrides";

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

export async function getPortfolioOverridesFromKv(): Promise<
  PortfolioAdminEntry[]
> {
  if (!isRedisConfigured()) return [];
  try {
    const redis = await getRedisClient();
    const raw = await redis.get(KV_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as PortfolioAdminEntry[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function setPortfolioOverridesInKv(
  entries: PortfolioAdminEntry[]
): Promise<void> {
  if (!isRedisConfigured()) {
    throw new Error(
      "Redis não configurado. Conecte o Redis na Vercel e defina KV_REDIS_URL."
    );
  }
  const redis = await getRedisClient();
  await redis.set(KV_KEY, JSON.stringify(entries));
}
