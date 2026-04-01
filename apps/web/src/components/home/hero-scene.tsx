"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/components/motion/motion-provider";
import { siteConfig } from "@/config/site";

const STACK = ["next.js", "gsap", "lenis", ".net", "typescript"] as const;

export function HeroScene() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      if (!rootRef.current || reducedMotion) return;

      gsap.set("[data-hero-kicker]", { y: 12, opacity: 0 });
      gsap.set("[data-hero-line]", { y: 18, opacity: 0 });
      gsap.set("[data-hero-copy]", { y: 16, opacity: 0 });
      gsap.set("[data-hero-action]", { y: 14, opacity: 0 });
      gsap.set("[data-hero-tag]", { y: 8, opacity: 0 });
      gsap.set("[data-hero-note]", { y: 18, opacity: 0 });
      gsap.set("[data-hero-scroll]", { y: 10, opacity: 0 });
      gsap.set("[data-hero-glow]", { scale: 0.92, opacity: 0.3 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to("[data-hero-kicker]", {
        y: 0,
        opacity: 1,
        duration: 0.65,
      });

      tl.to(
        "[data-hero-line]",
        {
          y: 0,
          opacity: 1,
          duration: 0.88,
          stagger: 0.08,
        },
        0.08
      );

      tl.to(
        "[data-hero-copy]",
        {
          y: 0,
          opacity: 1,
          duration: 0.78,
          stagger: 0.08,
        },
        0.22
      );

      tl.to(
        "[data-hero-action]",
        {
          y: 0,
          opacity: 1,
          duration: 0.68,
          stagger: 0.06,
        },
        0.32
      );

      tl.to(
        "[data-hero-tag]",
        {
          y: 0,
          opacity: 1,
          duration: 0.56,
          stagger: 0.04,
        },
        0.38
      );

      tl.to(
        "[data-hero-note]",
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
        },
        0.26
      );

      tl.to(
        "[data-hero-scroll]",
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
        },
        0.46
      );

      gsap.to("[data-hero-glow]", {
        scale: 1,
        opacity: 1,
        duration: 1.8,
        ease: "power2.out",
      });

      gsap.to("[data-hero-scroll]", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef, dependencies: [reducedMotion], revertOnUpdate: true }
  );

  return (
    <section
      ref={rootRef}
      className="relative isolate overflow-hidden border-b border-[hsl(var(--border))]"
      aria-label="Ana sahne"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          data-hero-glow
          className="absolute left-[-8%] top-[8%] h-[22rem] w-[22rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--accent) / 0.18), transparent 68%)",
          }}
        />
        <div
          className="absolute right-[-6%] bottom-[8%] h-[16rem] w-[16rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--accent-warm) / 0.08), transparent 72%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.08) 68%, hsl(var(--background)) 100%)",
          }}
        />
      </div>

      <div className="container-site relative z-10 py-16 md:py-20 lg:py-24">
        <div className="grid min-h-[calc(82svh-4.5rem)] items-center gap-12 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div className="max-w-[58rem]">
            <div data-hero-kicker className="section-label mb-6">
              merhaba · ben mustafa
            </div>

            <div className="space-y-2">
              <div
                data-hero-line
                className="text-display text-[clamp(2.9rem,8vw,6rem)] text-[hsl(var(--foreground))]"
              >
                Web’i biraz daha
              </div>
              <div
                data-hero-line
                className="text-display text-[clamp(2.9rem,8vw,6rem)] text-gradient"
              >
                hissedilir,
              </div>
              <div
                data-hero-line
                className="text-display text-[clamp(2.9rem,8vw,6rem)] text-[hsl(var(--foreground))]"
              >
                biraz daha kişisel
              </div>
              <div
                data-hero-line
                className="text-display text-[clamp(2.9rem,8vw,6rem)] text-[hsl(var(--foreground))]"
              >
                kılmayı seviyorum.
              </div>
            </div>

            <p
              data-hero-copy
              className="mt-8 max-w-[45ch] text-[1.04rem] leading-8 text-[hsl(var(--foreground-2))] md:text-[1.12rem]"
            >
              Kod yazmayı seviyorum ama çoğu zaman daha çok ilgimi çeken şey,
              o kodun insanda nasıl bir his bıraktığı oluyor.
            </p>

            <p
              data-hero-copy
              className="mt-4 max-w-[40ch] text-sm leading-7 text-[hsl(var(--foreground-3))] md:text-base"
            >
              Daha çok Next.js, .NET, motion design ve performans disiplininin
              birlikte nasıl daha doğal bir deneyim kurabileceğiyle ilgileniyorum.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link data-hero-action href="/about" className="btn btn-primary btn-lg">
                Ben kimim?
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link data-hero-action href="/blog" className="btn btn-secondary btn-lg">
                Yazıları oku
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {STACK.map((item) => (
                <span key={item} data-hero-tag className="badge">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:justify-self-end">
            <div
              data-hero-note
              className="max-w-[20rem] border-l border-[hsl(var(--border))] pl-5"
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]">
                şu sıralar
              </div>

              <p className="mt-3 text-sm leading-7 text-[hsl(var(--foreground-2))]">
                Samimi homepage ritmi, iyi okuma hissi ve gösterişsiz ama güçlü
                motion dili üzerine düşünüyorum.
              </p>

              <a
                href={`mailto:${siteConfig.author.email}`}
                className="mt-4 inline-flex items-center gap-2 text-sm text-[hsl(var(--foreground))] transition-colors hover:text-[hsl(var(--accent))]"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.author.email}
              </a>

              <div
                data-hero-scroll
                className="mt-8 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]"
              >
                aşağı kaydır
                <ArrowDownRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}