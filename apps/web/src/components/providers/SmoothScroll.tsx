"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { bootBus } from "@/lib/boot-bus";
import { setLenis } from "@/lib/lenis-store";

/**
 * Lenis + ScrollTrigger entegrasyonu.
 * - rAF, GSAP ticker'ına bağlanır (tek döngü).
 * - Açılış sekansı bitene kadar scroll kilitlidir.
 * - prefers-reduced-motion: Lenis hiç kurulmaz, yerel scroll kalır.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Açılış sekansı her zaman en üstten oynadığı için tarayıcının
    // geç çalışan scroll restorasyonu devre dışı bırakılır.
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      bootBus.complete();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    lenis.stop();
    const unsubscribe = bootBus.onComplete(() => lenis.start());

    return () => {
      unsubscribe();
      setLenis(null);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
