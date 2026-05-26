import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return NextResponse.json(
      {
        error:
          "Blob não configurado. Crie um Blob store na Vercel e defina BLOB_READ_WRITE_TOKEN.",
      },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const projectId = (formData.get("projectId") as string | null)?.trim();

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Arquivo não enviado." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use JPEG, PNG, WebP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 4 MB." },
        { status: 400 }
      );
    }

    const ext = file.type.split("/")[1] ?? "jpg";
    const safeId = (projectId ?? "cover")
      .replace(/[^a-zA-Z0-9:_-]/g, "-")
      .slice(0, 120);
    const pathname = `portfolio/covers/${safeId}/${Date.now()}.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro no upload.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
