"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  opacity: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function OceanBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 1.5);
    let raf = 0;
    const particles: Particle[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Repopulate particles
      particles.length = 0;
      const count = Math.max(18, Math.min(48, Math.floor((w * h) / 28000)));
      for (let i = 0; i < count; i++) {
        particles.push(spawnParticle(w, h, true));
      }
    };

    function spawnParticle(W: number, H: number, random = false): Particle {
      return {
        x: rand(0, W),
        y: random ? rand(0, H) : H + 8,
        r: rand(1, 3.5),
        vx: rand(-0.2, 0.2),
        vy: rand(-0.3, -0.1),
        life: random ? rand(0, 1) : 0,
        opacity: rand(0.04, 0.15),
      };
    }

    let isDark = document.documentElement.classList.contains("dark");

    const getAccentColor = () =>
      isDark
        ? `rgba(14, 165, 233, ${0.055})`  // sky-500 in dark
        : `rgba(2, 132, 199, ${0.04})`;   // sky-600 in light

    const getParticleColor = (opacity: number) =>
      isDark
        ? `rgba(56, 189, 248, ${opacity})`   // sky-400
        : `rgba(14, 165, 233, ${opacity * 0.6})`;  // sky-500

    // Observe theme changes
    const mo = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    let scrollProgress = 0;
    let frameCount = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      frameCount++;

      // Read scroll progress from CSS var
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--scroll")
        .trim();
      scrollProgress = parseFloat(raw) || 0;

      ctx.clearRect(0, 0, w, h);

      // ── Atmospheric gradient mesh ───────────────────────────────
      // Top-right glow
      const gTop = ctx.createRadialGradient(w * 0.78, 0, 0, w * 0.78, 0, w * 0.55);
      gTop.addColorStop(0, getAccentColor());
      gTop.addColorStop(1, "transparent");
      ctx.fillStyle = gTop;
      ctx.fillRect(0, 0, w, h);

      // Bottom-left subtle warm glow
      const gBot = ctx.createRadialGradient(
        w * 0.12,
        h * 0.9,
        0,
        w * 0.12,
        h * 0.9,
        w * 0.45
      );
      const warmAlpha = isDark ? 0.025 : 0.018;
      gBot.addColorStop(0, `rgba(251, 146, 60, ${warmAlpha})`); // orange
      gBot.addColorStop(1, "transparent");
      ctx.fillStyle = gBot;
      ctx.fillRect(0, 0, w, h);

      // Depth gradient at bottom (increases with scroll)
      if (scrollProgress > 0.1) {
        const depthAlpha = scrollProgress * (isDark ? 0.12 : 0.05);
        const gDepth = ctx.createLinearGradient(0, h * 0.7, 0, h);
        gDepth.addColorStop(0, "transparent");
        gDepth.addColorStop(1, isDark
          ? `rgba(10, 20, 40, ${depthAlpha})`
          : `rgba(186, 230, 253, ${depthAlpha})`);
        ctx.fillStyle = gDepth;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Floating particles ──────────────────────────────────────
      // Throttle particle updates every 2 frames for perf
      if (frameCount % 2 === 0) {
        for (const p of particles) {
          p.x += p.vx;
          p.y += p.vy;
          p.life += 0.003;

          if (p.life >= 1 || p.y < -10) {
            Object.assign(p, spawnParticle(w, h));
          }
        }
      }

      for (const p of particles) {
        const lifeFade =
          p.life < 0.15
            ? p.life / 0.15
            : p.life > 0.85
            ? (1 - p.life) / 0.15
            : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = getParticleColor(p.opacity * lifeFade);
        ctx.fill();
      }
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
