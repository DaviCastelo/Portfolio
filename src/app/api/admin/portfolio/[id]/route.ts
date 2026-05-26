import { NextResponse } from "next/server";
import { requireAdmin, revalidatePortfolio } from "@/lib/admin-api";
import {
  getOrCreateRecordForPatch,
  mergePortfolioPatch,
} from "@/lib/portfolio-patch-apply";
import {
  applyVisibilityToRecord,
  parseProjectIdFromParam,
  sourceFromId,
} from "@/lib/portfolio-record";
import { recordToAdminItem } from "@/lib/portfolio-admin-mapper";
import {
  deletePortfolioProject,
  getPortfolioProjectById,
  patchPortfolioProject,
  upsertPortfolioProject,
} from "@/services/portfolio-kv";
import { portfolioPatchSchema } from "@/utils/admin-validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = parseProjectIdFromParam((await context.params).id);
  const record = await getPortfolioProjectById(id);
  if (!record) {
    return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
  }

  return NextResponse.json({ item: recordToAdminItem(record) });
}

export async function PATCH(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const id = parseProjectIdFromParam((await context.params).id);
    const parsed = portfolioPatchSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos.", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const resolved = await getOrCreateRecordForPatch(id);
    if ("error" in resolved) return resolved.error;

    const updated = mergePortfolioPatch(resolved.record, parsed.data, id);
    const exists = Boolean(await getPortfolioProjectById(id));
    const saved = exists
      ? await patchPortfolioProject(id, updated)
      : await upsertPortfolioProject(updated);

    if (!saved) {
      return NextResponse.json({ error: "Erro ao salvar." }, { status: 500 });
    }

    revalidatePortfolio();
    return NextResponse.json({ item: recordToAdminItem(saved) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao atualizar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const id = parseProjectIdFromParam((await context.params).id);

  if (sourceFromId(id) === "manual") {
    const deleted = await deletePortfolioProject(id);
    if (!deleted) {
      return NextResponse.json({ error: "Projeto não encontrado." }, { status: 404 });
    }
    revalidatePortfolio();
    return NextResponse.json({ success: true });
  }

  const record = await getPortfolioProjectById(id);
  const updated = applyVisibilityToRecord(
    record ?? {
      id,
      source: "github",
      repoFullName: id,
    },
    "hidden"
  );
  await upsertPortfolioProject(updated);
  revalidatePortfolio();
  return NextResponse.json({ success: true, hidden: true });
}
