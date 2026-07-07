"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { ensureGsap, gsap } from "@/lib/gsap";
import { introBus } from "@/lib/intro-bus";
import { makeBcryptHash, DECRYPT_CHARS } from "@/lib/kinetic";

type PreloaderProps = {
  lenis: Lenis | null;
};

const MIN_DISPLAY_MS = 1900;
const LOAD_TIMEOUT_MS = 4000;

/** Resolves when the document has really loaded (or the fallback fires). */
function waitForPageLoad(): Promise<void> {
  return new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve();
      return;
    }
    const timer = window.setTimeout(resolve, LOAD_TIMEOUT_MS);
    window.addEventListener(
      "load",
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

/**
 * The Opening Sequence. No percentages: a live stream of bcrypt
 * digests churns while assets load, snaps into "ACCESS GRANTED",
 * then two black curtains rip apart on a custom ease and hand the
 * stage to the hero (via the intro bus).
 */
export function Preloader({ lenis }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const dimLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [gone, setGone] = useState(introBus.finished);

  // The scroll lock must hold from the very first frame until the
  // curtains open — even though Lenis arrives one render later.
  // The component never unmounts (it just renders null once gone),
  // so releasing the lock must hang off the intro bus, not cleanup.
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
    const status = statusRef.current;
    if (!root || !status) return;

    let cancelled = false;
    let timeline: gsap.core.Timeline | null = null;

    const finish = () => {
      setGone(true);
      introBus.finish();
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      const timer = window.setTimeout(() => {
        gsap.to(root, { autoAlpha: 0, duration: 0.3, onComplete: finish });
      }, 400);
      return () => window.clearTimeout(timer);
    }

    // Phase 1 — the digest stream
    const ticker = window.setInterval(() => {
      status.textContent = makeBcryptHash();
      dimLineRefs.current.forEach((line) => {
        if (line) line.textContent = makeBcryptHash();
      });
    }, 70);

    const minDisplay = new Promise((resolve) =>
      window.setTimeout(resolve, MIN_DISPLAY_MS),
    );

    Promise.all([minDisplay, waitForPageLoad(), document.fonts.ready]).then(
      () => {
        if (cancelled) return;
        window.clearInterval(ticker);

        // Phase 2 — decryption resolves, curtains split
        timeline = gsap.timeline({ onComplete: finish });
        timeline
          .to(status, {
            duration: 0.9,
            ease: "none",
            scrambleText: {
              text: "ACCESS GRANTED",
              chars: DECRYPT_CHARS,
              speed: 0.5,
            },
          })
          .to(
            dimLineRefs.current.filter(Boolean),
            { autoAlpha: 0, duration: 0.35, stagger: 0.06 },
            "<",
          )
          .to(
            contentRef.current,
            { autoAlpha: 0, y: -18, duration: 0.4 },
            "+=0.45",
          )
          .addLabel("reveal", "-=0.1")
          .to(
            leftRef.current,
            { xPercent: -101, duration: 1.1, ease: "curtain" },
            "reveal",
          )
          .to(
            rightRef.current,
            { xPercent: 101, duration: 1.1, ease: "curtain" },
            "reveal",
          );
      },
    );

    return () => {
      cancelled = true;
      window.clearInterval(ticker);
      timeline?.kill();
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
      <div ref={leftRef} className="preloader-curtain preloader-curtain--left" />
      <div
        ref={rightRef}
        className="preloader-curtain preloader-curtain--right"
      />
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center gap-4 px-6 text-center"
      >
        <span className="type-mono">SECURE HANDSHAKE — BCRYPT/12</span>
        <span ref={statusRef} className="preloader-status">
          $2b$12$............................................
        </span>
        <span
          ref={(el) => {
            dimLineRefs.current[0] = el;
          }}
          className="preloader-hash"
        >
          $2b$12$............................................
        </span>
        <span
          ref={(el) => {
            dimLineRefs.current[1] = el;
          }}
          className="preloader-hash"
        >
          $2b$12$............................................
        </span>
      </div>
    </div>
  );
}
