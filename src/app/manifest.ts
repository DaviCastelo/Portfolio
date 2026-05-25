import type { MetadataRoute } from "next";
import { faviconAsset } from "@/data/brand-assets";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Kairos",
    description: SITE_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0A",
    theme_color: "#D4AF37",
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
