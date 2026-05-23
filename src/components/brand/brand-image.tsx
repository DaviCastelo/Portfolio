import { cn } from "@/lib/utils";

interface BrandImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

/** <img> nativo — mais confiável que next/image para /brand/* na Vercel. */
export function BrandImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
}: BrandImageProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      className={cn("max-w-full", className)}
    />
  );
}
