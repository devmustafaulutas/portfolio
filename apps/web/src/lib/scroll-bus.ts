/**
 * Frame-synchronised bridge between the DOM world (Lenis + GSAP
 * ScrollTrigger) and the WebGL world (React Three Fiber).
 *
 * A mutable singleton is intentional: the R3F scene reads these
 * values inside `useFrame` on every tick, and writing plain numbers
 * avoids triggering a single React render during scroll.
 */
export type ScrollBus = {
  /** Overall page progress, 0 at top → 1 at bottom. */
  progress: number;
  /** Lenis scroll velocity (px/frame, signed). */
  velocity: number;
  /** Normalised pointer position, -1..1 (0,0 = viewport centre). */
  pointerX: number;
  pointerY: number;
};

export const scrollBus: ScrollBus = {
  progress: 0,
  velocity: 0,
  pointerX: 0,
  pointerY: 0,
};
