import { NextResponse } from "next/server";
import { requireAdmin, revalidatePortfolio } from "@/lib/admin-api";
import { manualProjectId, newManualRecord } from "@/lib/portfolio-record";
import { recordToAdminItem } from "@/lib/portfolio-admin-mapper";
import {
  getPortfolioProjectById,
  upsertPortfolioProject,
} from "@/services/portfolio-kv";
import type { CreateManualProjectBody } from "@/types/portfolio-admin";

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = (await request.json()) as CreateManualProjectBody;

    if (!body.slug?.trim() || !body.title?.trim()) {
      return NextResponse.json(
        { error: "Slug e título são obrigatórios." },
        { status: 400 }
      );
    }

    const id = manualProjectId(body.slug);
    const existing = await getPortfolioProjectById(id);
    if (existing) {
      return NextResponse.json(
        { error: "Já existe um projeto com este slug." },
        { status: 409 }
      );
    }

    const record = newManualRecord(body.slug, {
      title: body.title.trim(),
      professionalDescription: body.professionalDescription,
      thumbnail: body.thumbnail,
      stack: body.stack ?? [],
      demoUrl: body.demoUrl,
      featured: body.featured ?? false,
      priority: body.priority ?? 0,
      category: body.category ?? "finished",
      hidden: body.hidden ?? false,
      architecture: body.architecture,
      challenges: body.challenges,
      solutions: body.solutions,
      screenshots: body.screenshots ?? [],
      githubUrl: body.githubUrl,
      updatedAt: new Date().toISOString(),
      stars: 0,
    });

    const saved = await upsertPortfolioProject(record);
    revalidatePortfolio();

    return NextResponse.json({ item: recordToAdminItem(saved) }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao criar projeto.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
