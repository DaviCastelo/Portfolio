import type { ProjectCategory } from "@/types/project";

export type PortfolioVisibility = "finished" | "in_progress" | "hidden";
export type PortfolioProjectSource = "github" | "manual";

/** @deprecated Use PortfolioProjectRecord */
export interface PortfolioAdminEntry {
  repoFullName: string;
  category?: ProjectCategory;
  hidden?: boolean;
  priority?: number;
}

export interface PortfolioProjectRecord {
  id: string;
  source: PortfolioProjectSource;
  repoFullName?: string;
  slug?: string;

  title?: string;
  professionalDescription?: string;
  thumbnail?: string;
  stack?: string[];
  demoUrl?: string;
  featured?: boolean;
  priority?: number;
  category?: ProjectCategory;
  hidden?: boolean;
  architecture?: string;
  challenges?: string;
  solutions?: string;
  screenshots?: string[];

  stars?: number;
  languages?: Record<string, number>;
  updatedAt?: string;
  readmeExcerpt?: string;
  githubDescription?: string | null;
  githubUrl?: string;

  lastSyncedAt?: string;
}

export interface PortfolioAdminRepoItem {
  id: string;
  source: PortfolioProjectSource;
  repoFullName: string;
  name: string;
  description: string | null;
  visibility: PortfolioVisibility;
  stars: number;
  updatedAt: string;

  title?: string;
  professionalDescription?: string;
  thumbnail?: string;
  stack?: string[];
  demoUrl?: string;
  featured?: boolean;
  priority?: number;
  architecture?: string;
  challenges?: string;
  solutions?: string;
  screenshots?: string[];
  lastSyncedAt?: string;
  githubUrl?: string;
}

export interface PortfolioAdminListResponse {
  items: PortfolioAdminRepoItem[];
  kvConfigured: boolean;
  kvCount: number;
}

export interface SyncGitHubBody {
  restoreDescription?: boolean;
  restoreStack?: boolean;
}

export interface CreateManualProjectBody {
  slug: string;
  title: string;
  professionalDescription?: string;
  thumbnail?: string;
  stack?: string[];
  demoUrl?: string;
  featured?: boolean;
  priority?: number;
  category?: ProjectCategory;
  hidden?: boolean;
  architecture?: string;
  challenges?: string;
  solutions?: string;
  screenshots?: string[];
  githubUrl?: string;
}
