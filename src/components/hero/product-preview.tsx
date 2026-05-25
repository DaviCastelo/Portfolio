"use client";

import { motion } from "framer-motion";
import { BarChart3, FolderGit2, Star } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function HeroProductPreview() {
  const reduced = useReducedMotion();

  const content = (
    <div className="glass overflow-hidden rounded-xl border border-border shadow-2xl">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          portfolio — Kairos tecnologias
        </span>
      </div>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <FolderGit2 className="h-3.5 w-3.5" />
            Projetos ativos
          </div>
          <p className="text-2xl font-semibold">12</p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5" />
            Stars GitHub
          </div>
          <p className="text-2xl font-semibold">248</p>
        </div>
        <div className="col-span-1 rounded-lg border border-border bg-muted/30 p-4 sm:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <BarChart3 className="h-3.5 w-3.5" />
            Performance
          </div>
          <div className="flex h-16 items-end gap-1">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-[#A67C00] to-[#D4AF37]"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (reduced) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}
