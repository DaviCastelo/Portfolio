import { projectOverrides } from "@/data/projects-overrides";
import {
  recordToProjectOverride,
  visibilityFromRecord,
} from "@/lib/portfolio-record";
import { getPortfolioProjectsFromKv } from "@/services/portfolio-kv";
import type {
  PortfolioProjectRecord,
  PortfolioVisibility,
} from "@/types/portfolio-admin";
import type { ProjectOverride } from "@/types/project";

export async function getPortfolioRecords(): Promise<PortfolioProjectRecord[]> {
  return getPortfolioProjectsFromKv();
}

export async function getEffectiveOverrides(): Promise<ProjectOverride[]> {
  const kvRecords = await getPortfolioProjectsFromKv();
  const map = new Map<string, ProjectOverride>();

  for (const o of projectOverrides) {
    map.set(o.repoFullName, { ...o });
  }

  for (const record of kvRecords) {
    const key =
      record.source === "github"
        ? record.repoFullName ?? record.id
        : record.id;
    const existing = map.get(key) ?? { repoFullName: key };
    const fromRecord = recordToProjectOverride(record);
    map.set(key, {
      ...existing,
      ...fromRecord,
      repoFullName: key,
    });
  }

  return Array.from(map.values());
}

export async function getRecordsMap(): Promise<
  Map<string, PortfolioProjectRecord>
> {
  const records = await getPortfolioProjectsFromKv();
  return new Map(records.map((r) => [r.id, r]));
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

export { visibilityFromRecord };
