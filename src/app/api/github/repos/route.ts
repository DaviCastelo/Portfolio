import { NextResponse } from "next/server";
import { getMergedProjects } from "@/lib/merge-projects";

export async function GET(request: Request) {
  const secret = process.env.API_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const projects = await getMergedProjects();
  return NextResponse.json({ projects, count: projects.length });
}
