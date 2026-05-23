/** Incremente ao trocar arquivos em public/brand (quebra cache do navegador). */
const BRAND_V = "3";

function brandSrc(file: string): string {
  return `/brand/${file}?v=${BRAND_V}`;
}

function publicSrc(file: string): string {
  return `/${encodeURI(file)}?v=${BRAND_V}`;
}

/** Header: escuro = Icone 2, claro = Icone 4 */
export const headerLogos = {
  dark: {
    src: publicSrc("Icone 2.png"),
    alt: "DC Technologies",
    width: 48,
    height: 48,
  },
  light: {
    src: publicSrc("Icone 4.png"),
    alt: "DC Technologies",
    width: 48,
    height: 48,
  },
} as const;

export const faviconAsset = {
  src: publicSrc("Icone 2.png"),
  alt: "DC Technologies",
};

export const brandAssets = {
  logoTransparent: {
    src: brandSrc("logo-fundo-t.png"),
    alt: "DC Technologies — logo",
    width: 320,
    height: 120,
  },
  logoDark: {
    src: brandSrc("logo.png"),
    alt: "DC Technologies",
    width: 320,
    height: 120,
  },
  iconSquircleDark: {
    src: brandSrc("icon-squircle-dark.png"),
    alt: "DC Technologies — ícone",
    width: 512,
    height: 512,
  },
  iconCircleDark: {
    src: brandSrc("icon-circle-dark.png"),
    alt: "DC Technologies — emblema escuro",
    width: 512,
    height: 512,
  },
  iconSquircleBlue: {
    src: brandSrc("icon-squircle-blue.png"),
    alt: "DC Technologies — ícone azul",
    width: 512,
    height: 512,
  },
  iconCircleLight: {
    src: brandSrc("icon-circle-light.png"),
    alt: "DC Technologies — emblema claro",
    width: 512,
    height: 512,
  },
} as const;

export type BrandIconVariant = keyof typeof brandAssets;

export const brandIconSizes = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 128,
} as const;
