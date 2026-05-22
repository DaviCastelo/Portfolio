import { BrandIcon } from "@/components/brand/brand-icon";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { differentials, sectionMeta } from "@/data/site";

export function DifferentialsSection() {
  const meta = sectionMeta.differentials;

  return (
    <section id="diferenciais" className="section-padding bg-white/[0.01]">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={meta.index}
          label={meta.label}
          title={meta.title}
          highlightWord={meta.highlightWord}
          description={meta.description}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {differentials.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="glass glass-hover relative rounded-xl p-6">
                <div className="absolute right-4 top-4 opacity-60">
                  <BrandIcon variant="iconCircleLight" size="sm" animate="none" />
                </div>
                <h3 className="pr-12 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
