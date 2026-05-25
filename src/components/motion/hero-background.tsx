"use client";

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid-bg animate-grid-pulse opacity-40" />
      <div
        className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "hsl(var(--hero-glow))" }}
      />
      <div className="absolute bottom-0 right-0 h-[300px] w-[400px] rounded-full bg-[#D4AF37]/10 blur-[100px] dark:bg-[#D4AF37]/10" />
    </div>
  );
}
