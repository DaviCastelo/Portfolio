import type { Metadata } from "next";
import { faviconAsset } from "@/data/brand-assets";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/constants";

export function buildMetadata(): Metadata {
  const title = `${SITE_NAME} | Tecnologia que resolve`;
  const description = `${SITE_TAGLINE} Desenvolvimento web, SaaS, APIs e automações com engenharia premium.`;

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
      "DC Technologies",
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
      images: [{ url: "/brand/logo.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/brand/logo.png"],
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
    logo: `${SITE_URL}/brand/logo-fundo-t.png`,
    description: SITE_TAGLINE,
    sameAs: [],
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
