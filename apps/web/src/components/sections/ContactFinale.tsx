"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { decryptOnScroll } from "@/lib/kinetic";
import { Magnetic } from "@/components/ui/Magnetic";

type ContactFinaleProps = {
  email: string;
  github: string;
  linkedin: string;
  location: string;
  name: string;
};

/**
 * Act V. The decompression chamber: one sentence, one address,
 * one magnetic button. Black closes over the page like a curtain.
 */
export function ContactFinale({
  email,
  github,
  linkedin,
  location,
  name,
}: ContactFinaleProps) {
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

        gsap.from("[data-finale-item]", {
          opacity: 0,
          y: 26,
          duration: 0.9,
          ease: "monoOut",
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
      data-chapter="İLETİŞİM"
      className="relative flex min-h-svh flex-col justify-between px-5 pb-8 pt-28 sm:px-10 sm:pt-40"
    >
      <span className="ghost-index" aria-hidden="true">
        04
      </span>
      <div>
        <div className="section-head">
          <span className="type-mono-bright">04 — İLETİŞİM</span>
          <span className="type-mono">SAYFA 05 / 05 — SON</span>
        </div>
        <h2
          ref={titleRef}
          data-skew
          className="type-display max-w-5xl text-[clamp(2.4rem,8.5vw,7.5rem)]"
        >
          Bir sonraki sistemi birlikte kuralım
        </h2>

        <div className="mt-14 flex flex-col items-start gap-10" data-finale-item>
          <a href={`mailto:${email}`} className="contact-mail">
            {email}
          </a>
          <Magnetic strength={0.35}>
            <a href={`mailto:${email}`} className="magnetic-btn">
              E-POSTA GÖNDER ↗
            </a>
          </Magnetic>
        </div>

        <div
          className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4"
          data-finale-item
        >
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GITHUB ↗
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            LINKEDIN ↗
          </a>
          <span className="type-mono">
            {location.toLocaleUpperCase("tr-TR")}
          </span>
        </div>
      </div>

      {/* Künye — the colophon every printed document deserves */}
      <footer
        className="mt-24 grid gap-8 border-t border-line pt-8 sm:grid-cols-4"
        data-finale-item
      >
        <div>
          <p className="type-mono mb-2 text-faint">KÜNYE</p>
          <p className="type-mono">
            © {year} {name.toLocaleUpperCase("tr-TR")}
          </p>
        </div>
        <div>
          <p className="type-mono mb-2 text-faint">DİZGİ</p>
          <p className="type-mono">ARCHIVO — JETBRAINS MONO</p>
        </div>
        <div>
          <p className="type-mono mb-2 text-faint">MOTOR</p>
          <p className="type-mono">NEXT.JS · GSAP · LENIS · R3F</p>
        </div>
        <div>
          <p className="type-mono mb-2 text-faint">BASKI</p>
          <p className="type-mono">SİYAH №1 — REV 2026.07 · G: GRID</p>
        </div>
      </footer>
    </section>
  );
}
