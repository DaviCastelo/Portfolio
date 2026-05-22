"use client";

import { trustMetrics } from "@/data/site";
import { StaggerChildren, StaggerItem } from "@/components/motion/stagger-children";
import { Reveal } from "@/components/motion/reveal";

export function TrustMetrics() {
  return (
    <section className="border-y border-white/[0.08] bg-white/[0.01]">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <StaggerChildren className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {trustMetrics.map((metric) => (
            <StaggerItem key={metric.label} className="text-center md:text-left">
              <Reveal>
                <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {metric.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
              </Reveal>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
