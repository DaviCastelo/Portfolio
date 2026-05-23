import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE = "dc_admin_session";

export function createAdminSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) return "";
  return crypto.createHmac("sha256", secret).update("dc-admin-v1").digest("hex");
}

export function isValidAdminSessionToken(token: string | undefined): boolean {
  if (!token || !process.env.ADMIN_PASSWORD) return false;
  return token === createAdminSessionToken();
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
}
