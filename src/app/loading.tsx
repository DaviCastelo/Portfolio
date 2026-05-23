import { BrandIcon } from "@/components/brand/brand-icon";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      <BrandIcon variant="iconSquircleBlue" size="lg" animate="pulse" />
      <p className="font-mono text-sm text-muted-foreground">Carregando…</p>
    </div>
  );
}
