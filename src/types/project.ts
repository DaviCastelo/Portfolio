export type ProjectStatus = "finished" | "in_progress" | "archived";
export type ProjectCategory = "finished" | "in_progress";

export interface ProjectOverride {
  repoFullName: string;
  hidden?: boolean;
  featured?: boolean;
  priority?: number;
  thumbnail?: string;
  screenshots?: string[];
  professionalDescription?: string;
  category?: ProjectCategory;
  status?: ProjectStatus;
  demoUrl?: string;
  architecture?: string;
  challenges?: string;
  solutions?: string;
  stack?: string[];
}

export interface MergedProject {
  id: string;
  title: string;
  description: string;
  stars: number;
  languages: Record<string, number>;
  commits?: number;
  updatedAt: string;
  readmeExcerpt?: string;
  githubUrl: string;
  thumbnail: string;
  status: ProjectStatus;
  category: ProjectCategory;
  demoUrl?: string;
  featured: boolean;
  stack: string[];
  architecture?: string;
  challenges?: string;
  solutions?: string;
  screenshots: string[];
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  fork: boolean;
  updated_at: string;
  language: string | null;
  topics?: string[];
}
