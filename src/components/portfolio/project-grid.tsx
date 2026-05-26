"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { ProjectCard } from "./project-card";

const ProjectModal = dynamic(
  () => import("./project-modal").then((m) => m.ProjectModal),
  { ssr: false }
);
import { Button } from "@/components/ui/button";
import { usePortfolioPageSize } from "@/hooks/use-portfolio-page-size";
import type { MergedProject, ProjectCategory } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectGridProps {
  projects: MergedProject[];
}

export function ProjectGrid({ projects }: Readonly<ProjectGridProps>) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [selected, setSelected] = useState<MergedProject | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const pageSize = usePortfolioPageSize();

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((p) => p.category === filter),
    [filter, projects]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageProjects = filtered.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  useEffect(() => {
    setPage(0);
  }, [filter, pageSize]);

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1));
    }
  }, [page, totalPages]);

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
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
        {pageProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={openProject}
          />
        ))}
      </div>

      {filtered.length > pageSize && (
        <nav
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
          aria-label="Paginação do portfólio"
        >
          <p className="font-mono text-xs text-muted-foreground">
            Página {currentPage + 1} de {totalPages}
            <span className="hidden sm:inline">
              {" "}
              · {filtered.length} projetos
            </span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </Button>
            <div className="hidden max-w-full flex-wrap justify-center gap-1 sm:flex">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPage(i)}
                  aria-label={`Ir para página ${i + 1}`}
                  aria-current={i === currentPage ? "page" : undefined}
                  className={cn(
                    "h-9 min-w-9 rounded-lg border px-2 text-sm transition-colors",
                    i === currentPage
                      ? "border-primary/50 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages - 1}
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
              aria-label="Próxima página"
            >
              Próxima
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </nav>
      )}

      <ProjectModal
        project={selected}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
