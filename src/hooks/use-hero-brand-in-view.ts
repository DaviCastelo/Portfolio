"use client";

import { useEffect, useState } from "react";

const MOBILE_BRAND_MQ = "(max-width: 1023px)";

/**
 * true quando o logo do hero (mobile/tablet) está visível na viewport.
 * Usado para ocultar a marca duplicada no header fixo.
 */
export function useHeroBrandInView() {
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = globalThis.matchMedia(MOBILE_BRAND_MQ);
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setInView(false);
      return;
    }

    const el = globalThis.document.getElementById("hero-mobile-brand");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "-72px 0px 0px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return enabled && inView;
}
