import { z } from "zod";

export const portfolioPatchSchema = z.object({
  title: z.string().trim().max(120).optional(),
  professionalDescription: z.string().max(12000).optional(),
  thumbnail: z.string().max(2048).optional(),
  stack: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  demoUrl: z.string().max(2048).optional(),
  featured: z.boolean().optional(),
  priority: z.number().int().min(-100).max(100).optional(),
  visibility: z.enum(["finished", "in_progress", "hidden"]).optional(),
  category: z.enum(["finished", "in_progress"]).optional(),
  hidden: z.boolean().optional(),
  architecture: z.string().max(8000).optional(),
  challenges: z.string().max(8000).optional(),
  solutions: z.string().max(8000).optional(),
  screenshots: z.array(z.string().url()).max(12).optional(),
  githubUrl: z.string().max(2048).optional(),
});

export const manualProjectSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/i, "Slug inválido."),
  title: z.string().trim().min(2).max(120),
  professionalDescription: z.string().max(12000).optional(),
  thumbnail: z.string().url().max(2048).optional(),
  stack: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
  demoUrl: z.string().url().max(2048).optional(),
  featured: z.boolean().optional(),
  priority: z.number().int().min(-100).max(100).optional(),
  category: z.enum(["finished", "in_progress"]).optional(),
  hidden: z.boolean().optional(),
  architecture: z.string().max(8000).optional(),
  challenges: z.string().max(8000).optional(),
  solutions: z.string().max(8000).optional(),
  screenshots: z.array(z.string().url()).max(12).optional(),
  githubUrl: z.string().url().max(2048).optional(),
});
