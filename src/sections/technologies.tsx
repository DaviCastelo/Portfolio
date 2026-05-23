import { TechnologiesMarquee } from "@/components/motion/technologies-marquee";
import { SectionHeader } from "@/components/layout/section-header";
import { sectionMeta } from "@/data/site";

export function TechnologiesSection() {
  const meta = sectionMeta.technologies;

  return (
    <section id="tecnologias" className="section-padding">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={meta.index}
          label={meta.label}
          title={meta.title}
          highlightWord={meta.highlightWord}
          description={meta.description}
        />
      </div>
      <TechnologiesMarquee />
    </section>
  );
}
