"use client";

import { SectionHeader } from "@/components/layout/section-header";
import { sectionMeta, technologies } from "@/data/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

export function TechnologiesSection() {
  const reduced = useReducedMotion();
  const meta = sectionMeta.technologies;
  const items = [...technologies, ...technologies];

  return (
    <section id="tecnologias" className="section-padding overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={meta.index}
          label={meta.label}
          title={meta.title}
          highlightWord={meta.highlightWord}
          description={meta.description}
        />
      </div>
      <div className="relative mt-8">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
        <div
          className={cn(
            "flex gap-8 whitespace-nowrap",
            !reduced && "animate-marquee"
          )}
        >
          {items.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
