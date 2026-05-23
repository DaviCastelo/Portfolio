"use client";

import { SectionHeader } from "@/components/layout/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { sectionMeta, testimonials } from "@/data/site";
import { Quote } from "lucide-react";

export function TestimonialsSection() {
  const meta = sectionMeta.testimonials;

  return (
    <section id="depoimentos" className="section-padding">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index={meta.index}
          label={meta.label}
          title={meta.title}
          highlightWord={meta.highlightWord}
          description={meta.description}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={i * 0.08}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="mb-4 h-8 w-8 text-primary/40" />
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  {t.metric && (
                    <p className="mt-4 font-mono text-sm font-medium text-primary">
                      {t.metric}
                    </p>
                  )}
                  <div className="mt-6 border-t border-border pt-4">
                    <p className="font-medium">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
