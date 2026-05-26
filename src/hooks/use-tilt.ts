"use client";

import { useCallback, useRef } from "react";
import { useReducedMotion } from "./use-reduced-motion";

export function useTilt<T extends HTMLElement = HTMLDivElement>(intensity = 8) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  const onMove = useCallback(
    (e: React.MouseEvent<T>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      ref.current.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg)`;
    },
    [intensity, reduced]
  );

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  }, []);

  return { ref, onMove, onLeave };
}
