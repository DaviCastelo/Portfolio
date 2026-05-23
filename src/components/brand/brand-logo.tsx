import { BrandImage } from "@/components/brand/brand-image";
import { BrandWordmark } from "@/components/brand/brand-wordmark";
import Link from "next/link";
import { brandAssets, headerLogos } from "@/data/brand-assets";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
  /** Ícone + nome no header (Icone 2/4 + Orbitron) */
  themeLogos?: boolean;
}

export function BrandLogo({
  className,
  priority = false,
  themeLogos = false,
}: BrandLogoProps) {
  if (themeLogos) {
    const { dark, light } = headerLogos;
    return (
      <Link
        href="/"
        className={cn("inline-flex shrink-0 items-center gap-2 md:gap-3", className)}
        aria-label="DC Technologies — início"
      >
        <BrandImage
          src={dark.src}
          alt=""
          width={dark.width}
          height={dark.height}
          priority={priority}
          className="hidden h-9 w-9 object-contain dark:block md:h-10 md:w-10"
        />
        <BrandImage
          src={light.src}
          alt=""
          width={light.width}
          height={light.height}
          priority={priority}
          className="h-9 w-9 object-contain dark:hidden md:h-10 md:w-10"
        />
        <BrandWordmark />
      </Link>
    );
  }

  const logo = brandAssets.logoTransparent;
  return (
    <Link href="/" className={cn("inline-flex shrink-0", className)}>
      <BrandImage
        src={logo.src}
        alt={logo.alt}
        width={320}
        height={120}
        priority={priority}
        className="h-8 w-auto md:h-10"
      />
    </Link>
  );
}
