"use client";

import { useEffect, useRef } from "react";
import { scrambleTo } from "@/lib/scramble";

type ScrambleTextProps = {
  text: string;
  className?: string;
  /** "parent": en yakın ebeveyn hover'ında tetiklenir (ör. proje satırı). */
  trigger?: "self" | "parent";
};

/**
 * Hover'da metni şifre-çözme efektiyle yeniden yazar.
 * Erişilebilirlik: aria-label sabit kalır, yalnızca görsel değişir.
 */
export default function ScrambleText({ text, className, trigger = "self" }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const host = trigger === "parent" ? (el.closest("[data-scramble-host]") ?? el) : el;

    const play = () => {
      cancelRef.current?.();
      cancelRef.current = scrambleTo(el, text, { duration: 480, tick: 28 });
    };

    host.addEventListener("pointerenter", play);

    return () => {
      host.removeEventListener("pointerenter", play);
      cancelRef.current?.();
      cancelRef.current = null;
    };
  }, [text, trigger]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
