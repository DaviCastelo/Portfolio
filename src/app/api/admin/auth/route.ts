import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createAdminSessionToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD não configurada no servidor." },
        { status: 503 }
      );
    }

    if (!password || password !== expected) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    const token = createAdminSessionToken();
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

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
