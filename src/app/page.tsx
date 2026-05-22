import { Suspense } from "react";
import { TrustMetrics } from "@/components/sections/trust-metrics";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/sections/hero";
import { AboutSection } from "@/sections/about";
import { ServicesSection } from "@/sections/services";
import { TechnologiesSection } from "@/sections/technologies";
import { PortfolioSection } from "@/sections/portfolio";
import { ProcessSection } from "@/sections/process";
import { DifferentialsSection } from "@/sections/differentials";
import { TestimonialsSection } from "@/sections/testimonials";
import { FaqSection } from "@/sections/faq";
import { CtaSection } from "@/sections/cta";
import { ContactSection } from "@/sections/contact";

function PortfolioFallback() {
  return (
    <section id="portfolio" className="section-padding">
      <div className="mx-auto max-w-6xl animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-white/10" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustMetrics />
      <AboutSection />
      <ServicesSection />
      <TechnologiesSection />
      <Suspense fallback={<PortfolioFallback />}>
        <PortfolioSection />
      </Suspense>
      <ProcessSection />
      <DifferentialsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <ContactSection />
      <Footer />
    </>
  );
}
