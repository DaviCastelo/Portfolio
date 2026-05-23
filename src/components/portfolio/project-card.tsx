"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MergedProject } from "@/types/project";
import { useTilt } from "@/hooks/use-tilt";

interface ProjectCardProps {
  project: MergedProject;
  onOpen: (project: MergedProject) => void;
}

const statusLabels = {
  finished: "Finalizado",
  in_progress: "Em andamento",
  archived: "Arquivado",
};

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { ref, onMove, onLeave } = useTilt(5);
  const mainLang = project.stack[0] ?? Object.keys(project.languages)[0];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
      onClick={() => onOpen(project)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(project)}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalhes de ${project.title}`}
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="glass glass-hover overflow-hidden rounded-xl transition-shadow hover:shadow-[0_0_40px_-12px_rgba(10,132,255,0.25)]"
      >
        <div className="relative aspect-video overflow-hidden bg-muted/30">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
          {project.featured && (
            <Badge className="absolute left-3 top-3">Destaque</Badge>
          )}
        </div>
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{statusLabels[project.status]}</Badge>
            {mainLang && <Badge variant="outline">{mainLang}</Badge>}
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3" />
              {project.stars}
            </span>
          </div>
          <h3 className="font-semibold capitalize">{project.title}</h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            {project.demoUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Demo
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
