"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __ocean?: {
      scroll: number;
      dive: number;
      vel: number;
      dir: number;
      mx: number;
      my: number;
      reduced: boolean;
    };
  }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function ensureOcean() {
  if (!window.__ocean) {
    window.__ocean = {
      scroll: 0,
      dive: 0,
      vel: 0,
      dir: 1,
      mx: window.innerWidth * 0.5,
      my: window.innerHeight * 0.35,
      reduced: false,
    };
  }
  return window.__ocean;
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const wipeRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const firstRouteRef = useRef(true);

  // Lenis + ScrollTrigger + global CSS vars
  useEffect(() => {
    if (lenisRef.current) return;

    const ocean = ensureOcean();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    ocean.reduced = mq.matches;

    document.documentElement.style.setProperty("--scroll", "0");
    document.documentElement.style.setProperty("--dive", "0");
    document.documentElement.style.setProperty("--vel", "0");
    document.documentElement.style.setProperty("--dir", "1");
    document.documentElement.style.setProperty("--mx", `${ocean.mx}px`);
    document.documentElement.style.setProperty("--my", `${ocean.my}px`);

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    // Scroll progress → CSS vars
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const p = clamp01(self.progress);
        const dive = clamp01(p * 1.18); // “derinleşme” daha belirgin olsun
        ocean.scroll = p;
        ocean.dive = dive;

        document.documentElement.style.setProperty("--scroll", String(p));
        document.documentElement.style.setProperty("--dive", String(dive));
      },
    });

    // Lenis → velocity/dir
    const onLenisScroll = (e: any) => {
      ScrollTrigger.update();

      // Lenis event shape değişebilir; safe parse
      const vRaw = typeof e?.velocity === "number" ? e.velocity : 0;
      const dir = typeof e?.direction === "number" ? e.direction : (vRaw >= 0 ? 1 : -1);

      const vel = clamp01(Math.abs(vRaw) / 18);
      ocean.vel = vel;
      ocean.dir = dir;

      document.documentElement.style.setProperty("--vel", String(vel));
      document.documentElement.style.setProperty("--dir", String(dir));
    };

    lenis.on("scroll", onLenisScroll);

    // GSAP ticker sync
    const onTick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      gsap.ticker.remove(onTick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pointer spotlight (cheap, effective)
  useEffect(() => {
    const ocean = ensureOcean();
    let raf: number | null = null;
    let nextX = ocean.mx;
    let nextY = ocean.my;

    const apply = () => {
      raf = null;
      ocean.mx = nextX;
      ocean.my = nextY;
      document.documentElement.style.setProperty("--mx", `${nextX}px`);
      document.documentElement.style.setProperty("--my", `${nextY}px`);
    };

    const onMove = (e: PointerEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;
      if (raf != null) return;
      raf = window.requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf != null) window.cancelAnimationFrame(raf);
    };
  }, []);

  // Route wipe (load + navigation)
  useEffect(() => {
    const el = wipeRef.current;
    if (!el) return;

    const ocean = ensureOcean();
    const reduced = ocean.reduced;

   

  }, [pathname]);

  // GSAP scenes (reveal + hero + kinetic pinned)
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // reveals
      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
        const targets = section.querySelectorAll<HTMLElement>("[data-reveal]");
        if (!targets.length) return;

        gsap.fromTo(
          targets,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: section, start: "top 78%" },
          }
        );
      });

      // hero subtle parallax (no heavy pin)
      const hero = document.querySelector<HTMLElement>("[data-hero]");
      if (hero) {
        const title = hero.querySelector<HTMLElement>("[data-hero-title]");
        const lead = hero.querySelector<HTMLElement>("[data-hero-lead]");
        const cta = hero.querySelector<HTMLElement>("[data-hero-cta]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "+=520",
            scrub: 1,
          },
        });

        if (title) tl.to(title, { y: -18, opacity: 0.95, ease: "none" }, 0);
        if (lead) tl.to(lead, { y: -10, opacity: 0.9, ease: "none" }, 0);
        if (cta) tl.to(cta, { y: -6, opacity: 0.95, ease: "none" }, 0);
      }

      // kinetic pinned typography
      gsap.utils.toArray<HTMLElement>("[data-kinetic]").forEach((section) => {
        const pin = section.querySelector<HTMLElement>("[data-kinetic-pin]") ?? section;
        const title = section.querySelector<HTMLElement>("[data-kinetic-title]");
        const sub = section.querySelector<HTMLElement>("[data-kinetic-sub]");
        const lines = section.querySelectorAll<HTMLElement>("[data-kinetic-line] .kinetic-line__inner");

        gsap.set(lines, { y: 22, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=1600",
            scrub: 1,
            pin: pin,
            anticipatePin: 1,
          },
        });

        if (title) {
          tl.fromTo(
            title,
            { y: 36, opacity: 0.65, letterSpacing: "-0.01em" },
            { y: -40, opacity: 1, letterSpacing: "-0.04em", ease: "none" },
            0
          );
        }

        if (sub) {
          tl.fromTo(sub, { y: 18, opacity: 0.4 }, { y: -10, opacity: 1, ease: "none" }, 0);
        }

        tl.to(lines, { y: 0, opacity: 1, stagger: 0.12, ease: "none" }, 0.12);

        // “ink” hissini güçlendirmek için bu sahnede dive’ı biraz daha iteriz
        tl.to(
          document.documentElement,
          { "--dive": 1, ease: "none" },
          0.25
        );
      });

      // hoverline micro interaction (text satırı “kayarak” tepki)
      gsap.utils.toArray<HTMLElement>("[data-hoverline]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.22, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          xTo(dx * 10);
        };
        const onLeave = () => xTo(0);

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });

      // magnetic
      gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3.out" });

        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
          xTo(dx * 10);
          yTo(dy * 10);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);

        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [pathname]);

  return (
    <>
      {/* visible page feedback on load/click */}
      <div ref={wipeRef} className="route-wipe" aria-hidden="true" />
      {children}
    </>
  );
}
