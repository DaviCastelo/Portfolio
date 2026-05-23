"use client";

import NextImage, { type ImageProps } from "next/image";

/** Evita falhas do otimizador na Vercel; assets locais e OG do GitHub carregam direto. */
export function OptimizedImage({ alt, ...props }: ImageProps) {
  return <NextImage alt={alt} {...props} unoptimized />;
}
