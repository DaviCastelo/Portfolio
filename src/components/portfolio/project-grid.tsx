"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
import type { MergedProject, ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: MergedProject[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [selected, setSelected] = useState<MergedProject | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  const openProject = (project: MergedProject) => {
    setSelected(project);
    setModalOpen(true);
  };

  if (projects.length === 0) {
    return (
      <div className="glass rounded-xl p-12 text-center">
        <p className="text-muted-foreground">
          Configure <code className="text-primary">GITHUB_USERNAME</code> no
          arquivo <code className="text-primary">.env</code> para exibir seus
          repositórios. Use{" "}
          <code className="text-primary">projects-overrides.ts</code> para
          enriquecer cada case.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: "Todos" },
            { key: "finished", label: "Finalizados" },
            { key: "in_progress", label: "Em andamento" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm transition-colors",
              filter === tab.key
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-white/[0.08] text-muted-foreground hover:border-white/20"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={openProject}
          />
        ))}
      </div>
      <ProjectModal
        project={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
