import type { Metadata } from "next";
import { faviconAsset } from "@/data/brand-assets";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/links";

export function buildMetadata(): Metadata {
  const title = `${SITE_NAME} | Tecnologia que resolve`;
  const description = `${SITE_TAGLINE} Desenvolvimento web, SaaS, APIs e automações com serviço premium.`;

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: [
      "desenvolvimento web",
      "SaaS",
      "APIs",
      "Next.js",
      "TypeScript",
      "Kairos tecnologias",
      "Kairos",
      "software house",
      "automação",
    ],
    authors: [{ name: SITE_NAME }],
    metadataBase: new URL(SITE_URL),
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: SITE_URL,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: "/brand/LogoQuadradaPreta.png", width: 512, height: 512 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/brand/LogoQuadradaPreta.png"],
    },
    icons: {
      icon: faviconAsset.src,
      apple: faviconAsset.src,
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/LogoQuadradaPreta.png`,
    description: SITE_TAGLINE,
    sameAs: [INSTAGRAM_URL, TIKTOK_URL],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
  };
}
