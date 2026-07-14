"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { initReveals } from "@/lib/reveal";
import { journeySection, journeyChapters } from "@/content/journey";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Kariyer yolculuğu · masaüstünde pinlenen yatay sinema şeridi,
 * mobilde ve reduced-motion'da dikey, okunabilir bölümler.
 * Zirve bölümü (peak) kâğıt-beyaza ters çevrilerek yolculuğun
 * görsel doruğu yapılır.
 */
export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;

      const mm = gsap.matchMedia();

      // --- Masaüstü: yatay pinlenmiş yolculuk
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.set(section, { overflowX: "hidden" });

        const getDistance = () => track.scrollWidth - window.innerWidth;
        const total = journeyChapters.length;

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) gsap.set(barRef.current, { scaleX: self.progress });
              if (counterRef.current) {
                const current = Math.min(total, Math.max(1, Math.ceil(self.progress * total)));
                counterRef.current.textContent = `BÖLÜM ${String(current).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
              }
            },
          },
        });

        // Hayalet bölüm numaraları hafif paralaksla kayar
        const panels = track.querySelectorAll<HTMLElement>("[data-journey-panel]");
        panels.forEach((panel) => {
          const ghost = panel.querySelector<HTMLElement>("[data-ghost-num]");
          if (!ghost) return;
          gsap.fromTo(
            ghost,
            { xPercent: 14 },
            {
              xPercent: -14,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });

      // --- Mobil: dikey akışta tersinir görünme animasyonları
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        initReveals(section);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="yolculuk"
      ref={sectionRef}
      className="relative bg-ink text-paper md:h-svh md:overflow-x-auto"
    >
      <div ref={trackRef} className="md:flex md:h-full md:w-max">
        {/* Giriş paneli */}
        <div
          className="flex flex-col justify-center border-b border-paper/10 px-5 py-20 md:h-full md:w-[62vw] md:shrink-0 md:border-b-0 md:border-r md:px-14 lg:w-[52vw]"
          data-reveal
        >
          <SectionHeading
            label={journeySection.label}
            title={journeySection.title}
            lede={journeySection.lede}
          />
          <p className="mt-10 hidden font-mono text-[11px] tracking-[0.25em] opacity-45 md:block">
            {journeySection.hint} →
          </p>
        </div>

        {journeyChapters.map((chapter) => (
          <article
            key={chapter.id}
            data-journey-panel
            data-reveal
            className={`relative flex flex-col justify-between overflow-hidden border-b px-5 py-16 md:h-full md:shrink-0 md:border-b-0 md:border-r md:px-14 md:pb-16 md:pt-24 ${
              chapter.peak
                ? "border-ink/15 bg-paper text-ink md:w-[88vw] lg:w-[80vw]"
                : "border-paper/10 bg-ink text-paper md:w-[74vw] lg:w-[62vw]"
            }`}
          >
            <p
              data-ghost-num
              aria-hidden
              className="text-outline-thin pointer-events-none absolute -bottom-8 right-0 select-none font-display text-[clamp(10rem,30vh,22rem)] leading-none"
            >
              {chapter.index}
            </p>

            <header className="relative font-mono text-[10px] tracking-[0.25em] md:text-[11px]">
              <p className="opacity-50">BÖLÜM {chapter.index}</p>
              <p className="mt-2 text-sm tracking-[0.15em] md:text-base">{chapter.period}</p>
              <p className="mt-4 opacity-70">
                {chapter.place} · {chapter.role}
              </p>
            </header>

            <div className="relative mt-10 max-w-2xl md:mt-0 md:py-6">
              <h3 className="font-display text-[clamp(2.6rem,8vh,6rem)] uppercase leading-[0.95]">
                {chapter.title}
              </h3>
              <p className="mt-5 text-base leading-relaxed opacity-80 lg:text-lg">
                {chapter.narrative}
              </p>
            </div>

            <div className="relative mt-10 md:mt-0">
              <ul
                className={`space-y-2 font-mono text-[11px] leading-relaxed opacity-70 md:text-xs ${
                  chapter.peak ? "md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-2 md:space-y-0" : ""
                }`}
              >
                {chapter.bullets.map((bullet) => (
                  <li key={bullet}>▸ {bullet}</li>
                ))}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-2">
                {chapter.tags.map((tag) => (
                  <li
                    key={tag}
                    className={`border px-2.5 py-1 font-mono text-[9px] tracking-[0.2em] md:text-[10px] ${
                      chapter.peak ? "border-ink/25" : "border-paper/20"
                    }`}
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {/* İlerleme rayı · yalnızca pinli masaüstü deneyiminde anlamlı */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden items-center gap-6 px-14 pb-6 mix-blend-difference md:flex motion-reduce:hidden!">
        <span
          ref={counterRef}
          className="font-mono text-[10px] tracking-[0.25em] text-white"
        >
          BÖLÜM 01 / {String(journeyChapters.length).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 bg-white/25">
          <div ref={barRef} className="h-px origin-left scale-x-0 bg-white" />
        </div>
      </div>
    </section>
  );
}
