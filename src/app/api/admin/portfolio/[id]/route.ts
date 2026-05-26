import { NextResponse } from "next/server";
import { requireAdmin, revalidatePortfolio } from "@/lib/admin-api";
import {
  applyVisibilityToRecord,
  isManualId,
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
import type {
  PortfolioProjectRecord,
  PortfolioVisibility,
} from "@/types/portfolio-admin";
import type { ProjectCategory } from "@/types/project";

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
    const body = (await request.json()) as Partial<{
      title: string;
      professionalDescription: string;
      thumbnail: string;
      stack: string[];
      demoUrl: string;
      featured: boolean;
      priority: number;
      visibility: PortfolioVisibility;
      category: ProjectCategory;
      hidden: boolean;
      architecture: string;
      challenges: string;
      solutions: string;
      screenshots: string[];
      githubUrl: string;
    }>;

    let record = await getPortfolioProjectById(id);

    if (!record) {
      if (isManualId(id)) {
        return NextResponse.json(
          { error: "Projeto manual não encontrado." },
          { status: 404 }
        );
      }
      record = {
        id,
        source: "github",
        repoFullName: id,
        githubUrl: `https://github.com/${id}`,
      };
    }

    const patch: Partial<PortfolioProjectRecord> = {};

    if (body.title !== undefined) patch.title = body.title;
    if (body.professionalDescription !== undefined)
      patch.professionalDescription = body.professionalDescription;
    if (body.thumbnail !== undefined) patch.thumbnail = body.thumbnail;
    if (body.stack !== undefined) patch.stack = body.stack;
    if (body.demoUrl !== undefined) patch.demoUrl = body.demoUrl;
    if (body.featured !== undefined) patch.featured = body.featured;
    if (body.priority !== undefined) patch.priority = body.priority;
    if (body.architecture !== undefined) patch.architecture = body.architecture;
    if (body.challenges !== undefined) patch.challenges = body.challenges;
    if (body.solutions !== undefined) patch.solutions = body.solutions;
    if (body.screenshots !== undefined) patch.screenshots = body.screenshots;
    if (body.githubUrl !== undefined) patch.githubUrl = body.githubUrl;
    if (body.category !== undefined) patch.category = body.category;
    if (body.hidden !== undefined) patch.hidden = body.hidden;

    let updated: PortfolioProjectRecord = { ...record, ...patch, id };

    if (body.visibility !== undefined) {
      updated = applyVisibilityToRecord(updated, body.visibility);
    }

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
