"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsap, gsap } from "@/lib/gsap";
import { scrollBus } from "@/lib/scroll-bus";
import { cn } from "@/lib/cn";

type ZAxisTunnelLayoutProps = {
  /** The layer the camera flies THROUGH (scales up past the lens). */
  front: ReactNode;
  /** The layer that arrives FROM the depths of the Z axis. */
  back: ReactNode;
  /** Scroll distance of the flight, as % of viewport (default 260). */
  length?: number;
  id?: string;
  className?: string;
};

/**
 * The Infinity Z-Zoom. The stage pins; scrolling becomes dolly-in:
 * the front layer blows up ~18× and slides past the camera while the
 * back layer rises from a distant vanishing point and settles at
 * scale 1. `scrub: 1` makes the flight perfectly reversible — scroll
 * up and the tunnel plays backwards frame-for-frame.
 *
 * Tunnel progress is broadcast on `scrollBus.warp` (sine-shaped, so
 * it peaks mid-flight) for the WebGL warp field to synchronise.
 *
 * Reduced motion: no pin, no zoom — the back layer simply flows
 * after the front in the document (see globals.css).
 */
export function ZAxisTunnelLayout({
  front,
  back,
  length = 260,
  id,
  className,
}: ZAxisTunnelLayoutProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsap();
      const stage = stageRef.current;
      const frontLayer = frontRef.current;
      const backLayer = backRef.current;
      if (!stage || !frontLayer || !backLayer) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: `+=${length}%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              scrollBus.warp = Math.sin(self.progress * Math.PI);
            },
            onLeave: () => {
              scrollBus.warp = 0;
            },
            onLeaveBack: () => {
              scrollBus.warp = 0;
            },
          },
        });

        timeline
          // Dolly through the type: huge, then past the lens
          .fromTo(
            frontLayer,
            { scale: 1, transformOrigin: "50% 42%" },
            { scale: 18, duration: 0.58, ease: "power2.in" },
            0,
          )
          .fromTo(
            frontLayer,
            { autoAlpha: 1 },
            { autoAlpha: 0, duration: 0.16, ease: "none" },
            0.36,
          )
          // The next act surfaces from the vanishing point
          .fromTo(
            backLayer,
            { scale: 0.08, autoAlpha: 0, transformOrigin: "50% 50%" },
            {
              scale: 1,
              autoAlpha: 1,
              duration: 0.58,
              ease: "power1.out",
            },
            0.32,
          )
          // Landing hold: a beat of stillness before the unpin
          .to({}, { duration: 0.1 }, 0.9);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id={id} className={cn("relative", className)}>
      <div ref={stageRef} className="tunnel-stage">
        <div ref={frontRef} className="tunnel-layer tunnel-layer-front">
          {front}
        </div>
        <div ref={backRef} className="tunnel-layer tunnel-layer-back">
          {back}
        </div>
      </div>
    </section>
  );
}
