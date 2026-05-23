import { projectOverrides } from "@/data/projects-overrides";
import { getPortfolioOverridesFromKv } from "@/services/portfolio-kv";
import type { PortfolioAdminEntry, PortfolioVisibility } from "@/types/portfolio-admin";
import type { ProjectOverride } from "@/types/project";

export async function getEffectiveOverrides(): Promise<ProjectOverride[]> {
  const kvEntries = await getPortfolioOverridesFromKv();
  const map = new Map<string, ProjectOverride>();

  for (const o of projectOverrides) {
    map.set(o.repoFullName, { ...o });
  }

  for (const entry of kvEntries) {
    const existing = map.get(entry.repoFullName) ?? {
      repoFullName: entry.repoFullName,
    };
    map.set(entry.repoFullName, {
      ...existing,
      ...entry,
      repoFullName: entry.repoFullName,
    });
  }

  return Array.from(map.values());
}

export function visibilityFromOverride(
  override?: ProjectOverride,
  updatedAt?: string
): PortfolioVisibility {
  if (override?.hidden) return "hidden";
  if (override?.category === "in_progress") return "in_progress";
  if (override?.category === "finished") return "finished";
  if (!updatedAt) return "in_progress";
  const days =
    (Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  return days > 90 ? "finished" : "in_progress";
}

export function overrideFromVisibility(
  repoFullName: string,
  visibility: PortfolioVisibility,
  existing?: ProjectOverride
): PortfolioAdminEntry {
  if (visibility === "hidden") {
    return {
      repoFullName,
      hidden: true,
      priority: existing?.priority,
    };
  }
  return {
    repoFullName,
    hidden: false,
    category: visibility,
    priority: existing?.priority,
  };
}
