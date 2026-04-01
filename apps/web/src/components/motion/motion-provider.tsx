"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ScrollTrigger } from "@/lib/gsap";

type MotionContextValue = {
  lenis: Lenis | null;
  reducedMotion: boolean;
  motionReady: boolean;
};

const MotionContext = createContext<MotionContextValue>({
  lenis: null,
  reducedMotion: false,
  motionReady: false,
});

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionReady, setMotionReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);

    sync();
    media.addEventListener("change", sync);

    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty("--scroll", "0");

    if (reducedMotion) {
      root.dataset.motion = "reduced";
      lenisRef.current?.destroy();
      lenisRef.current = null;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      setMotionReady(true);
      return;
    }

    root.dataset.motion = "smooth";

    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.95,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    const onScroll = ({ progress, velocity }: { progress: number; velocity: number }) => {
      root.style.setProperty("--scroll", String(clamp01(progress ?? 0)));
      root.style.setProperty("--vel", String(velocity ?? 0));
      ScrollTrigger.update();
    };

    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = window.requestAnimationFrame(raf);
    };

    rafRef.current = window.requestAnimationFrame(raf);

    const scrollProgress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        root.style.setProperty("--scroll", String(clamp01(self.progress)));
      },
    });

    const onVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
        ScrollTrigger.refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    setMotionReady(true);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      scrollProgress.kill();
      lenis.off("scroll", onScroll);
      lenis.destroy();
      lenisRef.current = null;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;

    lenisRef.current?.scrollTo(0, { immediate: true, force: true });

    const refreshId = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => window.cancelAnimationFrame(refreshId);
  }, [pathname, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let frameId: number | null = null;
    let nextX = window.innerWidth * 0.64;
    let nextY = window.innerHeight * 0.24;

    const commit = () => {
      frameId = null;
      document.documentElement.style.setProperty("--mx", `${nextX}px`);
      document.documentElement.style.setProperty("--my", `${nextY}px`);
    };

    const onPointerMove = (event: PointerEvent) => {
      nextX = event.clientX;
      nextY = event.clientY;

      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(commit);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [reducedMotion]);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      "[data-reveal], [data-reveal-stagger]"
    );

    if (reducedMotion) {
      targets.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname, reducedMotion]);

  const value = useMemo<MotionContextValue>(
    () => ({
      lenis: lenisRef.current,
      reducedMotion,
      motionReady,
    }),
    [motionReady, reducedMotion]
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}

export function useReducedMotionPreference() {
  const { reducedMotion } = useMotion();
  return reducedMotion;
}

