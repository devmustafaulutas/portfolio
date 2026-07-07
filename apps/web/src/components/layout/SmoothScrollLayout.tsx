"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";
import { Preloader } from "@/components/ui/Preloader";

type SmoothScrollContextValue = {
  lenis: Lenis | null;
  scrollTo: (target: string, offset?: number) => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  lenis: null,
  scrollTo: () => undefined,
});

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

type SmoothScrollLayoutProps = {
  children: ReactNode;
};

/**
 * Root client shell: boots GSAP, wires Lenis into the ScrollTrigger
 * clock (single rAF via gsap.ticker), feeds the scroll bus that the
 * WebGL scene reads, and renders the fixed page-progress bar.
 *
 * CLS guard: nothing here reflows content — the progress bar is
 * fixed/transform-only and Lenis never changes document height.
 */
export function SmoothScrollLayout({ children }: SmoothScrollLayoutProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();

    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const setProgress = progressRef.current
      ? gsap.quickSetter(progressRef.current, "scaleX")
      : null;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onPointerMove = (event: PointerEvent) => {
      scrollBus.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      scrollBus.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onFontsReady = () => ScrollTrigger.refresh();
    document.fonts.ready.then(onFontsReady).catch(() => undefined);

    if (reduceMotion) {
      const onNativeScroll = () => {
        const limit = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        scrollBus.progress = window.scrollY / limit;
        scrollBus.velocity = 0;
        setProgress?.(scrollBus.progress);
      };
      window.addEventListener("scroll", onNativeScroll, { passive: true });

      return () => {
        window.removeEventListener("scroll", onNativeScroll);
        window.removeEventListener("pointermove", onPointerMove);
      };
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      autoRaf: false,
    });

    instance.on("scroll", (self: Lenis) => {
      scrollBus.progress = self.progress;
      scrollBus.velocity = self.velocity;
      setProgress?.(self.progress);
      ScrollTrigger.update();
    });

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Kinetic typography: [data-skew] targets lean with scroll
    // velocity and spring back through the quickTo easing when the
    // page settles. One ticker drives every setter.
    const skewSetters = gsap.utils
      .toArray<HTMLElement>("[data-skew]")
      .map((element) =>
        gsap.quickTo(element, "skewX", { duration: 0.4, ease: "power3" }),
      );
    const onSkewTick = () => {
      const lean = gsap.utils.clamp(-5, 5, scrollBus.velocity * 0.07);
      skewSetters.forEach((setSkew) => setSkew(lean));
    };
    gsap.ticker.add(onSkewTick);

    instance.scrollTo(0, { immediate: true, force: true });
    setLenis(instance);

    return () => {
      gsap.ticker.remove(onTick);
      gsap.ticker.remove(onSkewTick);
      instance.destroy();
      window.removeEventListener("pointermove", onPointerMove);
      setLenis(null);
    };
  }, []);

  const scrollTo = (target: string, offset = 0) => {
    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.6 });
      return;
    }
    document
      .querySelector(target)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <SmoothScrollContext.Provider value={{ lenis, scrollTo }}>
      <Preloader lenis={lenis} />
      <div ref={progressRef} className="site-progress" aria-hidden="true" />
      <div className="hud-corner left-4 top-4 sm:left-6 sm:top-6">
        MUSTAFA ULUTAŞ — PORTFOLYO
      </div>
      <div className="hud-corner right-4 top-4 text-right sm:right-6 sm:top-6">
        MONOCHROME SUPREMACY
      </div>
      {children}
    </SmoothScrollContext.Provider>
  );
}
