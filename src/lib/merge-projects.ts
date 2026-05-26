import { unstable_noStore as noStore } from "next/cache";
import { portfolioConfig } from "@/data/projects-overrides";
import {
  buildStackFromLanguages,
  recordDisplayTitle,
} from "@/lib/portfolio-record";
import { getEffectiveOverrides, getRecordsMap } from "@/lib/portfolio-admin-merge";
import {
  fetchReadmeExcerpt,
  fetchRepoLanguages,
  fetchUserRepos,
  getGitHubUsername,
} from "@/services/github";
import type { PortfolioProjectRecord } from "@/types/portfolio-admin";
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
  record?: PortfolioProjectRecord,
  updatedAt?: string
): ProjectCategory {
  if (override?.category) return override.category;
  if (record?.category) return record.category;
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

function projectThumbnail(
  id: string,
  override?: ProjectOverride
): string {
  if (override?.thumbnail) return override.thumbnail;
  if (!id.includes("/")) {
    return portfolioConfig.defaultThumbnail;
  }
  return `https://opengraph.githubassets.com/1/${id}`;
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

function mergedFromRecord(
  record: PortfolioProjectRecord,
  override?: ProjectOverride
): MergedProject {
  const id = record.source === "github" ? record.repoFullName ?? record.id : record.id;
  const languages = record.languages ?? {};
  const stack =
    override?.stack ??
    record.stack ??
    buildStackFromLanguages(languages, null);

  const updatedAt =
    record.updatedAt ?? new Date().toISOString();

  const category = inferCategory(override, record, updatedAt);

  const description =
    override?.professionalDescription ??
    record.professionalDescription ??
    record.githubDescription ??
    "Projeto em desenvolvimento pela Kairos tecnologias.";

  return {
    id,
    title: recordDisplayTitle(record),
    description,
    stars: record.stars ?? 0,
    languages,
    updatedAt,
    readmeExcerpt: record.readmeExcerpt,
    githubUrl:
      record.githubUrl ??
      (record.source === "github" && record.repoFullName
        ? `https://github.com/${record.repoFullName}`
        : "#"),
    thumbnail: projectThumbnail(id, override),
    status: inferStatus(override, category),
    category,
    demoUrl: override?.demoUrl ?? record.demoUrl,
    featured: override?.featured ?? record.featured ?? false,
    stack,
    architecture: override?.architecture ?? record.architecture,
    challenges: override?.challenges ?? record.challenges,
    solutions: override?.solutions ?? record.solutions,
    screenshots: override?.screenshots ?? record.screenshots ?? [],
  };
}

async function enrichRepo(
  repo: GitHubRepo,
  record: PortfolioProjectRecord | undefined,
  override?: ProjectOverride
): Promise<MergedProject> {
  const [owner, name] = repo.full_name.split("/");

  const useSnapshot = Boolean(
    record &&
      (record.lastSyncedAt || record.languages) &&
      Object.keys(record.languages ?? {}).length > 0
  );

  let languages: Record<string, number>;
  let readmeExcerpt: string | undefined;

  if (useSnapshot && record) {
    languages = record.languages ?? {};
    readmeExcerpt = record.readmeExcerpt;
  } else {
    [languages, readmeExcerpt] = await Promise.all([
      fetchRepoLanguages(owner, name),
      fetchReadmeExcerpt(owner, name),
    ]);
  }

  const stack =
    override?.stack ??
    record?.stack ??
    buildStackFromLanguages(languages, repo.language);

  const description =
    override?.professionalDescription ??
    record?.professionalDescription ??
    record?.githubDescription ??
    repo.description ??
    "Projeto em desenvolvimento pela Kairos tecnologias.";

  const mergedRecord: PortfolioProjectRecord = {
    ...(record ?? {
      id: repo.full_name,
      source: "github",
      repoFullName: repo.full_name,
    }),
    stars: record?.stars ?? repo.stargazers_count,
    languages,
    readmeExcerpt,
    updatedAt: record?.updatedAt ?? repo.updated_at,
    githubDescription: record?.githubDescription ?? repo.description,
    githubUrl: repo.html_url,
  };

  const base = mergedFromRecord(mergedRecord, override);
  return {
    ...base,
    stars: mergedRecord.stars ?? repo.stargazers_count,
    languages,
    readmeExcerpt,
    updatedAt: mergedRecord.updatedAt ?? repo.updated_at,
    description,
    stack,
    githubUrl: repo.html_url,
    thumbnail: projectThumbnail(repo.full_name, override),
  };
}

export async function getMergedProjects(): Promise<MergedProject[]> {
  noStore();
  const username = getGitHubUsername();
  const recordsMap = await getRecordsMap();
  const overrides = await overrideMap();

  const manualRecords = Array.from(recordsMap.values()).filter(
    (r) => r.source === "manual" && !r.hidden
  );

  const manualMerged = manualRecords.map((record) => {
    const override = overrides.get(record.id);
    return mergedFromRecord(record, override);
  });

  if (!username) {
    return manualMerged.sort((a, b) => sortProjects(a, b, overrides));
  }

  const repos = await fetchUserRepos(username);

  const filtered = repos.filter((repo) => {
    const record = recordsMap.get(repo.full_name);
    const o = overrides.get(repo.full_name);
    if (record?.hidden || o?.hidden) return false;
    if (!portfolioConfig.includeForks && repo.fork) return false;
    return true;
  });

  const githubMerged = await Promise.all(
    filtered.map((repo) =>
      enrichRepo(
        repo,
        recordsMap.get(repo.full_name),
        overrides.get(repo.full_name)
      )
    )
  );

  const merged = [...githubMerged, ...manualMerged];
  return merged.sort((a, b) => sortProjects(a, b, overrides));
}

export function filterByCategory(
  projects: MergedProject[],
  category: ProjectCategory
): MergedProject[] {
  return projects.filter((p) => p.category === category);
}
