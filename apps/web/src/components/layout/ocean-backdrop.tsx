"use client";

import React, { useEffect, useRef } from "react";
import styles from "./ocean-backdrop.module.css";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function OceanBackdrop({
  sharkSrc = "/assets/mascots/shark/shark-silhouette.svg",
}: {
  sharkSrc?: string;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mq.matches;
    el.style.setProperty("--motion", reduced ? "0" : "1");

    const update = () => {
      rafRef.current = null;
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = clamp01(window.scrollY / max);

      // derinlik: çok hafif (hero’da boğmasın)
      el.style.setProperty("--depth", String(p));
    };

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.ocean} />
      <div className={styles.rays} />
      <div className={styles.caustics} />
      <div className={styles.bubbles} />
      <div className={styles.grain} />

      {/* Sharks (biri sağ üst, biri sol alt) */}
      <img className={styles.sharkA} src={sharkSrc} alt="" draggable={false} />
      <img className={styles.sharkB} src={sharkSrc} alt="" draggable={false} />
    </div>
  );
}
