"use client";

import { useEffect, useState } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import Link from "next/link";
import { ExternalLink, GitBranch } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TechBadge } from "@/components/portfolio/tech-badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { portfolioConfig } from "@/data/projects-overrides";
import { ProjectMarkdown } from "@/components/portfolio/project-markdown";
import type { MergedProject } from "@/types/project";

type ProjectModalProps = Readonly<{
  project: MergedProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>;

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  const [thumbSrc, setThumbSrc] = useState(project?.thumbnail ?? "");
  const fallbackThumb = portfolioConfig.defaultThumbnail;

  useEffect(() => {
    if (project) setThumbSrc(project.thumbnail);
  }, [project]);

  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        aria-describedby="project-modal-description"
      >
        <DialogHeader>
          <DialogTitle className="capitalize text-2xl">{project.title}</DialogTitle>
        </DialogHeader>
        <div id="project-modal-description" className="space-y-6">
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted/30 p-3 sm:p-4">
            <OptimizedImage
              key={thumbSrc}
              src={thumbSrc}
              alt={project.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 600px"
              onError={() => {
                if (thumbSrc !== fallbackThumb) setThumbSrc(fallbackThumb);
              }}
            />
          </div>
          <ProjectMarkdown content={project.description} />
          {project.readmeExcerpt && (
            <p className="text-sm text-muted-foreground/80">{project.readmeExcerpt}…</p>
          )}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
          {project.architecture && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Arquitetura</h4>
              <ProjectMarkdown
                content={project.architecture}
                className="text-sm"
              />
            </div>
          )}
          {project.challenges && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Desafios</h4>
              <ProjectMarkdown content={project.challenges} className="text-sm" />
            </div>
          )}
          {project.solutions && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Soluções</h4>
              <ProjectMarkdown content={project.solutions} className="text-sm" />
            </div>
          )}
          {project.screenshots.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {project.screenshots.map((src, index) => (
                <div key={src} className="relative aspect-video rounded-lg overflow-hidden">
                  <OptimizedImage
                    src={src}
                    alt={`Screenshot ${index + 1} de ${project.title}`}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
              ))}
            </div>
          )}
          <Separator />
          <div className="flex flex-wrap gap-3">
            {project.demoUrl && (
              <Button asChild>
                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Ver demo
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <GitBranch className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
