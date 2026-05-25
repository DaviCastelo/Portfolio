import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BrandWordmarkProps {
  className?: string;
}

/**
 * Tipografia inspirada no logo (Orbitron).
 * "Kairós" em gradiente dourado; "tecnologias" na cor do tema.
 */
export function BrandWordmark({ className }: BrandWordmarkProps) {
  const [first, ...restParts] = SITE_NAME.split(" ");
  const rest = restParts.join(" ");

  return (
    <span
      className={cn(
        "font-brand text-sm font-semibold leading-none tracking-[0.08em] md:text-base md:tracking-[0.1em]",
        className
      )}
    >
      <span className="gradient-text">{first}</span>
      {rest ? (
        <span className="text-foreground">{` ${rest}`}</span>
      ) : null}
    </span>
  );
}
