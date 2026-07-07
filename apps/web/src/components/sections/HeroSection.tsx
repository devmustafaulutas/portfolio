"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";
import { introBus } from "@/lib/intro-bus";
import { DECRYPT_CHARS } from "@/lib/kinetic";
import { Magnetic } from "@/components/ui/Magnetic";
import { useSmoothScroll } from "@/components/layout/SmoothScrollLayout";

type HeroContent = {
  name: string;
  role: string;
  meta: readonly string[];
  strip: string;
  status: string;
  scrollCue: string;
};

type HeroSectionProps = {
  hero: HeroContent;
};

/**
 * The masthead. No ride, no hijack: two monumental lines rise out of
 * masked slots after the press roller lifts, the role decrypts, and
 * the letters keep breathing with the pointer. On scroll the lines
 * drift apart horizontally at opposing speeds — a confident,
 * editorial exit instead of a fairground zoom.
 */
export function HeroSection({ hero }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const lastLineRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const cueBarRef = useRef<HTMLSpanElement>(null);
  const { scrollTo } = useSmoothScroll();

  const [firstName, ...rest] = hero.name.split(" ");
  const lastName = rest.join(" ");

  useGSAP(
    () => {
      ensureGsap();
      const section = sectionRef.current;
      const firstLine = firstLineRef.current;
      const lastLine = lastLineRef.current;
      const role = roleRef.current;
      if (!section || !firstLine || !lastLine || !role) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Held below the fold of their masks until the press lifts
        gsap.set([firstLine, lastLine], { yPercent: 112 });
        gsap.set("[data-hero-meta]", { autoAlpha: 0, y: 14 });

        const playEntrance = () => {
          const entrance = gsap.timeline();
          entrance
            .to(firstLine, {
              yPercent: 0,
              duration: 1.1,
              ease: "monoOut",
            })
            .to(
              lastLine,
              { yPercent: 0, duration: 1.1, ease: "monoOut" },
              0.12,
            )
            .to(
              role,
              {
                duration: 1.1,
                ease: "none",
                scrambleText: {
                  text: hero.role,
                  chars: DECRYPT_CHARS,
                  speed: 0.4,
                },
              },
              0.5,
            )
            .to(
              "[data-hero-meta]",
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
              0.7,
            );
        };

        const unsubscribe = introBus.onFinish(playEntrance);

        // Pointer field — letters drift apart, lines shear opposite ways
        const spacingFirst = gsap.quickTo(firstLine, "letterSpacing", {
          duration: 0.6,
          ease: "power2",
        });
        const spacingLast = gsap.quickTo(lastLine, "letterSpacing", {
          duration: 0.6,
          ease: "power2",
        });

        const onPointerTick = () => {
          const spread = scrollBus.pointerX * 12;
          spacingFirst(spread);
          spacingLast(spread * 0.7);
        };
        gsap.ticker.add(onPointerTick);

        // Editorial exit: the masthead splits apart as the reader leaves
        gsap.to(firstLine, {
          xPercent: -9,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to(lastLine, {
          xPercent: 9,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
        gsap.to("[data-hero-fade]", {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "55% top",
            scrub: true,
          },
        });

        if (cueBarRef.current) {
          gsap.fromTo(
            cueBarRef.current,
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              duration: 1.3,
              ease: "monoInOut",
              repeat: -1,
              yoyo: true,
            },
          );
        }

        return () => {
          unsubscribe();
          gsap.ticker.remove(onPointerTick);
        };
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-chapter="GİRİŞ"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 pb-10 pt-20 sm:px-10"
    >
      <span className="ghost-index" aria-hidden="true">
        00
      </span>

      <div
        data-hero-meta
        data-hero-fade
        className="type-mono flex flex-wrap items-center gap-x-6 gap-y-2"
      >
        {hero.meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-start justify-center">
        <h1 className="type-display hero-name">
          <span className="block overflow-hidden">
            <span ref={firstLineRef} className="block">
              {firstName}
            </span>
          </span>
          <span
            data-hero-meta
            className="type-mono my-3 block sm:my-4"
          >
            {hero.strip}
          </span>
          <span className="block overflow-hidden">
            <span ref={lastLineRef} className="block text-outline-w">
              {lastName}
              <span className="hero-mark" aria-hidden="true">
                ©
              </span>
            </span>
          </span>
        </h1>
        {/* lang="en": English role title must not pick up Turkish
            dotted-İ rules during CSS uppercasing. The sizer keeps the
            slot height stable while ScrambleText types into it. */}
        <p
          data-hero-meta
          lang="en"
          className="type-mono-bright mt-8"
          aria-label={hero.role}
        >
          <span ref={roleRef} aria-hidden="true">
            {hero.role}
          </span>
        </p>
      </div>

      <div
        data-hero-meta
        data-hero-fade
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <Magnetic strength={0.3}>
          <button
            type="button"
            onClick={() => scrollTo("#manifesto")}
            className="group flex items-center gap-4 border-0 bg-transparent p-0 text-left"
            aria-label="Manifestoya in"
          >
            <span ref={cueBarRef} className="scroll-cue-bar" />
            <span className="type-mono transition-colors duration-300 group-hover:text-fg">
              {hero.scrollCue}
            </span>
          </button>
        </Magnetic>
        <span className="type-mono">{hero.status}</span>
      </div>
    </section>
  );
}
