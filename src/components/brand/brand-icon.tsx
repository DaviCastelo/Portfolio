"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  brandAssets,
  brandIconSizes,
  type BrandIconVariant,
} from "@/data/brand-assets";
import { cn } from "@/lib/utils";

type Size = keyof typeof brandIconSizes;

interface BrandIconProps {
  variant: BrandIconVariant;
  size?: Size;
  className?: string;
  animate?: "float" | "pulse" | "none";
  priority?: boolean;
}

export function BrandIcon({
  variant,
  size = "md",
  className,
  animate = "none",
  priority = false,
}: BrandIconProps) {
  const asset = brandAssets[variant];
  const dim = brandIconSizes[size];

  const image = (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={dim}
      height={dim}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );

  if (animate === "none") return image;

  return (
    <motion.div
      animate={
        animate === "float"
          ? { y: [0, -8, 0] }
          : { opacity: [0.85, 1, 0.85] }
      }
      transition={{
        duration: animate === "float" ? 5 : 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {image}
    </motion.div>
  );
}
