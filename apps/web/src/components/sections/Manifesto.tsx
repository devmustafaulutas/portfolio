"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { splitWords } from "@/lib/split";
import { initReveals } from "@/lib/reveal";
import { manifestoContent } from "@/content/manifesto";

/**
 * Mühendislik manifestosu · kâğıt-beyaz editoryal kesit.
 * - Bölüm, siyah tünelin ardından derinlikten ölçeklenerek gelir.
 * - Paragraflar kelime kelime, scroll'a bağlı (scrub) aydınlanır;
 *   metin her zaman DOM'da düz hâliyle durur (SEO + no-JS).
 */
export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const sheet = sheetRef.current;
      if (!section || !sheet) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Derinlikten geliş · tünelin devamı gibi
        gsap.fromTo(
          sheet,
          { scale: 0.93, borderRadius: 28, transformOrigin: "50% 0%" },
          {
            scale: 1,
            borderRadius: 0,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "top 12%",
              scrub: true,
            },
          },
        );

        // Hayalet başlık paralaksı
        const ghost = section.querySelector<HTMLElement>("[data-ghost]");
        if (ghost) {
          gsap.fromTo(
            ghost,
            { yPercent: 30 },
            {
              yPercent: -30,
              ease: "none",
              scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        // Vurgu satırları · maske altından
        const quoteInners = section.querySelectorAll<HTMLElement>("[data-quote-inner]");
        gsap.fromTo(
          quoteInners,
          { yPercent: 125 },
          {
            yPercent: 0,
            duration: 1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: quoteInners[0] ?? section,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Kelime kelime aydınlanma
        const paragraphs = section.querySelectorAll<HTMLElement>("[data-manifesto-p]");
        const reverts: Array<() => void> = [];
        paragraphs.forEach((p) => {
          const { words, revert } = splitWords(p);
          reverts.push(revert);
          gsap.fromTo(
            words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.6,
              scrollTrigger: {
                trigger: p,
                start: "top 80%",
                end: "top 32%",
                scrub: true,
              },
            },
          );
        });

        initReveals(section);

        return () => {
          reverts.forEach((revert) => revert());
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section id="manifesto" ref={sectionRef} className="relative z-10 bg-ink">
      <div ref={sheetRef} className="relative overflow-hidden bg-paper text-ink">
        <p
          data-ghost
          aria-hidden
          className="text-outline-thin pointer-events-none absolute -right-6 top-1/4 select-none font-display text-[clamp(8rem,26vw,24rem)] uppercase leading-none opacity-60"
        >
          NO.01
        </p>

        <div className="relative mx-auto max-w-6xl px-5 py-28 md:px-10 md:py-40">
          <header data-reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] opacity-55">
              {manifestoContent.label}
            </p>
            <h2 className="mt-5 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.92]">
              {manifestoContent.title}
            </h2>
          </header>

          <div className="mt-16 md:mt-24" aria-label="Manifesto vurgusu">
            {manifestoContent.pullQuote.map((line) => (
              <p
                key={line}
                className="line-mask font-display text-[clamp(1.8rem,5vw,4rem)] uppercase leading-[1.02]"
              >
                <span data-quote-inner className="block">
                  {line}
                </span>
              </p>
            ))}
          </div>

          <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
            <div className="font-mono text-[10px] tracking-[0.25em] opacity-50 md:col-span-3 md:text-[11px]">
              <p>KAYIT / DURUŞ</p>
              <p className="mt-2">KAYNAK / SAHA DENEYİMİ</p>
              <p className="mt-2">DURUM / DEĞİŞMEZ</p>
            </div>
            <div className="space-y-10 md:col-span-8 md:col-start-5">
              {manifestoContent.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.id}
                  data-manifesto-p
                  className="text-lg leading-relaxed md:text-2xl md:leading-relaxed"
                >
                  {paragraph.text}
                </p>
              ))}
            </div>
          </div>

          <dl className="mt-20 grid grid-cols-1 gap-8 border-t border-ink/15 pt-10 sm:grid-cols-3 md:mt-28" data-reveal>
            {manifestoContent.proof.map((item) => (
              <div key={item.label}>
                <dt className="order-2 font-mono text-[10px] tracking-[0.25em] opacity-55 md:text-[11px]">
                  {item.label}
                </dt>
                <dd className="font-display text-6xl leading-none md:text-7xl">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
