import crypto from "node:crypto";
import { getRedisClient, isRedisConfigured } from "@/lib/redis-client";

const SESSION_PREFIX = "admin:session:";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;

export async function createAdminSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");

  if (isRedisConfigured()) {
    const redis = await getRedisClient();
    await redis.setEx(`${SESSION_PREFIX}${token}`, SESSION_TTL_SEC, "1");
    return token;
  }

  return legacySessionToken();
}

export async function isValidAdminSession(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;

  if (isRedisConfigured()) {
    try {
      const redis = await getRedisClient();
      const exists = await redis.exists(`${SESSION_PREFIX}${token}`);
      return exists === 1;
    } catch {
      return false;
    }
  }

  return token === legacySessionToken();
}

export async function revokeAdminSession(token: string | undefined): Promise<void> {
  if (!token || !isRedisConfigured()) return;
  try {
    const redis = await getRedisClient();
    await redis.del(`${SESSION_PREFIX}${token}`);
  } catch {
    /* ignore */
  }
}

/** Fallback quando Redis não está disponível (dev local). */
function legacySessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return "";
  return crypto.createHmac("sha256", secret).update("dc-admin-v1").digest("hex");
}

export function secureComparePassword(
  input: string,
  expected: string
): boolean {
  const inputHash = crypto.createHash("sha256").update(input).digest();
  const expectedHash = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(inputHash, expectedHash);
}
