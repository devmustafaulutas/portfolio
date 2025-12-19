"use client";

import React, { useEffect, useMemo, useRef } from "react";
import styles from "./ocean-scene.module.css";

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

type OceanSceneProps = {
  sharkSrc?: string; // silhouette svg
  debug?: boolean;
};

export function OceanScene({
  sharkSrc = "/assets/mascots/shark/shark-angry.svg",
  debug,
}: OceanSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const isDev = useMemo(() => process.env.NODE_ENV !== "production", []);
  const showDebug = debug ?? isDev;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mq.matches;

    const update = () => {
      rafRef.current = null;

      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = clamp01(window.scrollY / max);

      el.style.setProperty("--depth", String(p));
      el.style.setProperty("--motion", reduced ? "0" : "1");

      // Shark görünürlüğü: 12% scroll’dan sonra belirsin, 35%’e kadar artsın
      const a1 = clamp01((p - 0.12) / 0.23);
      // Daha derinde ikinci bir pass (opsiyon)
      const a2 = clamp01((p - 0.45) / 0.25);

      el.style.setProperty("--shark1-a", a1.toFixed(3));
      el.style.setProperty("--shark2-a", a2.toFixed(3));

      if (showDebug) {
        el.style.setProperty("--debug-depth", `${Math.round(p * 100)}%`);
        el.style.setProperty("--debug-a1", a1.toFixed(2));
        el.style.setProperty("--debug-a2", a2.toFixed(2));
      }
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
  }, [showDebug]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.base} />
      <div className={styles.caustics} />
      <div className={styles.vignette} />
      <div className={styles.bubbles} />

      {/* Shark pass #1 (sağa doğru yüzsün) */}
      <div className={styles.swimRight} aria-hidden="true">
        <div className={styles.bob}>
          <img className={styles.shark} src={sharkSrc} alt="" draggable={false} />
        </div>
      </div>

      {/* Shark pass #2 (sola doğru yüzsün) */}
      <div className={styles.swimLeft} aria-hidden="true">
        <div className={styles.bob}>
          <img className={styles.shark2} src={sharkSrc} alt="" draggable={false} />
        </div>
      </div>

      {showDebug && (
        <div className={styles.debug}>
          <div>depth: <b>{/* css var */}</b></div>
          <div>a1: <b>{/* css var */}</b></div>
          <div>a2: <b>{/* css var */}</b></div>
        </div>
      )}
    </div>
  );
}
