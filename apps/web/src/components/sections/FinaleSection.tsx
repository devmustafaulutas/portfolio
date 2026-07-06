"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, SplitText } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";

type FinaleSectionProps = {
  email: string;
  github: string;
  linkedin: string;
  location: string;
  name: string;
};

export function FinaleSection({
  email,
  github,
  linkedin,
  location,
  name,
}: FinaleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      ensureGsap();
      const section = sectionRef.current;
      if (!section) return;

      // The apex leaves the scene at full intensity; the finale is the
      // decompression chamber — energy bleeds off as the user arrives.
      gsap.to(
        {},
        {
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top 90%",
            end: "top 20%",
            scrub: true,
            onUpdate: (self) => {
              scrollBus.intensity = Math.min(
                scrollBus.intensity,
                1 - self.progress * 0.8,
              );
            },
          },
        },
      );

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (titleRef.current) {
          SplitText.create(titleRef.current, {
            type: "words",
            mask: "words",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.words, {
                yPercent: 115,
                duration: 1.05,
                ease: "deepOut",
                stagger: 0.08,
                scrollTrigger: {
                  trigger: titleRef.current,
                  start: "top 80%",
                },
              }),
          });
        }

        gsap.from("[data-finale-item]", {
          opacity: 0,
          y: 26,
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
          },
        });
      });
    },
    { scope: sectionRef },
  );

  const year = new Date().getFullYear();

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-svh flex-col justify-between px-5 pb-8 pt-32 sm:px-10 sm:pt-44"
    >
      <div>
        <p className="voice-mono-bright mb-6">04 // NEXT CHAPTER</p>
        <h2
          ref={titleRef}
          className="voice-display text-ink max-w-5xl text-[clamp(2.9rem,9.5vw,8.5rem)]"
        >
          SIRADAKİ SİSTEMİ <span className="glow-pulse">BİRLİKTE</span>{" "}
          İNŞA EDELİM
        </h2>

        <div className="mt-16 flex flex-col gap-6" data-finale-item>
          <p className="voice-mono">SİNYAL GÖNDER —</p>
          <a href={`mailto:${email}`} className="finale-mail">
            {email}
          </a>
        </div>

        <div
          className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4"
          data-finale-item
        >
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="finale-link"
          >
            GITHUB ↗
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="finale-link"
          >
            LINKEDIN ↗
          </a>
          <span className="voice-mono">{location.toUpperCase()}</span>
        </div>
      </div>

      <footer
        className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6"
        data-finale-item
      >
        <p className="voice-mono">
          © {year} {name.toUpperCase()} — DEEP TECH &amp; EVOLUTION
        </p>
        <p className="voice-mono">
          NEXT.JS // GSAP // LENIS // REACT THREE FIBER
        </p>
      </footer>
    </section>
  );
}
