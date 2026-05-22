import Link from "next/link";
import { BrandIcon } from "@/components/brand/brand-icon";
import { Button } from "@/components/ui/button";
import { cta } from "@/data/site";

export function CtaSection() {
  const renderTitle = () => {
    const { title, highlightWord } = cta;
    if (!title.includes(highlightWord)) return title;
    const [before, after] = title.split(highlightWord);
    return (
      <>
        {before}
        <em className="gradient-text not-italic">{highlightWord}</em>
        {after}
      </>
    );
  };

  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <div className="glass relative overflow-hidden rounded-2xl border border-white/[0.08] p-8 md:flex md:items-center md:justify-between md:p-12">
          <div className="pointer-events-none absolute -right-8 -top-8 opacity-30">
            <BrandIcon variant="iconSquircleBlue" size="xl" animate="float" />
          </div>
          <div className="relative max-w-xl space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {renderTitle()}
            </h2>
            <p className="text-muted-foreground">{cta.description}</p>
          </div>
          <Button asChild size="lg" className="relative mt-6 glow-primary md:mt-0">
            <Link href={cta.button.href}>{cta.button.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
