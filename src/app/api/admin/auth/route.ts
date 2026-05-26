import { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import {
  createAdminSession,
  revokeAdminSession,
  secureComparePassword,
} from "@/lib/admin-session";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit("admin-auth", ip, LOGIN_LIMIT, LOGIN_WINDOW_MS)) {
      return NextResponse.json(
        { error: "Muitas tentativas. Aguarde 15 minutos." },
        { status: 429 }
      );
    }

    const { password } = (await request.json()) as { password?: string };
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD não configurada no servidor." },
        { status: 503 }
      );
    }

    if (!password || !secureComparePassword(password, expected)) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const token = await createAdminSession();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Erro ao autenticar." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookiePattern = new RegExp(`${ADMIN_COOKIE}=([^;]+)`);
  const token = cookiePattern.exec(cookieHeader)?.[1];
  await revokeAdminSession(token);

  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
