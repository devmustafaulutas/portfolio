"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle, JSX } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ---- Types ---------------------------------------------------------

export type SplitTextHandle = {
  play: () => void;
  reverse: () => void;
};

type SplitMode = "chars" | "words" | "lines";

type Props = {
  children: string;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  mode?: SplitMode;
  /** Trigger on scroll or immediately */
  trigger?: "scroll" | "immediate";
  /** GSAP animation preset */
  animation?: "rise" | "slide" | "fade" | "scramble";
  delay?: number;
  stagger?: number;
  duration?: number;
  /** ScrollTrigger start offset */
  scrubStart?: string;
  id?: string;
};

// ---- Helpers -------------------------------------------------------

function splitIntoSpans(text: string, mode: SplitMode): string {
  if (mode === "chars") {
    return text
      .split("")
      .map((ch) =>
        ch === " "
          ? `<span class="char-space" aria-hidden="true">&nbsp;</span>`
          : `<span class="char" aria-hidden="true" style="display:inline-block;will-change:transform,opacity">${ch}</span>`
      )
      .join("");
  }
  if (mode === "words") {
    return text
      .split(" ")
      .map(
        (w, i, arr) =>
          `<span class="word" aria-hidden="true" style="display:inline-block;overflow:hidden;vertical-align:bottom"><span class="word-inner" style="display:inline-block;will-change:transform,opacity">${w}</span></span>${i < arr.length - 1 ? " " : ""}`
      )
      .join("");
  }
  // lines — wrap whole text in one block
  return `<span class="line" aria-hidden="true" style="display:block;overflow:hidden"><span class="line-inner" style="display:block;will-change:transform,opacity">${text}</span></span>`;
}

// ---- Component -----------------------------------------------------

export const SplitText = forwardRef<SplitTextHandle, Props>(
  function SplitText(
    {
      children,
      className = "",
      as: Tag = "p",
      mode = "words",
      trigger = "scroll",
      animation = "rise",
      delay = 0,
      stagger = 0.035,
      duration = 0.8,
      scrubStart = "top 82%",
      id,
    },
    ref
  ) {
    const containerRef = useRef<HTMLElement>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    useImperativeHandle(ref, () => ({
      play: () => tlRef.current?.play(),
      reverse: () => tlRef.current?.reverse(),
    }));

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Inject split HTML
      el.innerHTML = `<span aria-hidden="true">${splitIntoSpans(children, mode)}</span>`;
      // Screen-reader text
      el.insertAdjacentHTML(
        "beforeend",
        `<span class="sr-only">${children}</span>`
      );

      if (reduced) {
        // Show everything immediately
        el.querySelectorAll<HTMLElement>(".char,.word-inner,.line-inner").forEach((s) => {
          s.style.opacity = "1";
          s.style.transform = "none";
        });
        return;
      }

      const targets =
        mode === "chars"
          ? el.querySelectorAll<HTMLElement>(".char")
          : mode === "words"
          ? el.querySelectorAll<HTMLElement>(".word-inner")
          : el.querySelectorAll<HTMLElement>(".line-inner");

      // Animate in presets
      let fromVars: gsap.TweenVars = {};
      let toVars: gsap.TweenVars = {};

      if (animation === "rise") {
        fromVars = { y: "110%", opacity: 0 };
        toVars   = { y: "0%",   opacity: 1, ease: "power4.out", duration, stagger, delay };
      } else if (animation === "slide") {
        fromVars = { x: 40, opacity: 0 };
        toVars   = { x: 0,  opacity: 1, ease: "expo.out", duration, stagger, delay };
      } else if (animation === "fade") {
        fromVars = { opacity: 0, filter: "blur(8px)" };
        toVars   = { opacity: 1, filter: "blur(0px)", ease: "power3.out", duration, stagger, delay };
      } else if (animation === "scramble") {
        // Simple opacity stagger
        fromVars = { opacity: 0, y: 6, rotation: 5 };
        toVars   = { opacity: 1, y: 0, rotation: 0, ease: "back.out(2)", duration: duration * 0.7, stagger: stagger * 0.7, delay };
      }

      gsap.set(targets, fromVars);

      const tl = gsap.timeline({ paused: true, delay });
      tl.to(targets, toVars);
      tlRef.current = tl;

      if (trigger === "scroll") {
        ScrollTrigger.create({
          trigger: el,
          start: scrubStart,
          once: true,
          onEnter: () => tl.play(),
        });
      } else {
        tl.play();
      }

      return () => {
        tl.kill();
        ScrollTrigger.getAll()
          .filter((st) => st.vars.trigger === el)
          .forEach((st) => st.kill());
      };
    }, [children, mode, trigger, animation, delay, stagger, duration, scrubStart]);

    const TagComponent = Tag as React.ElementType;

    return (
      <TagComponent
        ref={containerRef}
        className={className}
        id={id}
      />
    );
  }
);