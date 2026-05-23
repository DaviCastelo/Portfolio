import type { ProjectCategory } from "@/types/project";

export type PortfolioVisibility = "finished" | "in_progress" | "hidden";

export interface PortfolioAdminEntry {
  repoFullName: string;
  category?: ProjectCategory;
  hidden?: boolean;
  priority?: number;
}

export interface PortfolioAdminRepoItem {
  repoFullName: string;
  name: string;
  description: string | null;
  visibility: PortfolioVisibility;
  stars: number;
  updatedAt: string;
}
