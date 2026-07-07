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

type TheManifestoSectionProps = {
  content: ManifestoContent;
};

/**
 * Act II. Long-form copy that crawls out of the dark: every line
 * starts as a grey whisper and is pulled to full white as it crosses
 * the reading zone. autoSplit keeps line-breaking honest across
 * font swaps and resizes.
 */
export function TheManifestoSection({ content }: TheManifestoSectionProps) {
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
      className="relative px-5 py-28 sm:px-10 sm:py-40"
    >
      <p data-manifesto-label className="type-mono mb-6">
        {content.label}
      </p>
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
