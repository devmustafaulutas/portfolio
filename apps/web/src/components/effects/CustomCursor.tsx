"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = "a, button, [data-cursor]";

/**
 * mix-blend-difference özel imleç: hızlı nokta + gecikmeli halka.
 * Yalnızca fine pointer'da aktifleşir; dokunmatikte hiç render maliyeti yok.
 *
 * Yapı bilinçli olarak iki katman: dış eleman yalnızca x/y (quickTo),
 * iç eleman yalnızca scale alır. Aynı elemanda quickTo + scale tween'i
 * karışırsa GSAP transform önbelleği "not eligible for reset" uyarısı üretir.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotInnerRef = useRef<HTMLDivElement>(null);
  const ringInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const dotInner = dotInnerRef.current;
    const ringInner = ringInnerRef.current;
    if (!dot || !ring || !dotInner || !ringInner) return;

    document.documentElement.classList.add("cursor-live");

    // quickTo'lar ilk pointer konumundan SONRA kurulur; aynı özelliğe
    // gsap.set ile dokunmak quickTo ile çakışıp konsol uyarısı üretir.
    let quick: {
      dotX: gsap.QuickToFunc;
      dotY: gsap.QuickToFunc;
      ringX: gsap.QuickToFunc;
      ringY: gsap.QuickToFunc;
    } | null = null;

    let visible = false;

    const onMove = (e: PointerEvent) => {
      if (!quick) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        quick = {
          dotX: gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" }),
          dotY: gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" }),
          ringX: gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" }),
          ringY: gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" }),
        };
      }
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.25, overwrite: "auto" });
      }
      quick.dotX(e.clientX);
      quick.dotY(e.clientY);
      quick.ringX(e.clientX);
      quick.ringY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE)) {
        gsap.to(ringInner, { scale: 2.4, duration: 0.35, ease: "power3.out", overwrite: "auto" });
        gsap.to(dotInner, { scale: 0.4, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      }
    };

    const onOut = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE)) {
        gsap.to([ringInner, dotInner], { scale: 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      }
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.25, overwrite: "auto" });
    };

    const onDown = () => gsap.to(ringInner, { scale: 0.8, duration: 0.2, overwrite: "auto" });
    const onUp = () => gsap.to(ringInner, { scale: 1, duration: 0.3, overwrite: "auto" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("cursor-live");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([dot, ring, dotInner, ringInner]);
    };
  }, []);

  return (
    <div aria-hidden>
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[110] opacity-0 mix-blend-difference will-change-transform"
      >
        <div ref={ringInnerRef} className="-ml-5 -mt-5 size-10 rounded-full border border-white" />
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[110] opacity-0 mix-blend-difference will-change-transform"
      >
        <div ref={dotInnerRef} className="-ml-1 -mt-1 size-2 rounded-full bg-white" />
      </div>
    </div>
  );
}
