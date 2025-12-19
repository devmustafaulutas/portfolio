"use client";

import React, { useEffect, useRef } from "react";
import { SharkSvg } from "./shark-svg";

export function SharkBuddy({ size = 140 }: { size?: number }) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: any;
    (async () => {
      const gsap = (await import("gsap")).default;

      if (!root.current) return;
      const q = (sel: string) => root.current!.querySelector(sel) as SVGGElement;

      const tail = q("#shark-tail");
      const eye = q("#shark-eye");
      const mouth = q("#shark-mouth");

      ctx = gsap.context(() => {
        gsap.to(tail, {
          rotate: -12,
          yoyo: true,
          repeat: -1,
          duration: 0.8,
          ease: "sine.inOut",
        });

        const blink = () => {
          gsap.to(eye, {
            scaleY: 0.12,
            transformOrigin: "132px 76px",
            duration: 0.08,
            yoyo: true,
            repeat: 1,
            ease: "power1.out",
            onComplete: () => {
              gsap.delayedCall(2 + Math.random() * 4, blink);
            },
          });
        };
        gsap.delayedCall(1.2, blink);

        root.current!.addEventListener("mouseenter", () => {
          gsap.to(mouth, { rotate: -6, scale: 1.03, duration: 0.18, ease: "power2.out" });
        });
        root.current!.addEventListener("mouseleave", () => {
          gsap.to(mouth, { rotate: 0, scale: 1, duration: 0.22, ease: "power2.out" });
        });
      }, root);
    })();

    return () => ctx?.revert?.();
  }, []);

  return (
    <div ref={root} className="group grid place-items-center">
      <div style={{ width: size, height: size }}>
        <SharkSvg className="h-full w-full" />
      </div>
    </div>
  );
}
