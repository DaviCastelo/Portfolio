import type { GitHubRepo } from "@/types/project";

const GITHUB_API = "https://api.github.com";
const REVALIDATE = 3600;

function headers(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: headers(),
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  if (!username) return [];
  const url = `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=100`;
  const repos = await fetchJson<GitHubRepo[]>(url);
  return repos ?? [];
}

export async function fetchRepoLanguages(
  owner: string,
  repo: string
): Promise<Record<string, number>> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/languages`;
  const data = await fetchJson<Record<string, number>>(url);
  return data ?? {};
}

export async function fetchReadmeExcerpt(
  owner: string,
  repo: string
): Promise<string | undefined> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/readme`;
  try {
    const res = await fetch(url, {
      headers: {
        ...headers(),
        Accept: "application/vnd.github.raw",
      },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return undefined;
    const text = await res.text();
    return text.slice(0, 400).replace(/\n+/g, " ").trim();
  } catch {
    return undefined;
  }
}

export function getGitHubUsername(): string | undefined {
  return process.env.GITHUB_USERNAME;
}
