import {
  buildStackFromLanguages,
  githubRepoToRecord,
  newGithubRecord,
} from "@/lib/portfolio-record";
import {
  fetchReadmeExcerpt,
  fetchRepoByFullName,
  fetchRepoLanguages,
} from "@/services/github";
import { upsertPortfolioProject } from "@/services/portfolio-kv";
import type {
  PortfolioProjectRecord,
  SyncGitHubBody,
} from "@/types/portfolio-admin";

export async function syncGithubProject(
  id: string,
  existing: PortfolioProjectRecord | undefined,
  options: SyncGitHubBody = {}
): Promise<PortfolioProjectRecord> {
  const repoFullName = existing?.repoFullName ?? id;
  const [owner, name] = repoFullName.split("/");
  if (!owner || !name) {
    throw new Error("Repositório GitHub inválido.");
  }

  const repo = await fetchRepoByFullName(repoFullName);
  if (!repo) {
    throw new Error("Repositório não encontrado no GitHub.");
  }

  const [languages, readmeExcerpt] = await Promise.all([
    fetchRepoLanguages(owner, name),
    fetchReadmeExcerpt(owner, name),
  ]);

  const base = githubRepoToRecord(
    repo,
    existing ?? newGithubRecord(repoFullName)
  );

  const updated: PortfolioProjectRecord = {
    ...base,
    languages,
    readmeExcerpt,
    lastSyncedAt: new Date().toISOString(),
  };

  if (options.restoreDescription) {
    updated.githubDescription = repo.description;
    if (!existing?.professionalDescription) {
      updated.professionalDescription = repo.description ?? undefined;
    }
  }

  if (options.restoreStack) {
    updated.stack = buildStackFromLanguages(languages, repo.language);
  }

  return upsertPortfolioProject(updated);
}
