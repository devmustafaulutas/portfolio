"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";

/**
 * The instrument chrome that makes the document feel alive:
 *  - top-right: live İstanbul clock + availability pulse
 *  - bottom-left: scroll position as a percentage counter
 *  - bottom-right: current chapter (IntersectionObserver scrollspy)
 *  - press G: toggles the 12-column design grid overlay
 * Everything is fixed, transform/text-only — zero layout shift.
 */
export function InstrumentPanel() {
  const clockRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);
  const [gridVisible, setGridVisible] = useState(false);

  // Live clock — Europe/Istanbul, ticks once a second
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Istanbul",
    });
    const tick = () => {
      if (clockRef.current) {
        clockRef.current.textContent = `İSTANBUL ${formatter.format(new Date())}`;
      }
    };
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Percent counter — reads the scroll bus on the GSAP clock
  useEffect(() => {
    ensureGsap();
    let last = -1;
    const onTick = () => {
      const value = Math.round(scrollBus.progress * 100);
      if (value !== last && percentRef.current) {
        last = value;
        percentRef.current.textContent = `KAYDIRMA ${String(value).padStart(3, "0")}%`;
      }
    };
    gsap.ticker.add(onTick);
    return () => gsap.ticker.remove(onTick);
  }, []);

  // Scrollspy — whichever chapter owns the viewport centre wins
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-chapter]");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && chapterRef.current) {
            chapterRef.current.textContent = `BÖLÜM — ${
              (entry.target as HTMLElement).dataset.chapter ?? ""
            }`;
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // G — the designer's grid
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "g") return;
      const target = event.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      setGridVisible((visible) => !visible);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="hud-corner right-4 top-4 flex items-center gap-2 text-right sm:right-6 sm:top-6">
        <span ref={clockRef}>İSTANBUL --:--:--</span>
        <span className="hud-divider">—</span>
        <span className="flex items-center gap-1.5">
          MÜSAİT
          <span className="pulse-dot" aria-hidden="true" />
        </span>
      </div>
      <span
        ref={percentRef}
        className="hud-corner bottom-4 left-4 sm:bottom-6 sm:left-6"
      >
        KAYDIRMA 000%
      </span>
      <span
        ref={chapterRef}
        className="hud-corner bottom-4 right-4 text-right sm:bottom-6 sm:right-6"
      >
        BÖLÜM — GİRİŞ
      </span>
      <div
        className="grid-overlay"
        data-visible={gridVisible}
        aria-hidden="true"
      />
    </>
  );
}
