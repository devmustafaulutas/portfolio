"use client";

import  { useEffect, useRef } from "react";
import styles from "./ocean-backdrop.module.css";

type Bubble = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  wob: number;
  life: number;
  seed: number;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function OceanBackdrop() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mq.matches;

    root.style.setProperty("--motion", reduced ? "0" : "1");

    const ctx = canvas.getContext("2d");
    if (!ctx || reduced) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const bubbles: Bubble[] = [];
    let raf = 0;
    let last = performance.now();

    const ocean = (window as any).__ocean;

    const resize = () => {
      w = Math.max(1, window.innerWidth);
      h = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density: ekran alanına göre
      bubbles.length = 0;
      const target = Math.round((w * h) / 32000);
      const count = Math.max(24, Math.min(78, target));

      for (let i = 0; i < count; i++) {
        bubbles.push(spawn(true));
      }
    };

    const spawn = (initial = false): Bubble => {
      const r = 2 + Math.random() * 8;
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 30 + Math.random() * 120,
        r,
        vy: 0.35 + Math.random() * 0.95,
        vx: (Math.random() - 0.5) * 0.25,
        wob: 0.7 + Math.random() * 1.8,
        life: 0.35 + Math.random() * 0.65,
        seed: Math.random() * 10,
      };
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      const dive = clamp01((window as any).__ocean?.dive ?? 0);
      const vel = clamp01((window as any).__ocean?.vel ?? 0);

      // temaya göre alpha (night: bioluminescent daha düşük ama belirgin)
      const isDark = document.documentElement.classList.contains("dark");
      const baseA = isDark ? 0.18 : 0.14;
      const aBoost = isDark ? 0.10 : 0.06;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        // derinleştikçe bubble daha “yavaş ve uzak”
        const depthSlow = 0.75 + dive * 0.35;

        b.y -= b.vy * depthSlow * (1 + vel * 0.9) * dt * 60;
        b.x += (b.vx + Math.sin((now / 1000) * b.wob + b.seed) * 0.10) * dt * 60;

        if (b.y < -60 || b.x < -80 || b.x > w + 80) {
          bubbles[i] = spawn(false);
          continue;
        }

        const alpha = (baseA + aBoost * (1 - dive)) * b.life;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.2);
        g.addColorStop(0, `rgba(255,255,255,${alpha})`);
        g.addColorStop(0.45, `rgba(255,255,255,${alpha * 0.55})`);
        g.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div className={styles.ocean} />
      <div className={styles.rays} />
      <div className={styles.caustics} />
      <div className={styles.spotlight} />
      <canvas ref={canvasRef} className={styles.bubbleCanvas} />
      <div className={styles.grain} />
      <div className={styles.vignette} />
    </div>
  );
}
