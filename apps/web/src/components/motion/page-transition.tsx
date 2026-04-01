"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const curtain = curtainRef.current;
    if (!curtain) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (firstRender.current) {
      firstRender.current = false;
      // Entrance fade-in from blank
      if (!reduced) {
        gsap.fromTo(
          curtain,
          { scaleY: 1, opacity: 1 },
          { scaleY: 0, opacity: 0, duration: 0.55, ease: "power3.inOut", transformOrigin: "top" }
        );
      }
      return;
    }

    if (!reduced) {
      // Route wipe: flash cover → then uncover
      gsap.fromTo(
        curtain,
        { scaleY: 0, opacity: 1, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 0.28,
          ease: "power3.in",
          onComplete: () => {
            gsap.fromTo(
              curtain,
              { scaleY: 1, transformOrigin: "top" },
              { scaleY: 0, duration: 0.38, ease: "power3.out" }
            );
          },
        }
      );
    }
  }, [pathname]);

  return (
    <>
      <div
        ref={curtainRef}
        className="route-wipe"
        aria-hidden="true"
        style={{ opacity: 1, transform: "scaleY(1)" }}
      />
      {children}
    </>
  );
}
