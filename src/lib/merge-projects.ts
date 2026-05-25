import { unstable_noStore as noStore } from "next/cache";
import { portfolioConfig } from "@/data/projects-overrides";
import { getEffectiveOverrides } from "@/lib/portfolio-admin-merge";
import {
  fetchReadmeExcerpt,
  fetchRepoLanguages,
  fetchUserRepos,
  getGitHubUsername,
} from "@/services/github";
import type {
  GitHubRepo,
  MergedProject,
  ProjectCategory,
  ProjectOverride,
  ProjectStatus,
} from "@/types/project";

async function overrideMap(): Promise<Map<string, ProjectOverride>> {
  const list = await getEffectiveOverrides();
  return new Map(list.map((o) => [o.repoFullName, o]));
}

function inferCategory(
  override?: ProjectOverride,
  updatedAt?: string
): ProjectCategory {
  if (override?.category) return override.category;
  if (!updatedAt) return "in_progress";
  const days =
    (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  return days > 90 ? "finished" : "in_progress";
}

function inferStatus(
  override: ProjectOverride | undefined,
  category: ProjectCategory
): ProjectStatus {
  if (override?.status) return override.status;
  return category === "in_progress" ? "in_progress" : "finished";
}

function repoThumbnail(
  repoFullName: string,
  override?: ProjectOverride
): string {
  if (override?.thumbnail) return override.thumbnail;
  return `https://opengraph.githubassets.com/1/${repoFullName}`;
}

function buildStack(
  languages: Record<string, number>,
  fallbackLanguage?: string | null
): string[] {
  const sorted = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);

  if (fallbackLanguage && !sorted.includes(fallbackLanguage)) {
    sorted.unshift(fallbackLanguage);
  }

  return sorted;
}

function sortProjects(
  a: MergedProject,
  b: MergedProject,
  overrides: Map<string, ProjectOverride>
): number {
  const pa = overrides.get(a.id)?.priority ?? 0;
  const pb = overrides.get(b.id)?.priority ?? 0;
  if (pb !== pa) return pb - pa;
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (b.stars !== a.stars) return b.stars - a.stars;
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

async function enrichRepo(
  repo: GitHubRepo,
  override?: ProjectOverride
): Promise<MergedProject> {
  const [owner, name] = repo.full_name.split("/");
  const [languages, readmeExcerpt] = await Promise.all([
    fetchRepoLanguages(owner, name),
    fetchReadmeExcerpt(owner, name),
  ]);

  const stack =
    override?.stack ?? buildStack(languages, repo.language);

  const category = inferCategory(override, repo.updated_at);

  return {
    id: repo.full_name,
    title: repo.name.replace(/-/g, " "),
    description:
      override?.professionalDescription ??
      repo.description ??
      "Projeto em desenvolvimento pela Kairós tecnologias.",
    stars: repo.stargazers_count,
    languages,
    updatedAt: repo.updated_at,
    readmeExcerpt,
    githubUrl: repo.html_url,
    thumbnail: repoThumbnail(repo.full_name, override),
    status: inferStatus(override, category),
    category,
    demoUrl: override?.demoUrl,
    featured: override?.featured ?? false,
    stack,
    architecture: override?.architecture,
    challenges: override?.challenges,
    solutions: override?.solutions,
    screenshots: override?.screenshots ?? [],
  };
}

export async function getMergedProjects(): Promise<MergedProject[]> {
  noStore();
  const username = getGitHubUsername();
  if (!username) return [];

  const repos = await fetchUserRepos(username);
  const overrides = await overrideMap();

  const filtered = repos.filter((repo) => {
    const o = overrides.get(repo.full_name);
    if (o?.hidden) return false;
    if (!portfolioConfig.includeForks && repo.fork) return false;
    return true;
  });

  const merged = await Promise.all(
    filtered.map((repo) => enrichRepo(repo, overrides.get(repo.full_name)))
  );

  return merged.sort((a, b) => sortProjects(a, b, overrides));
}

export function filterByCategory(
  projects: MergedProject[],
  category: ProjectCategory
): MergedProject[] {
  return projects.filter((p) => p.category === category);
}
