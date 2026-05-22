"use client";

import { BrandIcon } from "@/components/brand/brand-icon";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { sectionMeta, services } from "@/data/site";
import { useTilt } from "@/hooks/use-tilt";

function ServiceCard({
  title,
  description,
  icon: Icon,
}: (typeof services)[0]) {
  const { ref, onMove, onLeave } = useTilt(6);

  return (
    <BentoCard>
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="flex h-full flex-col"
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </BentoCard>
  );
}

export function ServicesSection() {
  const meta = sectionMeta.services;

  return (
    <section id="servicos" className="section-padding bg-white/[0.01]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-start justify-between gap-4">
          <SectionHeader
            index={meta.index}
            label={meta.label}
            title={meta.title}
            highlightWord={meta.highlightWord}
            description={meta.description}
          />
          <Reveal className="hidden shrink-0 md:block">
            <BrandIcon variant="iconSquircleBlue" size="sm" animate="pulse" />
          </Reveal>
        </div>
        <BentoGrid>
          {services.map((service) => (
            <div
              key={service.id}
              className={service.featured ? "md:col-span-2 md:row-span-2" : undefined}
            >
              <Reveal>
                <ServiceCard {...service} />
              </Reveal>
            </div>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
