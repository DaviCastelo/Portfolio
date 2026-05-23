import { kv } from "@vercel/kv";
import type { PortfolioAdminEntry } from "@/types/portfolio-admin";

const KV_KEY = "portfolio:overrides";

function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
  );
}

export async function getPortfolioOverridesFromKv(): Promise<
  PortfolioAdminEntry[]
> {
  if (!kvConfigured()) return [];
  try {
    const data = await kv.get<PortfolioAdminEntry[]>(KV_KEY);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function setPortfolioOverridesInKv(
  entries: PortfolioAdminEntry[]
): Promise<void> {
  if (!kvConfigured()) {
    throw new Error(
      "Vercel KV não configurado. Adicione KV_REST_API_URL e KV_REST_API_TOKEN."
    );
  }
  await kv.set(KV_KEY, entries);
}
