export const brandAssets = {
  logoTransparent: {
    src: "/brand/logo-fundo-t.png",
    alt: "DC Technologies — logo",
    width: 320,
    height: 120,
  },
  logoDark: {
    src: "/brand/logo.png",
    alt: "DC Technologies",
    width: 320,
    height: 120,
  },
  iconSquircleDark: {
    src: "/brand/icon-squircle-dark.png",
    alt: "DC Technologies — ícone",
    width: 512,
    height: 512,
  },
  iconCircleDark: {
    src: "/brand/icon-circle-dark.png",
    alt: "DC Technologies — emblema escuro",
    width: 512,
    height: 512,
  },
  iconSquircleBlue: {
    src: "/brand/icon-squircle-blue.png",
    alt: "DC Technologies — ícone azul",
    width: 512,
    height: 512,
  },
  iconCircleLight: {
    src: "/brand/icon-circle-light.png",
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
