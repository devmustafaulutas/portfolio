"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ensureGsap, gsap } from "@/lib/gsap";
import { introBus } from "@/lib/intro-bus";

type PreloaderProps = {
  lenis: Lenis | null;
};

const TOC_LINES = ["MANİFESTO", "KARİYER", "SEÇİLMİŞ İŞLER", "İLETİŞİM"];
const SEEN_KEY = "mu-intro-seen";
const FIRST_VISIT_MS = 2200;
const RETURN_VISIT_MS = 650;

/**
 * The proof print. No hacker theatrics: the table of contents flips
 * through while a hairline rule fills, then the whole black slab
 * lifts like a press roller and hands the stage to the hero (via the
 * intro bus). Returning visitors in the same session get a 0.65s cut.
 */
export function Preloader({ lenis }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tocRef = useRef<HTMLSpanElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(introBus.finished);

  // The scroll lock must hold from the very first frame until the
  // slab lifts. The component never unmounts (it just renders null
  // once gone), so releasing the lock hangs off the intro bus.
  useEffect(() => {
    if (introBus.finished || !lenis) return;
    lenis.stop();
    const unsubscribe = introBus.onFinish(() => lenis.start());
    return () => {
      unsubscribe();
      lenis.start();
    };
  }, [lenis]);

  useEffect(() => {
    if (introBus.finished) return;
    ensureGsap();

    const root = rootRef.current;
    const toc = tocRef.current;
    const rule = ruleRef.current;
    if (!root || !toc || !rule) return;

    let cancelled = false;
    const timeline = gsap.timeline();

    const finish = () => {
      if (cancelled) return;
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // storage may be unavailable (private mode) — the intro just replays
      }
      setGone(true);
      introBus.finish();
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const returning = (() => {
      try {
        return window.sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {
        return false;
      }
    })();

    if (reduceMotion) {
      timeline
        .to(root, { autoAlpha: 0, duration: 0.25, delay: 0.35 })
        .call(finish);
      return () => {
        cancelled = true;
        timeline.kill();
      };
    }

    const holdMs = returning ? RETURN_VISIT_MS : FIRST_VISIT_MS;

    // The hairline fills across the hold window…
    timeline.fromTo(
      rule,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: holdMs / 1000,
        ease: "power1.inOut",
        transformOrigin: "left center",
      },
      0,
    );

    // …while the table of contents flips through the chapters
    if (!returning) {
      const step = holdMs / 1000 / TOC_LINES.length;
      TOC_LINES.forEach((line, index) => {
        timeline.call(
          () => {
            toc.textContent = line;
          },
          undefined,
          index * step,
        );
        timeline.fromTo(
          toc,
          { yPercent: 60, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: step * 0.55, ease: "monoOut" },
          index * step,
        );
      });
    }

    // Fonts settling before the slab lifts keeps the hero reveal crisp
    document.fonts.ready.catch(() => undefined).then(() => {
      if (cancelled) return;
      timeline
        .to(contentRef.current, { autoAlpha: 0, duration: 0.3 }, `>-0.05`)
        .to(root, {
          yPercent: -100,
          duration: 1.05,
          ease: "curtain",
        })
        .call(finish);
    });

    return () => {
      cancelled = true;
      timeline.kill();
    };
  }, []);

  if (gone) {
    return null;
  }

  return (
    <div
      id="preloader"
      ref={rootRef}
      className="preloader"
      role="status"
      aria-label="Yükleniyor"
    >
      <noscript>
        <style>{`#preloader{display:none!important}`}</style>
      </noscript>
      <span className="hud-corner left-4 top-4 sm:left-6 sm:top-6">
        MUSTAFA ULUTAŞ — PORTFOLYO
      </span>
      <span className="hud-corner right-4 top-4 text-right sm:right-6 sm:top-6">
        ©2026 — BASKI №1
      </span>
      <div
        ref={contentRef}
        className="relative z-10 flex w-full max-w-md flex-col items-center gap-6 px-6"
      >
        <span className="type-mono">İÇİNDEKİLER</span>
        <span className="block overflow-hidden py-1">
          <span ref={tocRef} className="preloader-toc block">
            {TOC_LINES[0]}
          </span>
        </span>
        <span ref={ruleRef} className="preloader-rule" />
      </div>
    </div>
  );
}
