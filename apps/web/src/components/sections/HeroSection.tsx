"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";
import { introBus } from "@/lib/intro-bus";
import { DECRYPT_CHARS } from "@/lib/kinetic";
import { Magnetic } from "@/components/ui/Magnetic";
import { ZAxisTunnelLayout } from "@/components/layout/ZAxisTunnelLayout";
import { useSmoothScroll } from "@/components/layout/SmoothScrollLayout";

type HeroContent = {
  name: string;
  role: string;
  meta: readonly string[];
  scrollCue: string;
};

type HeroManifesto = {
  kicker: string;
  lines: readonly string[];
};

type HeroSectionProps = {
  hero: HeroContent;
  manifesto: HeroManifesto;
};

/**
 * Act I, tunnel edition. After the curtains split, the name decrypts
 * from cipher characters into "MUSTAFA ULUTAŞ" and the letters keep
 * breathing with the pointer. Scrolling doesn't scroll — it flies:
 * the ZAxisTunnelLayout dollies the name 18× past the lens while the
 * manifesto arrives from the far end of the Z axis.
 */
export function HeroSection({ hero, manifesto }: HeroSectionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const lastLineRef = useRef<HTMLSpanElement>(null);
  const cueBarRef = useRef<HTMLSpanElement>(null);
  const { scrollTo } = useSmoothScroll();

  const [firstName, ...rest] = hero.name.split(" ");
  const lastName = rest.join(" ");

  useGSAP(
    () => {
      ensureGsap();
      const firstLine = firstLineRef.current;
      const lastLine = lastLineRef.current;
      if (!firstLine || !lastLine) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hold everything dark until the curtains grant access
        gsap.set([firstLine, lastLine], { autoAlpha: 0, y: 42 });
        gsap.set("[data-hero-meta]", { autoAlpha: 0, y: 16 });

        const playEntrance = () => {
          const entrance = gsap.timeline();
          entrance
            .to(firstLine, { autoAlpha: 1, y: 0, duration: 0.6 }, 0)
            .to(
              firstLine,
              {
                duration: 1.15,
                ease: "none",
                scrambleText: {
                  text: firstName,
                  chars: DECRYPT_CHARS,
                  speed: 0.4,
                },
              },
              0.05,
            )
            .to(lastLine, { autoAlpha: 1, y: 0, duration: 0.6 }, 0.28)
            .to(
              lastLine,
              {
                duration: 1.15,
                ease: "none",
                scrambleText: {
                  text: lastName,
                  chars: DECRYPT_CHARS,
                  speed: 0.4,
                },
              },
              0.33,
            )
            .to(
              "[data-hero-meta]",
              { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 },
              1.0,
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
        const shiftFirst = gsap.quickTo(firstLine, "x", {
          duration: 0.8,
          ease: "power2",
        });
        const shiftLast = gsap.quickTo(lastLine, "x", {
          duration: 0.8,
          ease: "power2",
        });

        const onPointerTick = () => {
          const spread = scrollBus.pointerX * 14;
          spacingFirst(spread);
          spacingLast(spread * 0.7);
          shiftFirst(scrollBus.pointerX * -18);
          shiftLast(scrollBus.pointerX * 18);
        };
        gsap.ticker.add(onPointerTick);

        // The cue breathes until the flight begins
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
    { scope: contentRef },
  );

  const frontLayer = (
    <div
      ref={contentRef}
      className="flex min-h-svh flex-col justify-between px-5 pb-10 pt-20 sm:px-10"
    >
      <div
        data-hero-meta
        className="type-mono flex flex-wrap items-center gap-x-6 gap-y-2"
      >
        {hero.meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="flex flex-1 flex-col items-start justify-center">
        <h1 className="type-display hero-name">
          <span ref={firstLineRef} className="block">
            {firstName}
          </span>
          <span ref={lastLineRef} className="block text-outline-w">
            {lastName}
          </span>
        </h1>
        {/* lang="en": English role title must not pick up Turkish
            dotted-İ rules during CSS uppercasing. */}
        <p data-hero-meta lang="en" className="type-mono-bright mt-8">
          {hero.role}
        </p>
      </div>

      <div data-hero-meta className="flex items-end justify-between gap-6">
        <Magnetic strength={0.3}>
          <button
            type="button"
            onClick={() => scrollTo("#manifesto")}
            className="group flex items-center gap-4 border-0 bg-transparent p-0 text-left"
            aria-label="Tünelden manifestoya geç"
          >
            <span ref={cueBarRef} className="scroll-cue-bar" />
            <span className="type-mono transition-colors duration-300 group-hover:text-fg">
              {hero.scrollCue}
            </span>
          </button>
        </Magnetic>
        <span className="type-mono hidden sm:block">01 / 05</span>
      </div>
    </div>
  );

  const backLayer = (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="type-mono mb-8">{manifesto.kicker}</p>
      {manifesto.lines.map((line) => (
        <span key={line} className="hero-manifesto-line block py-1">
          {line}
        </span>
      ))}
    </div>
  );

  return (
    <ZAxisTunnelLayout
      id="hero"
      front={frontLayer}
      back={backLayer}
      length={260}
    />
  );
}
