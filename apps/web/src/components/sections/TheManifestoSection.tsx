"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, SplitText } from "@/lib/gsap";
import { decryptOnScroll } from "@/lib/kinetic";
import type { ManifestoParagraph } from "@/content/manifesto";

type ManifestoContent = {
  label: string;
  title: string;
  paragraphs: readonly ManifestoParagraph[];
};

type ManifestoOpener = {
  kicker: string;
  lines: readonly string[];
};

type TheManifestoSectionProps = {
  content: ManifestoContent;
  opener: ManifestoOpener;
};

/**
 * Act II. Long-form copy that crawls out of the dark: every line
 * starts as a grey whisper and is pulled to full white as it crosses
 * the reading zone. autoSplit keeps line-breaking honest across
 * font swaps and resizes.
 */
export function TheManifestoSection({
  content,
  opener,
}: TheManifestoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      ensureGsap();
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (titleRef.current) {
          decryptOnScroll(titleRef.current);
        }

        // The opening statement rises out of masked slots
        gsap.from("[data-opener-line]", {
          yPercent: 112,
          duration: 1.05,
          ease: "monoOut",
          stagger: 0.14,
          scrollTrigger: {
            trigger: "[data-manifesto-opener]",
            start: "top 62%",
          },
        });

        gsap.from("[data-manifesto-label]", {
          opacity: 0,
          y: 18,
          duration: 0.8,
          scrollTrigger: { trigger: section, start: "top 82%" },
        });

        section
          .querySelectorAll<HTMLElement>("[data-manifesto-par]")
          .forEach((paragraph) => {
            SplitText.create(paragraph, {
              type: "lines",
              linesClass: "line",
              autoSplit: true,
              onSplit: (self) =>
                gsap.fromTo(
                  self.lines,
                  { opacity: 0.12 },
                  {
                    opacity: 1,
                    ease: "none",
                    stagger: 0.35,
                    scrollTrigger: {
                      trigger: paragraph,
                      start: "top 82%",
                      end: "bottom 46%",
                      scrub: true,
                    },
                  },
                ),
            });
          });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      data-chapter="MANİFESTO"
      className="relative px-5 py-28 sm:px-10 sm:py-40"
    >
      <span className="ghost-index" aria-hidden="true">
        01
      </span>

      {/* The opening statement — a full-viewport declaration */}
      <div
        data-manifesto-opener
        className="mb-28 flex min-h-[70svh] flex-col items-start justify-center sm:mb-40"
      >
        <p className="type-mono mb-8">{opener.kicker}</p>
        {opener.lines.map((line) => (
          <span key={line} className="block overflow-hidden py-1">
            <span data-opener-line className="hero-manifesto-line block">
              {line}
            </span>
          </span>
        ))}
      </div>

      <div data-manifesto-label className="section-head">
        <span className="type-mono-bright">{content.label}</span>
        <span className="type-mono">SAYFA 02 / 05</span>
      </div>
      <h2
        ref={titleRef}
        data-skew
        className="type-display max-w-5xl text-[clamp(2.2rem,7vw,6rem)]"
      >
        {content.title}
      </h2>

      <div className="mt-16 flex flex-col gap-14 sm:mt-24 sm:gap-20 lg:ml-[22%]">
        {content.paragraphs.map((paragraph, index) => (
          <div key={paragraph.id} className="flex flex-col gap-4">
            <span className="type-mono text-faint">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(content.paragraphs.length).padStart(2, "0")}
            </span>
            <p data-manifesto-par className="manifesto-par">
              {paragraph.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
