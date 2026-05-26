import type {
  PortfolioProjectRecord,
  PortfolioProjectSource,
  PortfolioVisibility,
} from "@/types/portfolio-admin";
import type {
  GitHubRepo,
  ProjectCategory,
  ProjectOverride,
} from "@/types/project";

export function githubProjectId(repoFullName: string): string {
  return repoFullName;
}

export function manualProjectId(slug: string): string {
  const clean = slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `manual:${clean || "projeto"}`;
}

export function parseProjectIdFromParam(param: string): string {
  return decodeURIComponent(param);
}

export function recordToProjectOverride(
  record: PortfolioProjectRecord
): ProjectOverride {
  const repoFullName =
    record.source === "github"
      ? record.repoFullName ?? record.id
      : record.id;

  return {
    repoFullName,
    hidden: record.hidden,
    featured: record.featured,
    priority: record.priority,
    thumbnail: record.thumbnail,
    screenshots: record.screenshots,
    professionalDescription: record.professionalDescription,
    category: record.category,
    demoUrl: record.demoUrl,
    architecture: record.architecture,
    challenges: record.challenges,
    solutions: record.solutions,
    stack: record.stack,
  };
}

export function legacyEntryToRecord(
  entry: { repoFullName: string; category?: ProjectCategory; hidden?: boolean; priority?: number }
): PortfolioProjectRecord {
  return {
    id: entry.repoFullName,
    source: "github",
    repoFullName: entry.repoFullName,
    category: entry.category,
    hidden: entry.hidden,
    priority: entry.priority,
  };
}

export function visibilityFromRecord(
  record?: PortfolioProjectRecord,
  updatedAt?: string
): PortfolioVisibility {
  if (record?.hidden) return "hidden";
  if (record?.category === "in_progress") return "in_progress";
  if (record?.category === "finished") return "finished";
  if (!updatedAt) return "in_progress";
  const days =
    (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  return days > 90 ? "finished" : "in_progress";
}

export function applyVisibilityToRecord(
  record: PortfolioProjectRecord,
  visibility: PortfolioVisibility
): PortfolioProjectRecord {
  if (visibility === "hidden") {
    return { ...record, hidden: true };
  }
  return {
    ...record,
    hidden: false,
    category: visibility,
  };
}

export function githubRepoToRecord(
  repo: GitHubRepo,
  existing?: PortfolioProjectRecord
): PortfolioProjectRecord {
  const id = repo.full_name;
  return {
    ...existing,
    id,
    source: "github",
    repoFullName: repo.full_name,
    githubUrl: repo.html_url,
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    githubDescription: repo.description,
  };
}

export function buildStackFromLanguages(
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

export function recordDisplayTitle(record: PortfolioProjectRecord): string {
  if (record.title) return record.title;
  if (record.source === "github" && record.repoFullName) {
    const name = record.repoFullName.split("/")[1] ?? record.repoFullName;
    return name.replace(/-/g, " ");
  }
  if (record.slug) return record.slug.replace(/-/g, " ");
  return "Projeto";
}

export function newGithubRecord(repoFullName: string): PortfolioProjectRecord {
  return {
    id: repoFullName,
    source: "github",
    repoFullName,
    githubUrl: `https://github.com/${repoFullName}`,
  };
}

export function newManualRecord(
  slug: string,
  data: Partial<PortfolioProjectRecord>
): PortfolioProjectRecord {
  const id = manualProjectId(slug);
  return {
    hidden: false,
    category: "finished",
    stack: [],
    screenshots: [],
    ...data,
    id,
    source: "manual",
    slug: slug.trim().toLowerCase(),
  };
}

export function isManualId(id: string): boolean {
  return id.startsWith("manual:");
}

export function sourceFromId(id: string): PortfolioProjectSource {
  return isManualId(id) ? "manual" : "github";
}
