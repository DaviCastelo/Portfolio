"use client";

import { SectionHeader } from "@/components/layout/section-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/faq";
import { sectionMeta } from "@/data/site";

export function FaqSection() {
  const meta = sectionMeta.faq;

  return (
    <section id="faq" className="section-padding bg-white/[0.01]">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          index={meta.index}
          label={meta.label}
          title={meta.title}
          highlightWord={meta.highlightWord}
          description={meta.description}
          align="center"
        />
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
