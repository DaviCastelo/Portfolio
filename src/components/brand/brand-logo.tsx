import { BrandImage } from "@/components/brand/brand-image";
import { BrandWordmark } from "@/components/brand/brand-wordmark";
import Link from "next/link";
import { brandAssets, headerLogos } from "@/data/brand-assets";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  id?: string;
  className?: string;
  priority?: boolean;
  /** Ícone + nome no header (Icones5 dark / Icones6 light + Orbitron) */
  themeLogos?: boolean;
  /** hero = maior no bloco inicial (mobile/tablet) */
  variant?: "header" | "hero";
}

const themeIconClass = {
  header: "h-9 w-9 object-contain md:h-10 md:w-10",
  hero: "h-14 w-14 object-contain sm:h-16 sm:w-16",
} as const;

export function BrandLogo({
  id,
  className,
  priority = false,
  themeLogos = false,
  variant = "header",
}: Readonly<BrandLogoProps>) {
  if (themeLogos) {
    const { dark, light } = headerLogos;
    const iconClass = themeIconClass[variant];
    return (
      <Link
        id={id}
        href="/"
        className={cn(
          "inline-flex shrink-0 items-center",
          variant === "hero"
            ? "mx-auto justify-center gap-3 sm:gap-3.5"
            : "gap-2 md:gap-3",
          className
        )}
        aria-label="Kairos tecnologias — início"
      >
        <BrandImage
          src={dark.src}
          alt=""
          width={dark.width}
          height={dark.height}
          priority={priority}
          className={cn("hidden object-contain dark:block", iconClass)}
        />
        <BrandImage
          src={light.src}
          alt=""
          width={light.width}
          height={light.height}
          priority={priority}
          className={cn("object-contain dark:hidden", iconClass)}
        />
        <BrandWordmark
          className={
            variant === "hero"
              ? "text-lg tracking-[0.09em] sm:text-xl sm:tracking-[0.1em]"
              : undefined
          }
        />
      </Link>
    );
  }

  const logo = brandAssets.logoTransparent;
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center", className)}
      aria-label="Kairos tecnologias — início"
    >
      <BrandImage
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority={priority}
        className="ml-0 h-8 w-auto max-w-[10rem] object-contain object-left md:ml-0 md:h-10 md:max-w-[12rem]"
      />
    </Link>
  );
}
