import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getEffectiveOverrides,
  overrideFromVisibility,
  visibilityFromOverride,
} from "@/lib/portfolio-admin-merge";
import { portfolioConfig } from "@/data/projects-overrides";
import {
  getPortfolioOverridesFromKv,
  isRedisConfigured,
  setPortfolioOverridesInKv,
} from "@/services/portfolio-kv";
import { fetchUserRepos, getGitHubUsername } from "@/services/github";
import type {
  PortfolioAdminEntry,
  PortfolioAdminRepoItem,
  PortfolioVisibility,
} from "@/types/portfolio-admin";

async function requireAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const username = getGitHubUsername();
  if (!username) {
    return NextResponse.json(
      { error: "GITHUB_USERNAME não configurado." },
      { status: 503 }
    );
  }

  const [repos, effective] = await Promise.all([
    fetchUserRepos(username),
    getEffectiveOverrides(),
  ]);

  const overrideByRepo = new Map(effective.map((o) => [o.repoFullName, o]));

  const items: PortfolioAdminRepoItem[] = repos
    .filter((repo) => portfolioConfig.includeForks || !repo.fork)
    .map((repo) => {
      const o = overrideByRepo.get(repo.full_name);
      return {
        repoFullName: repo.full_name,
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at,
        visibility: visibilityFromOverride(o, repo.updated_at),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({
    items,
    kvConfigured: isRedisConfigured(),
    kvCount: (await getPortfolioOverridesFromKv()).length,
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

    const effective = await getEffectiveOverrides();
    const map = new Map(effective.map((o) => [o.repoFullName, o]));

    const toSave: PortfolioAdminEntry[] = body.entries.map((entry) =>
      overrideFromVisibility(
        entry.repoFullName,
        entry.visibility,
        map.get(entry.repoFullName)
      )
    );

    await setPortfolioOverridesInKv(toSave);

    revalidatePath("/", "layout");
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      saved: toSave.length,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Erro ao salvar configurações.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
