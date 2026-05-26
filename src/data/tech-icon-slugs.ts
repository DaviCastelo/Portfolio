/** Slugs do Simple Icons: https://cdn.simpleicons.org/{slug} */
const SLUG_MAP: Record<string, string> = {
  ".NET": "dotnet",
  ".NET Core": "dotnet",
  "ASP.NET": "dotnet",
  "ASP.NET Core": "dotnet",
  AWS: "amazonaws",
  "AWS Lambda": "awslambda",
  Android: "android",
  Angular: "angular",
  Astro: "astro",
  Azure: "microsoftazure",
  Bootstrap: "bootstrap",
  Bun: "bun",
  "C#": "csharp",
  "C++": "cplusplus",
  CSS: "css3",
  Capacitor: "capacitor",
  Cypress: "cypress",
  Dart: "dart",
  Deno: "deno",
  Django: "django",
  Docker: "docker",
  "Drizzle ORM": "drizzle",
  Electron: "electron",
  Expo: "expo",
  Express: "express",
  FastAPI: "fastapi",
  Fastify: "fastify",
  Firebase: "firebase",
  Flask: "flask",
  Flutter: "flutter",
  Git: "git",
  GitHub: "github",
  "GitHub Actions": "githubactions",
  Go: "go",
  Golang: "go",
  GraphQL: "graphql",
  HTML: "html5",
  HTML5: "html5",
  Java: "openjdk",
  JavaScript: "javascript",
  Jest: "jest",
  Kotlin: "kotlin",
  Kubernetes: "kubernetes",
  Laravel: "laravel",
  Linux: "linux",
  MongoDB: "mongodb",
  MySQL: "mysql",
  NestJS: "nestjs",
  "Next.js": "nextdotjs",
  "NextAuth.js": "nextdotjs",
  "Node.js": "nodedotjs",
  Nuxt: "nuxtdotjs",
  PHP: "php",
  Playwright: "playwright",
  PostgreSQL: "postgresql",
  Prisma: "prisma",
  Python: "python",
  React: "react",
  "React Native": "react",
  Redis: "redis",
  Remix: "remix",
  Ruby: "ruby",
  Rust: "rust",
  Sass: "sass",
  Spring: "spring",
  "Spring Boot": "springboot",
  Supabase: "supabase",
  Svelte: "svelte",
  SvelteKit: "svelte",
  Swift: "swift",
  "Tailwind CSS": "tailwindcss",
  Terraform: "terraform",
  TypeScript: "typescript",
  Unity: "unity",
  Vercel: "vercel",
  "Vercel Blob": "vercel",
  Vite: "vite",
  Vitest: "vitest",
  "Vue.js": "vuedotjs",
  WordPress: "wordpress",
  Zod: "zod",
  "shadcn/ui": "shadcnui",
  "Shadcn UI": "shadcnui",
  tRPC: "trpc",
};

export function getTechIconSlug(name: string): string | null {
  const direct = SLUG_MAP[name];
  if (direct) return direct;

  const normalized = name.trim().toLowerCase();
  const entry = Object.entries(SLUG_MAP).find(
    ([key]) => key.toLowerCase() === normalized
  );
  return entry?.[1] ?? null;
}

export function getTechIconUrl(name: string): string | null {
  const slug = getTechIconSlug(name);
  if (!slug) return null;
  return `https://cdn.simpleicons.org/${slug}`;
}
