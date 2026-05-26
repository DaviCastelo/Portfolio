import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getPortfolioProjectsFromKv } from "@/services/portfolio-kv";

export async function GET() {
  const authError = await requireAdmin();
  if (authError) return authError;

  const records = await getPortfolioProjectsFromKv();
  const body = JSON.stringify(records, null, 2);
  const filename = `portfolio-projects-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
