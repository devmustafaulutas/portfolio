"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap, Flip, ScrollTrigger } from "@/lib/gsap";
import { decryptOnScroll } from "@/lib/kinetic";
import type { ExperienceEntry } from "@/content/experience";

type ExperienceSectionMeta = {
  label: string;
  title: string;
  lede: string;
};

type ExperienceAccordionProps = {
  section: ExperienceSectionMeta;
  entries: ExperienceEntry[];
};

/**
 * Act III. No timeline, no cards: a screen-wide monochrome accordion.
 * The open row inverts to pure white, the panel unfolds with GSAP
 * Flip (layout-aware, so every sibling row glides instead of jumping),
 * and each panel reads like a case study, not a CV bullet list.
 */
export function ExperienceAccordion({
  section,
  entries,
}: ExperienceAccordionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  // Flip pattern with React state: capture layout BEFORE the state
  // change, let React re-render, then animate FROM the captured state
  // in a layout effect — before the browser paints the jump.
  const pendingFlipRef = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const openedIdRef = useRef<string | null>(null);

  const toggle = (id: string) => {
    ensureGsap();
    const root = sectionRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!reduceMotion) {
      pendingFlipRef.current = Flip.getState(
        root.querySelectorAll("[data-flip]"),
      );
    }

    const next = openId === id ? null : id;
    openedIdRef.current = next;
    setOpenId(next);
  };

  useLayoutEffect(() => {
    const state = pendingFlipRef.current;
    pendingFlipRef.current = null;

    if (!state) {
      ScrollTrigger.refresh();
      return;
    }

    Flip.from(state, {
      duration: 0.85,
      ease: "monoInOut",
      nested: true,
      onComplete: () => ScrollTrigger.refresh(),
    });

    // Freshly opened case-study copy slides up under the fold
    const root = sectionRef.current;
    const opened = openedIdRef.current;
    if (root && opened) {
      const body = root.querySelector<HTMLElement>(
        `[data-acc-body="${opened}"]`,
      );
      if (body) {
        gsap.fromTo(
          body.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "monoOut",
            stagger: 0.07,
            delay: 0.25,
          },
        );
      }
    }
  }, [openId]);

  useGSAP(
    () => {
      ensureGsap();
      const root = sectionRef.current;
      if (!root) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (titleRef.current) {
          decryptOnScroll(titleRef.current);
        }

        gsap.from("[data-acc-row]", {
          opacity: 0,
          y: 44,
          duration: 0.9,
          ease: "monoOut",
          stagger: 0.09,
          scrollTrigger: {
            trigger: root.querySelector("[data-acc-list]"),
            start: "top 78%",
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      data-chapter="KARİYER"
      className="relative py-28 sm:py-40"
    >
      <span className="ghost-index" aria-hidden="true">
        02
      </span>
      <header className="px-5 pb-14 sm:px-10 sm:pb-20">
        <div className="section-head">
          <span className="type-mono-bright">{section.label}</span>
          <span className="type-mono">SAYFA 03 / 05</span>
        </div>
        <h2
          ref={titleRef}
          data-skew
          className="type-display max-w-5xl text-[clamp(2.2rem,7vw,6rem)]"
        >
          {section.title}
        </h2>
        <p className="type-mono mt-7 max-w-xl normal-case leading-relaxed tracking-[0.08em]">
          {section.lede}
        </p>
      </header>

      <div data-acc-list>
        {entries.map((entry) => {
          const isOpen = openId === entry.id;
          return (
            <article
              key={entry.id}
              data-acc-row
              data-flip
              data-open={isOpen}
              className="acc-row"
            >
              <button
                type="button"
                className="acc-head"
                onClick={() => toggle(entry.id)}
                aria-expanded={isOpen}
                aria-controls={`acc-panel-${entry.id}`}
              >
                <span className="acc-index">{entry.index}</span>
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="acc-title">{entry.company}</span>
                  <span className="acc-meta">
                    {entry.role} — {entry.period}
                  </span>
                </span>
                <span className="acc-icon" aria-hidden="true" />
              </button>

              <div
                id={`acc-panel-${entry.id}`}
                role="region"
                aria-label={`${entry.company} vaka analizi`}
                data-flip
                className="acc-panel"
                style={{ height: isOpen ? "auto" : 0 }}
              >
                <div data-acc-body={entry.id} className="acc-body">
                  <div className="flex flex-col gap-6">
                    <h3 className="acc-headline">{entry.headline}</h3>
                    {entry.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)} className="acc-case">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="flex flex-wrap content-start gap-2">
                    {entry.tech.map((tech) => (
                      <span key={tech} className="acc-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
