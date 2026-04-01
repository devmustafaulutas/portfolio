"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function SmoothCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Check touch device — skip
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Show cursor
    dot.style.opacity = "0";
    ring.style.opacity = "0";

    const xDot  = gsap.quickTo(dot,  "x", { duration: 0.12, ease: "power3.out" });
    const yDot  = gsap.quickTo(dot,  "y", { duration: 0.12, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

    let entered = false;

    const onMove = (e: MouseEvent) => {
      if (!entered) {
        entered = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.4 });
      }
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };

    // Context-aware cursor states
    const onEnterLink = (e: Event) => {
      const el = (e.currentTarget as HTMLElement);
      const cursorLabel = el.dataset.cursor ?? "";
      
      gsap.to(dot, { scale: 0.3, duration: 0.25, ease: "power2.out" });
      gsap.to(ring, { scale: 2.2, opacity: 0.6, duration: 0.35, ease: "power2.out" });
      
      if (cursorLabel) {
        label.textContent = cursorLabel;
        gsap.to(label, { opacity: 1, scale: 1, duration: 0.2 });
      }
    };

    const onLeaveLink = () => {
      gsap.to(dot,   { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });
      gsap.to(ring,  { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.15 });
    };

    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.12 });
    const onUp   = () => gsap.to(ring, { scale: 1, duration: 0.2, ease: "elastic.out(1, 0.4)" });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Attach to all interactive elements
    const interactives = document.querySelectorAll<HTMLElement>(
      "a, button, [role='button'], [data-cursor]"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    // Re-attach on DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>(
        "a:not([data-cursor-bound]), button:not([data-cursor-bound])"
      ).forEach((el) => {
        if (!el.dataset.cursorBound) {
          el.dataset.cursorBound = "1";
          el.addEventListener("mouseenter", onEnterLink);
          el.addEventListener("mouseleave", onLeaveLink);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9999] top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0 }}
      >
        <div className="h-[6px] w-[6px] rounded-full bg-[hsl(var(--foreground))]" />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9998] top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="h-10 w-10 rounded-full border border-[hsl(var(--foreground)/0.35)] flex items-center justify-center">
          <span
            ref={labelRef}
            className="text-[9px] font-semibold tracking-wider uppercase text-[hsl(var(--foreground))]"
            style={{ opacity: 0, transform: "scale(0.8)" }}
          />
        </div>
      </div>
    </>
  );
}