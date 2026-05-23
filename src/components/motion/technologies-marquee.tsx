"use client";

import { MotionConfig, motion } from "framer-motion";
import { technologies } from "@/data/site";

function TechPill({ name }: { name: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-border bg-card px-6 py-3 font-mono text-sm text-muted-foreground">
      {name}
    </span>
  );
}

export function TechnologiesMarquee() {
  const track = [...technologies, ...technologies];

  return (
    <div className="relative mt-8 overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-background to-transparent" />
      <MotionConfig reducedMotion="never">
        <motion.div
          className="flex w-max gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 75,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          {track.map((tech, i) => (
            <TechPill key={`${tech}-${i}`} name={tech} />
          ))}
        </motion.div>
      </MotionConfig>
    </div>
  );
}
