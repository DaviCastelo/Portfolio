import { BrandIcon } from "@/components/brand/brand-icon";
import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { about } from "@/data/site";
import { Check } from "lucide-react";

export function AboutSection() {
  return (
    <section id="sobre" className="section-padding">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={about.index}
          label={about.label}
          title={about.title}
          highlightWord={about.highlightWord}
          description={about.description}
        />
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="flex justify-center lg:justify-start">
              <BrandIcon variant="iconCircleDark" size="lg" animate="float" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="space-y-4">
              {about.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
