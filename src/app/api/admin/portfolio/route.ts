import { NextResponse } from "next/server";
import { requireAdmin, revalidatePortfolio } from "@/lib/admin-api";
import {
  applyVisibilityToRecord,
  newGithubRecord,
} from "@/lib/portfolio-record";
import {
  githubRepoToAdminItem,
  recordToAdminItem,
} from "@/lib/portfolio-admin-mapper";
import { getRecordsMap } from "@/lib/portfolio-admin-merge";
import { portfolioConfig } from "@/data/projects-overrides";
import {
  getPortfolioProjectsFromKv,
  isRedisConfigured,
  mergePortfolioProjects,
} from "@/services/portfolio-kv";
import { fetchUserRepos, getGitHubUsername } from "@/services/github";
import type {
  PortfolioAdminRepoItem,
  PortfolioVisibility,
} from "@/types/portfolio-admin";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const username = getGitHubUsername();
  const recordsMap = await getRecordsMap();

  const manualItems: PortfolioAdminRepoItem[] = Array.from(
    recordsMap.values()
  )
    .filter((r) => r.source === "manual")
    .map((r) => recordToAdminItem(r));

  if (!username) {
    return NextResponse.json({
      items: manualItems,
      kvConfigured: isRedisConfigured(),
      kvCount: (await getPortfolioProjectsFromKv()).length,
    });
  }

  const repos = await fetchUserRepos(username);

  const githubItems: PortfolioAdminRepoItem[] = repos
    .filter((repo) => portfolioConfig.includeForks || !repo.fork)
    .map((repo) =>
      githubRepoToAdminItem(repo, recordsMap.get(repo.full_name))
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const items = [...githubItems, ...manualItems].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return NextResponse.json({
    items,
    kvConfigured: isRedisConfigured(),
    kvCount: (await getPortfolioProjectsFromKv()).length,
  });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;

  try {
    const body = (await request.json()) as {
      entries?: { repoFullName: string; visibility: PortfolioVisibility }[];
    };

    if (!body.entries?.length) {
      return NextResponse.json(
        { error: "Nenhuma configuração enviada." },
        { status: 400 }
      );
    }

    const recordsMap = await getRecordsMap();
    const updates = body.entries.map((entry) => {
      const existing =
        recordsMap.get(entry.repoFullName) ??
        newGithubRecord(entry.repoFullName);
      return applyVisibilityToRecord(existing, entry.visibility);
    });

    await mergePortfolioProjects(updates);
    revalidatePortfolio();

    return NextResponse.json({
      success: true,
      saved: updates.length,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erro ao salvar configurações.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
