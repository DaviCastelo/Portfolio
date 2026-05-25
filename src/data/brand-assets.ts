/** Incremente ao trocar arquivos em public/brand (quebra cache do navegador). */
const BRAND_V = "6";

const BRAND_ALT = "Kairós tecnologias";

function brandSrc(file: string): string {
  return `/brand/${file}?v=${BRAND_V}`;
}

/** Header: escuro = Icones5, claro = Icones6 */
export const headerLogos = {
  dark: {
    src: brandSrc("Icones5.png"),
    alt: BRAND_ALT,
    width: 48,
    height: 48,
  },
  light: {
    src: brandSrc("Icones6.png"),
    alt: BRAND_ALT,
    width: 48,
    height: 48,
  },
} as const;

export const faviconAsset = {
  src: brandSrc("Icones5.png"),
  alt: BRAND_ALT,
};

export const brandAssets = {
  logoTransparent: {
    src: brandSrc("LogoQuadradaPreta.png"),
    alt: `${BRAND_ALT} — logo`,
    width: 512,
    height: 512,
  },
  logoDark: {
    src: brandSrc("LogoQuadradaPreta.png"),
    alt: BRAND_ALT,
    width: 512,
    height: 512,
  },
  iconSquircleDark: {
    src: brandSrc("Icones6.png"),
    alt: `${BRAND_ALT} — ícone`,
    width: 512,
    height: 512,
  },
  iconCircleDark: {
    src: brandSrc("Icones5.png"),
    alt: `${BRAND_ALT} — emblema escuro`,
    width: 512,
    height: 512,
  },
  iconSquircleBlue: {
    src: brandSrc("Icones6.png"),
    alt: `${BRAND_ALT} — emblema dourado`,
    width: 512,
    height: 512,
  },
  iconCircleLight: {
    src: brandSrc("Icones4.png"),
    alt: `${BRAND_ALT} — emblema claro`,
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
