"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Lenis init (once)
  useEffect(() => {
    if (lenisRef.current) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenisRef.current = lenis;

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onLenisScroll);

    const onTick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // --scroll progress var (kill edilebilir şekilde)
    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        document.documentElement.style.setProperty("--scroll", String(self.progress));
      },
    });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onRefresh);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      progressTrigger.kill();

      gsap.ticker.remove(onTick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Page/route anim setup (rebuild on route change)
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      // Intro (hero) mount anim
      const heroIntro = gsap.utils.toArray<HTMLElement>("[data-hero-intro]");
      if (heroIntro.length) {
        gsap.fromTo(
          heroIntro,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.06 }
        );
      }

      // Reveal batch (performant)
      const reveal = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (reveal.length) {
        ScrollTrigger.batch(reveal, {
          start: "top 82%",
          onEnter: (batch) =>
            gsap.fromTo(
              batch,
              { y: 16, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.06 }
            ),
          once: true,
        });
      }

      // Parallax (hafif)
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = Number(el.dataset.speed ?? "18");
        gsap.fromTo(
          el,
          { y: -speed },
          {
            y: speed,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      // Desktop-only pin & horizontal
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-hscroll]").forEach((section) => {
          const pin = section.querySelector<HTMLElement>("[data-hscroll-pin]") ?? section;
          const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
          if (!track) return;

          const getDistance = () => Math.max(0, track.scrollWidth - pin.clientWidth);

          gsap.to(track, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: pin,
              start: "top top",
              end: () => `+=${Math.max(600, getDistance() + window.innerWidth)}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
        });

        // Optional: küçük “section pin” (istersen ileride ekleriz)
      });

      // Magnetic (pointer fine only)
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      if (finePointer) {
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
      }
    }, document.body);

    // route sonrası ölçüm
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cleanups.forEach((fn) => fn());
      mm.revert();
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
}
