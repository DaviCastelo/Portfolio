"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { MergedProject } from "@/types/project";

interface ProjectModalProps {
  project: MergedProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectModal({ project, open, onOpenChange }: ProjectModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize text-2xl">{project.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted/30">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover"
              sizes="600px"
            />
          </div>
          <p className="text-muted-foreground">{project.description}</p>
          {project.readmeExcerpt && (
            <p className="text-sm text-muted-foreground/80">{project.readmeExcerpt}…</p>
          )}
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
          {project.architecture && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Arquitetura</h4>
              <p className="text-sm text-muted-foreground">{project.architecture}</p>
            </div>
          )}
          {project.challenges && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Desafios</h4>
              <p className="text-sm text-muted-foreground">{project.challenges}</p>
            </div>
          )}
          {project.solutions && (
            <div>
              <h4 className="mb-2 text-sm font-medium">Soluções</h4>
              <p className="text-sm text-muted-foreground">{project.solutions}</p>
            </div>
          )}
          {project.screenshots.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {project.screenshots.map((src, i) => (
                <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                  <Image src={src} alt="" fill className="object-cover" sizes="300px" />
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
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
