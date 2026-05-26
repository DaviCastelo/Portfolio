"use client";

import { useState, type MouseEvent } from "react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { motion } from "framer-motion";
import { ExternalLink, GitBranch, Star } from "lucide-react";
import { TechBadge } from "@/components/portfolio/tech-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portfolioConfig } from "@/data/projects-overrides";
import { markdownToPlainPreview } from "@/components/portfolio/project-markdown";
import type { MergedProject } from "@/types/project";
import { useTilt } from "@/hooks/use-tilt";

type ProjectCardProps = Readonly<{
  project: MergedProject;
  onOpen: (project: MergedProject) => void;
}>;

const categoryLabels = {
  finished: "Finalizado",
  in_progress: "Em andamento",
};

function stopCardActivation(event: MouseEvent) {
  event.stopPropagation();
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { ref, onMove, onLeave } = useTilt(5);
  const techStack =
    project.stack.length > 0
      ? project.stack
      : Object.keys(project.languages);
  const [thumbSrc, setThumbSrc] = useState(project.thumbnail);
  const fallbackThumb = portfolioConfig.defaultThumbnail;

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
      onClick={() => onOpen(project)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${project.title}`}
    >
      <div className="glass glass-hover overflow-hidden rounded-xl transition-shadow hover:shadow-[0_0_40px_-12px_rgba(10,132,255,0.25)]">
        <div className="relative aspect-video overflow-hidden bg-muted/30 p-2">
          <OptimizedImage
            key={thumbSrc}
            src={thumbSrc}
            alt={project.title}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            loading="lazy"
            onError={() => {
              if (thumbSrc !== fallbackThumb) setThumbSrc(fallbackThumb);
            }}
          />
          {project.featured && (
            <Badge className="absolute left-3 top-3">Destaque</Badge>
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {categoryLabels[project.category]}
            </Badge>
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3" />
              {project.stars}
            </span>
          </div>
          <h3 className="font-semibold capitalize">{project.title}</h3>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {techStack.map((tech) => (
                <TechBadge
                  key={tech}
                  name={tech}
                  variant="outline"
                  className="text-xs"
                />
              ))}
            </div>
          )}
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {markdownToPlainPreview(project.description)}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {project.demoUrl && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={stopCardActivation}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Demo
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopCardActivation}
              >
                <GitBranch className="h-3.5 w-3.5" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
