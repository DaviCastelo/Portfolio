"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { BrandIcon } from "@/components/brand/brand-icon";
import { BrandLogo } from "@/components/brand/brand-logo";
import { HeroProductPreview } from "@/components/hero/product-preview";
import { HeroBackground } from "@/components/motion/hero-background";
import { Button } from "@/components/ui/button";
import { SmartLink } from "@/components/ui/external-link";
import { hero } from "@/data/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function HeroSection() {
  const reduced = useReducedMotion();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;

    const ctx = gsap.context(() => {
      if (headlineRef.current) {
        gsap.from(headlineRef.current, {
          opacity: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
        });
      }
      if (orbRef.current) {
        gsap.to(orbRef.current, {
          y: -20,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    });

    return () => ctx.revert();
  }, [reduced]);

  const renderHeadline = () => {
    const { headline, highlightWord } = hero;
    if (!headline.includes(highlightWord)) return headline;
    const [before, after] = headline.split(highlightWord);
    return (
      <>
        {before}
        <em className="gradient-text not-italic">{highlightWord}</em>
        {after}
      </>
    );
  };

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      <HeroBackground />
      <div
        ref={orbRef}
        className="pointer-events-none absolute right-[10%] top-[20%] hidden opacity-20 blur-sm lg:block"
      >
        <BrandIcon variant="iconCircleDark" size="xl" animate="none" />
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 md:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div className="space-y-8">
          <BrandLogo className="lg:hidden" />
          <div className="space-y-6">
            <p className="font-mono text-xs uppercase tracking-widest text-primary">
              01 — DC Technologies
            </p>
            <h1
              ref={headlineRef}
              className="text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl xl:text-7xl"
            >
              {renderHeadline()}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              {hero.subtitle}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="glow-primary">
              <SmartLink
                href={hero.primaryCta.href}
                external={hero.primaryCta.external}
              >
                {hero.primaryCta.label}
              </SmartLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <SmartLink
                href={hero.secondaryCta.href}
                external={hero.secondaryCta.external}
              >
                {hero.secondaryCta.label}
              </SmartLink>
            </Button>
          </div>
        </div>
        <HeroProductPreview />
      </div>
    </section>
  );
}
