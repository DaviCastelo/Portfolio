import { cookies } from "next/headers";
import { isValidAdminSession } from "@/lib/admin-session";

export const ADMIN_COOKIE = "dc_admin_session";

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}
