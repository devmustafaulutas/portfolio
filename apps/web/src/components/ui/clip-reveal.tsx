"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Direction = "up" | "down" | "left" | "right";

type Props = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  start?: string;
  className?: string;
  once?: boolean;
};

const clipFrom: Record<Direction, string> = {
  up:    "inset(100% 0% 0% 0%)",
  down:  "inset(0% 0% 100% 0%)",
  left:  "inset(0% 100% 0% 0%)",
  right: "inset(0% 0% 0% 100%)",
};

const clipTo = "inset(0% 0% 0% 0%)";

export function ClipReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 1.1,
  start = "top 85%",
  className = "",
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { clipPath: clipFrom[direction] });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once,
      onEnter: () => {
        gsap.to(el, {
          clipPath: clipTo,
          duration,
          delay,
          ease: "power4.inOut",
        });
      },
    });

    return () => st.kill();
  }, [direction, delay, duration, start, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}