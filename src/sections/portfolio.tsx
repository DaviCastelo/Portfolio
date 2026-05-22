import { SectionHeader } from "@/components/layout/section-header";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { sectionMeta } from "@/data/site";
import { getMergedProjects } from "@/lib/merge-projects";

export async function PortfolioSection() {
  const projects = await getMergedProjects();
  const meta = sectionMeta.portfolio;

  return (
    <section id="portfolio" className="section-padding">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={meta.index}
          label={meta.label}
          title={meta.title}
          highlightWord={meta.highlightWord}
          description={meta.description}
        />
        <ProjectGrid projects={projects} />
      </div>
    </section>
  );
}
