import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  className?: string;
}

/**
 * Tipografia inspirada no logo (Orbitron — similar a Michroma/Exo).
 * "DC" em gradiente azul; restante na cor do tema.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  const [dc, rest] = SITE_NAME.split(" ");

  return (
    <span
      className={cn(
        "font-brand text-sm font-semibold uppercase leading-none tracking-[0.14em] md:text-base md:tracking-[0.16em]",
        className
      )}
    >
      <span className="gradient-text">{dc}</span>
      {rest ? (
        <span className="text-foreground">{` ${rest}`}</span>
      ) : null}
    </span>
  );
}
