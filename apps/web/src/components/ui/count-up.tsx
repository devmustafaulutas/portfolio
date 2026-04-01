"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  to: number;
  from?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
};

export function CountUp({
  to,
  from = 0,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2.5,
  className = "",
}: Props) {
  const ref   = useRef<HTMLSpanElement>(null);
  const obj   = useRef({ n: from });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.textContent = `${prefix}${from.toFixed(decimals)}${suffix}`;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
      return;
    }

    const tween = gsap.to(obj.current, {
      n: to,
      duration,
      ease: "power3.out",
      paused: true,
      onUpdate: () => {
        el.textContent = `${prefix}${obj.current.n.toFixed(decimals)}${suffix}`;
      },
    });

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => tween.play(),
    });

    return () => { tween.kill(); st.kill(); };
  }, [to, from, decimals, prefix, suffix, duration]);

  return <span ref={ref} className={className} aria-label={`${prefix}${to}${suffix}`} />;
}