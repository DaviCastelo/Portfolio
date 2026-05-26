import {
  recordDisplayTitle,
  visibilityFromRecord,
} from "@/lib/portfolio-record";
import type {
  PortfolioAdminRepoItem,
  PortfolioProjectRecord,
} from "@/types/portfolio-admin";
import type { GitHubRepo } from "@/types/project";

export function recordToAdminItem(
  record: PortfolioProjectRecord,
  repo?: GitHubRepo
): PortfolioAdminRepoItem {
  const repoFullName =
    record.source === "github"
      ? record.repoFullName ?? record.id
      : record.id;

  const updatedAt =
    record.updatedAt ?? repo?.updated_at ?? new Date().toISOString();

  return {
    id: record.id,
    source: record.source,
    repoFullName,
    name: recordDisplayTitle(record),
    description:
      record.professionalDescription ??
      record.githubDescription ??
      repo?.description ??
      null,
    visibility: visibilityFromRecord(record, updatedAt),
    stars: record.stars ?? repo?.stargazers_count ?? 0,
    updatedAt,
    title: record.title,
    professionalDescription: record.professionalDescription,
    thumbnail: record.thumbnail,
    stack: record.stack,
    demoUrl: record.demoUrl,
    featured: record.featured,
    priority: record.priority,
    architecture: record.architecture,
    challenges: record.challenges,
    solutions: record.solutions,
    screenshots: record.screenshots,
    lastSyncedAt: record.lastSyncedAt,
    githubUrl: record.githubUrl ?? repo?.html_url,
  };
}

export function githubRepoToAdminItem(
  repo: GitHubRepo,
  record?: PortfolioProjectRecord
): PortfolioAdminRepoItem {
  const baseRecord: PortfolioProjectRecord = record ?? {
    id: repo.full_name,
    source: "github",
    repoFullName: repo.full_name,
    githubUrl: repo.html_url,
    stars: repo.stargazers_count,
    updatedAt: repo.updated_at,
    githubDescription: repo.description,
  };
  return recordToAdminItem(baseRecord, repo);
}
