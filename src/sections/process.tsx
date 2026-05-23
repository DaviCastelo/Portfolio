import { BrandIcon } from "@/components/brand/brand-icon";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { processSteps, sectionMeta } from "@/data/site";

export function ProcessSection() {
  const meta = sectionMeta.process;

  return (
    <section id="processo" className="section-padding">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={meta.index}
          label={meta.label}
          title={meta.title}
          highlightWord={meta.highlightWord}
          description={meta.description}
        />
        <div className="relative">
          <div className="absolute left-4 top-0 hidden h-full w-px bg-border md:block" />
          <div className="space-y-8 md:space-y-12">
            {processSteps.map((step, i) => (
              <Reveal key={step.step} delay={i * 0.05}>
                <div className="relative flex gap-6 md:gap-10">
                  <div className="relative z-10 flex shrink-0 items-start">
                    {i % 2 === 1 ? (
                      <BrandIcon variant="iconCircleLight" size="sm" animate="none" />
                    ) : (
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 font-mono text-sm text-primary">
                        {step.step}
                      </span>
                    )}
                  </div>
                  <div className="pb-2 pt-1">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
