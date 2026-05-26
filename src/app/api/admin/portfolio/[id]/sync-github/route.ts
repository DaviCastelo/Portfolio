import { NextResponse } from "next/server";
import { requireAdmin, revalidatePortfolio } from "@/lib/admin-api";
import { parseProjectIdFromParam } from "@/lib/portfolio-record";
import { recordToAdminItem } from "@/lib/portfolio-admin-mapper";
import { syncGithubProject } from "@/lib/portfolio-sync";
import { getPortfolioProjectById } from "@/services/portfolio-kv";
import type { SyncGitHubBody } from "@/types/portfolio-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const id = parseProjectIdFromParam((await context.params).id);

    if (id.startsWith("manual:")) {
      return NextResponse.json(
        { error: "Projetos manuais não sincronizam com o GitHub." },
        { status: 400 }
      );
    }

    const existing = await getPortfolioProjectById(id);
    const body = (await request.json().catch(() => ({}))) as SyncGitHubBody;

    const saved = await syncGithubProject(id, existing, body);
    revalidatePortfolio();

    return NextResponse.json({ item: recordToAdminItem(saved) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao sincronizar.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
