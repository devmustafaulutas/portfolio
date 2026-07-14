"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { scrambleTo, randomHash } from "@/lib/scramble";
import { bootBus } from "@/lib/boot-bus";
import { bootContent } from "@/content/hero";

/**
 * Sinematik açılış: saf siyah ekran, sistem günlüğü satırları,
 * şifre-çözme efektiyle beliren isim, sonra yukarı kalkan perde.
 * - Tıklama ile atlanabilir.
 * - prefers-reduced-motion: CSS overlay'i gizler, bus hemen tamamlanır.
 * - JS yoksa <noscript> stili overlay'i kaldırır (layout'ta).
 */
export default function BootSequence() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const hashRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const [active, setActive] = useState(() => !bootBus.isDone());

  useGSAP(
    (_, contextSafe) => {
      const overlay = overlayRef.current;
      const name = nameRef.current;
      const hash = hashRef.current;
      const counter = counterRef.current;
      if (!overlay || !name || !hash || !counter || !contextSafe) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        bootBus.complete();
        setActive(false);
        return;
      }

      // Açılış her zaman en üstten oynar; tarayıcının scroll
      // restorasyonu sekansın ortasına düşürmesin.
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";

      let cancelScramble: (() => void) | null = null;
      const hashTicker = window.setInterval(() => {
        hash.textContent = `SHA: ${randomHash(20)}`;
      }, 90);

      const finish = contextSafe(() => {
        window.clearInterval(hashTicker);
        cancelScramble?.();
        document.body.style.overflow = "";
        window.scrollTo(0, 0);
        bootBus.complete();
        setActive(false);
      });

      const progress = { value: 0 };
      const logLines = overlay.querySelectorAll<HTMLElement>("[data-boot-line]");

      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      tl.fromTo(
        logLines,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.14, ease: "power2.out" },
        0,
      );

      tl.set(name, { autoAlpha: 1 }, 0.25);
      tl.call(
        () => {
          cancelScramble = scrambleTo(name, bootContent.name, {
            duration: 1500,
            tick: 34,
            hold: 150,
          });
        },
        undefined,
        0.25,
      );

      tl.to(
        progress,
        {
          value: 100,
          duration: 2.1,
          ease: "power2.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(progress.value)).padStart(3, "0");
          },
        },
        0.15,
      );

      if (barRef.current) {
        tl.fromTo(
          barRef.current,
          { scaleX: 0 },
          { scaleX: 1, duration: 2.1, ease: "power2.inOut" },
          0.15,
        );
      }

      tl.to(name, { scale: 1.05, duration: 0.5, ease: "power2.in" }, 2.45);
      tl.to(
        overlay,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.95, ease: "expo.inOut" },
        2.6,
      );

      return () => {
        window.clearInterval(hashTicker);
        cancelScramble?.();
        document.body.style.overflow = "";
      };
    },
    // scope bilinçli olarak yok: overlay boot sonrası null render eder,
    // null scope GSAP'ta "Invalid scope" uyarısı üretir. İçeride gsap
    // selector string'i kullanılmadığı için scope'a gerek de yok.
    [],
  );

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="boot-overlay fixed inset-0 z-[90] bg-black text-paper"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      onPointerDown={() => tlRef.current?.progress(1)}
      aria-label={bootContent.name}
      role="presentation"
    >
      <div className="flex h-full flex-col justify-between p-6 md:p-10">
        <div className="flex items-start justify-between font-mono text-[10px] tracking-[0.3em] opacity-60 md:text-[11px]">
          <span>{bootContent.cornerTopLeft}</span>
          <span>{bootContent.cornerTopRight}</span>
        </div>

        <div className="flex flex-col items-center text-center">
          <p
            ref={nameRef}
            className="font-display text-[clamp(2.4rem,9vw,7rem)] uppercase leading-none opacity-0"
          >
            {bootContent.name}
          </p>
          <p ref={hashRef} className="mt-6 font-mono text-[10px] tracking-[0.2em] opacity-40 md:text-xs">
            SHA: ····················
          </p>
        </div>

        <div className="flex items-end justify-between gap-8">
          <div className="font-mono text-[10px] leading-relaxed tracking-[0.12em] opacity-70 md:text-[11px]">
            {bootContent.logLines.map((line) => (
              <p key={line} data-boot-line className="opacity-0">
                <span className="mr-2 inline-block">▸</span>
                {line}
              </p>
            ))}
            <p className="mt-3 opacity-40">{bootContent.skipHint}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span ref={counterRef} className="font-mono text-2xl tabular-nums md:text-3xl">
              000
            </span>
            <div className="h-px w-28 bg-smoke md:w-40">
              <div ref={barRef} className="h-px origin-left scale-x-0 bg-paper" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
