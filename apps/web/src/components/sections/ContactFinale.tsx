"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { initReveals } from "@/lib/reveal";
import { contactContent } from "@/content/contact";
import { site } from "@/config/site";
import Magnetic from "@/components/ui/Magnetic";
import ScrambleText from "@/components/ui/ScrambleText";

/**
 * Kapanış · filmin son sahnesi. Saf siyah, dev final cümlesi,
 * manyetik dairesel CTA ve alt kenardan taşan hayalet isim.
 */
export default function ContactFinale() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        initReveals(section);

        const statementInners = section.querySelectorAll<HTMLElement>("[data-final-inner]");
        gsap.fromTo(
          statementInners,
          { yPercent: 125 },
          {
            yPercent: 0,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: statementInners[0] ?? section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );

        const watermark = section.querySelector<HTMLElement>("[data-watermark]");
        if (watermark) {
          gsap.fromTo(
            watermark,
            { yPercent: 45 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 60%",
                end: "bottom bottom",
                scrub: true,
              },
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  const links = [
    { label: "GITHUB", href: site.social.github },
    { label: "LINKEDIN", href: site.social.linkedin },
    { label: "E-POSTA", href: `mailto:${site.email}` },
  ];

  return (
    <section
      id="iletisim"
      ref={sectionRef}
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-black text-paper"
    >
      <div className="mx-auto w-full max-w-7xl px-5 pt-28 md:px-10 md:pt-40">
        <p data-reveal className="font-mono text-[10px] tracking-[0.3em] opacity-50 md:text-[11px]">
          {contactContent.label} · {contactContent.kicker}
        </p>

        <h2 className="mt-12 font-display uppercase leading-[0.9]">
          {contactContent.statementLines.map((line) => (
            <span key={line} className="line-mask">
              <span data-final-inner className="block text-[clamp(2.6rem,9vw,8.5rem)]">
                {line}
              </span>
            </span>
          ))}
        </h2>

        <div className="mt-12 flex flex-col gap-12 md:mt-16 md:flex-row md:items-end md:justify-between">
          <p data-reveal className="max-w-md text-base leading-relaxed opacity-65 md:text-lg">
            {contactContent.sub}
          </p>

          <div data-reveal className="shrink-0">
            <Magnetic strength={0.45}>
              <a
                href={`mailto:${site.email}`}
                data-scramble-host
                data-cursor
                className="flex size-40 items-center justify-center rounded-full border border-paper/40 text-center font-mono text-[11px] tracking-[0.2em] transition-colors duration-500 hover:bg-paper hover:text-ink md:size-52 md:text-xs"
              >
                <ScrambleText text={contactContent.cta} trigger="parent" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div data-reveal className="mt-16 border-t border-paper/15 pt-8 md:mt-24">
          <p className="font-mono text-[10px] tracking-[0.3em] opacity-45">
            {contactContent.linksLabel}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-10 gap-y-3">
            {links.map((link) => (
              <li key={link.label}>
                <Magnetic strength={0.25}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    data-scramble-host
                    className="font-mono text-sm tracking-[0.2em] md:text-base"
                  >
                    <ScrambleText text={link.label} trigger="parent" /> ↗
                  </a>
                </Magnetic>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="relative mt-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 pb-4 font-mono text-[9px] tracking-[0.2em] opacity-45 md:px-10 md:text-[10px]">
          <span>© 2026 MUSTAFA ULUTAŞ · {site.location.toUpperCase()}</span>
          <span>{contactContent.footerNote}</span>
          <span>{site.rev}</span>
        </div>
        <p
          data-watermark
          aria-hidden
          className="text-outline-thin pointer-events-none -mb-[0.23em] select-none text-center font-display text-[clamp(6rem,22vw,20rem)] uppercase leading-none"
        >
          ULUTAŞ
        </p>
      </footer>
    </section>
  );
}
