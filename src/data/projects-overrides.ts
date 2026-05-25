import type { ProjectOverride } from "@/types/project";

/**
 * Complemente manualmente cada repositório do GitHub.
 * Exemplo:
 * {
 *   repoFullName: "usuario/meu-projeto",
 *   featured: true,
 *   priority: 10,
 *   category: "finished",
 *   thumbnail: "/projects/meu-projeto.png",
 *   demoUrl: "https://demo.exemplo.com",
 *   professionalDescription: "Descrição comercial do case.",
 * }
 */
export const projectOverrides: ProjectOverride[] = [];

export const portfolioConfig = {
  includeForks: false,
  defaultThumbnail: "/brand/Icones6.png?v=6",
};
