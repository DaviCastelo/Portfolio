import { NextResponse } from "next/server";
import { applyVisibilityToRecord, isManualId } from "@/lib/portfolio-record";
import { getPortfolioProjectById } from "@/services/portfolio-kv";
import type { PortfolioProjectRecord } from "@/types/portfolio-admin";
import type { portfolioPatchSchema } from "@/utils/admin-validators";
import type { z } from "zod";

export type PortfolioPatchBody = z.infer<typeof portfolioPatchSchema>;

type ResolveResult =
  | { record: PortfolioProjectRecord }
  | { error: NextResponse };

export async function getOrCreateRecordForPatch(
  id: string
): Promise<ResolveResult> {
  const existing = await getPortfolioProjectById(id);
  if (existing) return { record: existing };

  if (isManualId(id)) {
    return {
      error: NextResponse.json(
        { error: "Projeto manual não encontrado." },
        { status: 404 }
      ),
    };
  }

  return {
    record: {
      id,
      source: "github",
      repoFullName: id,
      githubUrl: `https://github.com/${id}`,
    },
  };
}

export function patchBodyToRecordFields(
  body: PortfolioPatchBody
): Partial<PortfolioProjectRecord> {
  const patch: Partial<PortfolioProjectRecord> = {};

  if (body.title !== undefined) patch.title = body.title;
  if (body.professionalDescription !== undefined) {
    patch.professionalDescription = body.professionalDescription;
  }
  if (body.thumbnail !== undefined) patch.thumbnail = body.thumbnail || undefined;
  if (body.stack !== undefined) patch.stack = body.stack;
  if (body.demoUrl !== undefined) patch.demoUrl = body.demoUrl || undefined;
  if (body.featured !== undefined) patch.featured = body.featured;
  if (body.priority !== undefined) patch.priority = body.priority;
  if (body.architecture !== undefined) patch.architecture = body.architecture;
  if (body.challenges !== undefined) patch.challenges = body.challenges;
  if (body.solutions !== undefined) patch.solutions = body.solutions;
  if (body.screenshots !== undefined) patch.screenshots = body.screenshots;
  if (body.githubUrl !== undefined) patch.githubUrl = body.githubUrl || undefined;
  if (body.category !== undefined) patch.category = body.category;
  if (body.hidden !== undefined) patch.hidden = body.hidden;

  return patch;
}

export function mergePortfolioPatch(
  record: PortfolioProjectRecord,
  body: PortfolioPatchBody,
  id: string
): PortfolioProjectRecord {
  const patch = patchBodyToRecordFields(body);
  let updated: PortfolioProjectRecord = { ...record, ...patch, id };

  if (body.visibility !== undefined) {
    updated = applyVisibilityToRecord(updated, body.visibility);
  }

  return updated;
}
