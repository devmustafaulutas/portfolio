"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type MagneticProps = {
  children: ReactNode;
  /** İçeriğin imlece doğru çekilme oranı (0–1). */
  strength?: number;
  className?: string;
};

/**
 * Manyetik etkileşim sarmalayıcısı. Fine pointer + hareket izni
 * varsa içerik imlece doğru eğilir, ayrılınca elastik döner.
 */
export default function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      gsap.to(inner, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
    };

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(inner);
    };
  }, [strength]);

  return (
    <span ref={wrapRef} className={`inline-block ${className ?? ""}`}>
      <span ref={innerRef} className="inline-block will-change-transform">
        {children}
      </span>
    </span>
  );
}
