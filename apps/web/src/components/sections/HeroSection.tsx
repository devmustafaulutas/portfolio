"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, SplitText } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/layout/SmoothScrollLayout";

type HeroSectionProps = {
  name: string;
  role: string;
  location: string;
};

export function HeroSection({ name, role, location }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const titleLiveRef = useRef<HTMLSpanElement>(null);
  const cueLineRef = useRef<HTMLSpanElement>(null);
  const { scrollTo } = useSmoothScroll();

  const [firstName, ...rest] = name.toLocaleUpperCase("tr-TR").split(" ");
  const lastName = rest.join(" ");

  useGSAP(
    () => {
      ensureGsap();
      const section = sectionRef.current;
      const nameEl = nameRef.current;
      const titleLive = titleLiveRef.current;
      if (!section || !nameEl || !titleLive) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1 — the name crashes in, letter by letter, from the deep
        SplitText.create(nameEl, {
          type: "chars",
          mask: "chars",
          charsClass: "char",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.chars, {
              yPercent: 118,
              rotateX: -45,
              opacity: 0,
              transformOrigin: "50% 100%",
              duration: 1.25,
              ease: "deepOut",
              stagger: { each: 0.045, from: "start" },
              delay: 0.35,
            }),
        });

        // 2 — the role types itself out, then glitches like a bad feed
        const typing = gsap.timeline({ delay: 1.15 });
        typing
          .set(titleLive, { text: "" })
          .to(titleLive, {
            duration: 1.7,
            ease: "none",
            text: { value: role },
          });

        const glitch = gsap.timeline({
          repeat: -1,
          repeatDelay: 3.2,
          delay: 3.1,
        });
        glitch
          .to(titleLive, {
            x: -2,
            textShadow:
              "2px 0 rgba(255,74,38,0.85), -2px 0 rgba(56,225,255,0.85)",
            duration: 0.055,
            ease: "none",
          })
          .to(titleLive, {
            x: 2,
            textShadow:
              "-2px 0 rgba(255,74,38,0.85), 2px 0 rgba(56,225,255,0.85)",
            duration: 0.055,
            ease: "none",
          })
          .to(titleLive, {
            x: 0,
            textShadow: "0 0 14px rgba(56,225,255,0.45)",
            duration: 0.09,
            ease: "none",
          });

        // 3 — supporting chrome fades up after the name lands
        gsap.from("[data-hero-meta]", {
          opacity: 0,
          y: 18,
          duration: 0.9,
          stagger: 0.12,
          delay: 1.5,
        });

        // 4 — the scroll cue breathes until the user commits
        if (cueLineRef.current) {
          gsap.fromTo(
            cueLineRef.current,
            { scaleY: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              duration: 1.4,
              ease: "deepInOut",
              repeat: -1,
              yoyo: true,
            },
          );
        }

        // 5 — the whole stage sinks away as the journey begins
        if (contentRef.current) {
          gsap.to(contentRef.current, {
            yPercent: -24,
            opacity: 0.08,
            scale: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom 20%",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden px-5 pb-10 pt-24 sm:px-10"
    >
      <div ref={contentRef} className="flex flex-1 flex-col justify-center">
        <div
          data-hero-meta
          className="voice-mono mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 sm:mb-12"
        >
          <span>{location.toLocaleUpperCase("tr-TR")}</span>
          <span className="text-ember">▚</span>
          <span>40.68° N — 30.05° E</span>
          <span className="text-ember">▚</span>
          <span>EST. 05.2025 — ITERATING</span>
        </div>

        <h1 ref={nameRef} className="voice-display hero-name text-ink">
          {firstName}
          <br />
          <span className="glow-pulse">{lastName}</span>
        </h1>

        {/* lang="en": the role is English — keeps CSS uppercasing from
            applying Turkish dotted-İ rules (ARCHİTECT → ARCHITECT). */}
        <p
          lang="en"
          className="hero-title-slot voice-mono-bright mt-8 text-[0.78rem] sm:mt-10 sm:text-[0.95rem]"
          aria-label={role}
        >
          <span className="hero-title-sizer" aria-hidden="true">
            {role}
          </span>
          <span
            ref={titleLiveRef}
            className="hero-title-live"
            aria-hidden="true"
          />
        </p>

        <p data-hero-meta className="voice-mono mt-4 max-w-xl leading-relaxed">
          .NET // CLEAN ARCHITECTURE // CQRS // MULTI-TENANT SAAS //
          RABBITMQ // REACT + TYPESCRIPT
        </p>
      </div>

      <div
        data-hero-meta
        className="flex items-end justify-between gap-6"
      >
        <button
          type="button"
          onClick={() => scrollTo("#journey")}
          className="group flex cursor-pointer items-center gap-4 border-0 bg-transparent p-0 text-left"
          aria-label="Yolculuğa başla"
        >
          <span ref={cueLineRef} className="scroll-cue-line" />
          <span className="voice-mono transition-colors duration-300 group-hover:text-pulse">
            KAYDIR — YOLCULUK BAŞLASIN
          </span>
        </button>
        <span className="voice-mono hidden sm:block">SCENE 01 / 04</span>
      </div>
    </section>
  );
}
