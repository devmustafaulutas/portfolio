"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

type Props = {
  items: string[];
  speed?: number; // px per second, default 80
  direction?: "left" | "right";
  separator?: React.ReactNode;
  className?: string;
  itemClassName?: string;
};

export function Marquee({
  items,
  speed = 80,
  direction = "left",
  separator,
  className = "",
  itemClassName = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced  = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) return;

    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2; // duplicated inside
    const dir = direction === "left" ? -totalWidth : totalWidth;

    gsap.set(track, { x: direction === "left" ? 0 : dir });

    const tween = gsap.to(track, {
      x: dir,
      duration: totalWidth / speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    // Slow on hover
    const onEnter = () => gsap.to(tween, { timeScale: 0.25, duration: 0.5 });
    const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.8 });

    track.parentElement?.addEventListener("mouseenter", onEnter);
    track.parentElement?.addEventListener("mouseleave", onLeave);

    return () => {
      tween.kill();
      track.parentElement?.removeEventListener("mouseenter", onEnter);
      track.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, [direction, speed]);

  // Duplicate items for seamless loop
  const allItems = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform"
        style={{ width: "max-content" }}
      >
        {allItems.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className={`px-6 ${itemClassName}`}>{item}</span>
            {separator ?? (
              <span className="text-[hsl(var(--foreground-3)/0.4)] select-none">·</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}