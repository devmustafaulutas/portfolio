"use client";

import { useEffect, useRef } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";

/**
 * Difference-blend cursor: a white dot that inverts whatever it
 * crosses — white text turns black, black panels turn white.
 * Grows over interactive elements (links, buttons, anything with
 * a `data-cursor` attribute). Hidden on touch and reduced motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    const dot = dotRef.current;
    if (!dot) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(dot, { xPercent: -50, yPercent: -50, opacity: 0 });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });

    let revealed = false;
    const onMove = (event: PointerEvent) => {
      if (!revealed) {
        revealed = true;
        gsap.set(dot, { x: event.clientX, y: event.clientY });
        gsap.to(dot, { opacity: 1, duration: 0.3 });
      }
      xTo(event.clientX);
      yTo(event.clientY);
    };

    const isInteractive = (target: EventTarget | null): boolean =>
      target instanceof Element &&
      target.closest("a, button, [data-cursor]") !== null;

    const onOver = (event: PointerEvent) => {
      if (isInteractive(event.target)) {
        gsap.to(dot, { scale: 5, duration: 0.4, ease: "monoOut" });
      }
    };

    const onOut = (event: PointerEvent) => {
      if (isInteractive(event.target)) {
        gsap.to(dot, { scale: 1, duration: 0.4, ease: "monoOut" });
      }
    };

    const onDown = () => gsap.to(dot, { scale: 0.7, duration: 0.2 });
    const onUp = () => gsap.to(dot, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return <div ref={dotRef} className="custom-cursor" aria-hidden="true" />;
}
