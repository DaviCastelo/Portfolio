import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/data/brand-assets";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ className, priority = false }: BrandLogoProps) {
  const logo = brandAssets.logoTransparent;
  return (
    <Link href="/" className={cn("inline-flex shrink-0", className)}>
      <Image
        src={logo.src}
        alt={logo.alt}
        width={180}
        height={48}
        priority={priority}
        className="h-8 w-auto md:h-10"
      />
    </Link>
  );
}
