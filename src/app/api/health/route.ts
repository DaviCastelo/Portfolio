import { NextResponse } from "next/server";
import { isRedisConfigured } from "@/lib/redis-client";
import { getGitHubUsername } from "@/services/github";

export async function GET() {
  const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
  const githubUsername = getGitHubUsername();
  const adminConfigured = Boolean(process.env.ADMIN_PASSWORD?.trim());

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      redis: isRedisConfigured() ? "configured" : "missing",
      blob: blobConfigured ? "configured" : "missing",
      github: githubUsername ? "configured" : "missing",
      admin: adminConfigured ? "configured" : "missing",
    },
  });
}
