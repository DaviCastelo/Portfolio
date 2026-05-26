import { createClient } from "redis";

type PortfolioRedis = ReturnType<typeof createClient>;

const globalRedis = globalThis as typeof globalThis & {
  __portfolioRedis?: PortfolioRedis;
  __portfolioRedisConnect?: Promise<PortfolioRedis>;
};

export function isRedisConfigured(): boolean {
  return Boolean(process.env.KV_REDIS_URL?.trim());
}

export async function getRedisClient(): Promise<PortfolioRedis> {
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
      redis.on("error", (err) => console.error("[redis]", err));
      await redis.connect();
      globalRedis.__portfolioRedis = redis;
      return redis;
    })();
  }

  return globalRedis.__portfolioRedisConnect;
}
