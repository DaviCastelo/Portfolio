import type { MetadataRoute } from "next";
import { faviconAsset } from "@/data/brand-assets";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "DC Tech",
    description: SITE_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#0A84FF",
    icons: [
      {
        src: faviconAsset.src,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: faviconAsset.src,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
