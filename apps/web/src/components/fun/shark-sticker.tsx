import React from "react";
import { cn } from "@/src/lib/cn";

type Pos = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type Mood = "smile" | "bite";

const posMap: Record<Pos, string> = {
  "top-left": "left-[-14px] top-[-14px] rotate-[-6deg]",
  "top-right": "right-[-14px] top-[-14px] rotate-[6deg]",
  "bottom-left": "left-[-14px] bottom-[-14px] rotate-[6deg]",
  "bottom-right": "right-[-14px] bottom-[-14px] rotate-[-6deg]",
};

export function SharkSticker({
  position = "top-right",
  size = 64,
  mood = "smile",
  className,
}: {
  position?: Pos;
  size?: number;
  mood?: Mood;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-10 opacity-90",
        posMap[position],
        "transition duration-300",
        // parent .group hover ile kıpırdasın
        "group-hover:rotate-0 group-hover:scale-[1.03] group-hover:opacity-100",
        className
      )}
      style={{ width: size, height: size }}
    >
      <div className="animate-[shark_bob_1.8s_ease-in-out_infinite]">
        <svg viewBox="0 0 96 96" className="h-full w-full drop-shadow-[0_12px_20px_rgba(0,0,0,0.22)]">
          {/* fin */}
          <path
            d="M62 18c10 4 16 10 18 18-9-1-16-4-22-10"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* head/body */}
          <path
            d="M18 54c7-22 26-34 48-34 12 0 22 3 30 9-5 3-9 8-11 14-4 14-18 26-38 28-17 2-27-5-29-17z"
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* tail nub */}
          <path
            d="M16 52 6 58l10 6"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="2.2"
            strokeLinejoin="round"
          />

          {/* eye */}
          <circle cx="40" cy="46" r="5" fill="hsl(var(--foreground))" />
          <circle cx="41.7" cy="44.5" r="1.6" fill="white" />

          {/* mouth */}
          {mood === "smile" ? (
            <path
              d="M34 62c10 7 26 7 38 1"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : (
            <>
              <path
                d="M32 62c10 7 28 7 40 0"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* tiny teeth */}
              <path
                d="M44 63l2 6 2-6 2 6 2-6"
                stroke="hsl(var(--foreground))"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.65"
              />
            </>
          )}

          {/* cheek */}
          <circle cx="33" cy="55" r="2.4" fill="hsl(var(--primary) / 0.28)" />
        </svg>
      </div>
    </div>
  );
}
