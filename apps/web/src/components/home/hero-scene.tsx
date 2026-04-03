"use client";

import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Mail } from "lucide-react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useReducedMotionPreference } from "@/components/motion/motion-provider";
import { siteConfig } from "@/config/site";

const THEMES = [
  "arayüz hissi",
  "okuma ritmi",
  "motion dili",
  "performans",
] as const;

export function HeroScene() {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotionPreference();

  useGSAP(
    () => {
      if (!rootRef.current || reducedMotion) return;

      gsap.set("[data-hero-rail]", { y: 12, opacity: 0 });
      gsap.set("[data-hero-intro]", { y: 18, opacity: 0 });
      gsap.set("[data-hero-body]", { y: 16, opacity: 0 });
      gsap.set("[data-hero-actions]", { y: 14, opacity: 0 });
      gsap.set("[data-hero-theme]", { y: 8, opacity: 0 });
      gsap.set("[data-hero-scroll]", { y: 8, opacity: 0 });
      gsap.set("[data-hero-glow]", { scale: 0.94, opacity: 0.18 });

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to("[data-hero-rail]", {
        y: 0,
        opacity: 1,
        duration: 0.55,
      });

      tl.to(
        "[data-hero-intro]",
        {
          y: 0,
          opacity: 1,
          duration: 0.86,
          stagger: 0.08,
        },
        0.08
      );

      tl.to(
        "[data-hero-body]",
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.06,
        },
        0.22
      );

      tl.to(
        "[data-hero-actions]",
        {
          y: 0,
          opacity: 1,
          duration: 0.62,
        },
        0.3
      );

      tl.to(
        "[data-hero-theme]",
        {
          y: 0,
          opacity: 1,
          duration: 0.52,
          stagger: 0.04,
        },
        0.36
      );

      tl.to(
        "[data-hero-scroll]",
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
        },
        0.44
      );

      gsap.to("[data-hero-glow]", {
        scale: 1,
        opacity: 1,
        duration: 1.7,
        ease: "power2.out",
      });

      gsap.to("[data-hero-scroll]", {
        y: 6,
        repeat: -1,
        yoyo: true,
        duration: 1.45,
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
          className="absolute left-[12%] top-[14%] h-[16rem] w-[16rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--accent) / 0.12), transparent 72%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, hsl(var(--background) / 0.05) 72%, hsl(var(--background)) 100%)",
          }}
        />
      </div>

      <div className="container-site relative z-10">
        <div className="grid min-h-[calc(76svh-4.5rem)] gap-10 py-16 md:py-20 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16 lg:py-24">
          <aside className="flex flex-col justify-between">
            <div data-hero-rail>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]">
                merhaba
              </div>
              <div className="mt-3 h-px w-12 bg-[hsl(var(--border))]" />
              <p className="mt-4 max-w-[12ch] text-sm leading-7 text-[hsl(var(--foreground-2))]">
                Ben Mustafa. Daha çok sakin ama güçlü ürünlerle ilgileniyorum.
              </p>
            </div>

            <div data-hero-rail className="hidden lg:block">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]">
                iletişim
              </div>
              <a
                href={`mailto:${siteConfig.author.email}`}
                className="mt-3 inline-flex items-center gap-2 text-sm text-[hsl(var(--foreground))] transition-colors hover:text-[hsl(var(--accent))]"
              >
                <Mail className="h-4 w-4" />
                {siteConfig.author.email}
              </a>
            </div>
          </aside>

          <div className="flex flex-col justify-center">
            <div className="max-w-[48rem]">
              <p
                data-hero-intro
                className="text-heading text-[clamp(1.45rem,2.8vw,2.35rem)] leading-[1.45] tracking-[-0.04em] text-[hsl(var(--foreground))]"
              >
                Merhaba, ben Mustafa. Daha çok iyi akan, iyi hissettiren ve teknik
                tarafı da düzgün kalan dijital ürünler yapmayı seviyorum.
              </p>

              <p
                data-hero-body
                className="mt-8 max-w-[42ch] text-[1rem] leading-8 text-[hsl(var(--foreground-2))] md:text-[1.08rem]"
              >
                Arayüz tarafında biraz fazla düşünüyorum. Bir ekranın sadece nasıl
                göründüğü değil, nasıl aktığı ve insanda ne bıraktığı daha çok
                ilgimi çekiyor.
              </p>

              <p
                data-hero-body
                className="mt-4 max-w-[38ch] text-sm leading-7 text-[hsl(var(--foreground-3))] md:text-[0.98rem]"
              >
                Günün sonunda işim daha çok Next.js, .NET, motion design ve
                performans etrafında dönüyor.
              </p>

              <div
                data-hero-actions
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                <Link href="/blog" className="btn btn-primary btn-lg">
                  Yazıları oku
                  <ArrowUpRight className="h-4 w-4" />
                </Link>

                <Link href="/about" className="btn btn-ghost btn-lg">
                  Hakkımda
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2">
                {THEMES.map((item, index) => (
                  <div
                    key={item}
                    data-hero-theme
                    className="inline-flex items-center gap-3 text-sm text-[hsl(var(--foreground-3))]"
                  >
                    {index > 0 ? (
                      <span className="h-1 w-1 rounded-full bg-[hsl(var(--foreground-3))]" />
                    ) : null}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              data-hero-scroll
              className="mt-14 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--foreground-3))]"
            >
              aşağı kaydır
              <ArrowDownRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}