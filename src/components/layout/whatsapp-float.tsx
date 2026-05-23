"use client";

import { MessageCircle } from "lucide-react";
import { externalLinkProps, WHATSAPP_URL } from "@/lib/links";
import { cn } from "@/lib/utils";

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      {...externalLinkProps}
      aria-label="Falar no WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30",
        "transition-transform duration-300 hover:scale-105 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      )}
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </a>
  );
}
