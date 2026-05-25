"use client";

import { useEffect, useState } from "react";

/** Mobile 2×2, tablet 3×2, desktop 4×2 */
export const PORTFOLIO_PAGE_SIZES = {
  mobile: 4,
  tablet: 6,
  desktop: 8,
} as const;

export type PortfolioPageSize =
  (typeof PORTFOLIO_PAGE_SIZES)[keyof typeof PORTFOLIO_PAGE_SIZES];

export function usePortfolioPageSize() {
  const [pageSize, setPageSize] = useState<PortfolioPageSize>(
    PORTFOLIO_PAGE_SIZES.mobile
  );

  useEffect(() => {
    const mqLg = globalThis.matchMedia("(min-width: 1024px)");
    const mqMd = globalThis.matchMedia("(min-width: 768px)");

    const sync = () => {
      if (mqLg.matches) {
        setPageSize(PORTFOLIO_PAGE_SIZES.desktop);
      } else if (mqMd.matches) {
        setPageSize(PORTFOLIO_PAGE_SIZES.tablet);
      } else {
        setPageSize(PORTFOLIO_PAGE_SIZES.mobile);
      }
    };

    sync();
    mqLg.addEventListener("change", sync);
    mqMd.addEventListener("change", sync);
    return () => {
      mqLg.removeEventListener("change", sync);
      mqMd.removeEventListener("change", sync);
    };
  }, []);

  return pageSize;
}
