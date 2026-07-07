"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";

type MagneticProps = {
  children: ReactNode;
  /** How strongly the element chases the pointer (0..1). */
  strength?: number;
  className?: string;
};

/**
 * Magnetic field wrapper: whatever it contains leans toward the
 * pointer while hovered and snaps back with an elastic release.
 */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.4, ease: "power3" });

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const onLeave = () => {
      gsap.to(wrap, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.4)",
      });
    };

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={wrapRef} className={cn("inline-block", className)}>
      {children}
    </div>
  );
}
