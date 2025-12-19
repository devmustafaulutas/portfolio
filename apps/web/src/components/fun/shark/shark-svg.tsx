import React from "react";
import { cn } from "@/src/lib/cn";

export function SharkSvg({
  className,
  bodyId = "shark-body",
  tailId = "shark-tail",
  eyeId = "shark-eye",
  mouthId = "shark-mouth",
}: {
  className?: string;
  bodyId?: string;
  tailId?: string;
  eyeId?: string;
  mouthId?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 140"
      className={cn("h-full w-full", className)}
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="sharkSkin" x1="40" y1="30" x2="180" y2="130">
          <stop offset="0" stopColor="hsl(var(--card))" />
          <stop offset="1" stopColor="hsl(var(--muted))" />
        </linearGradient>
        <linearGradient id="sharkBelly" x1="70" y1="70" x2="170" y2="140">
          <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.55)" />
        </linearGradient>
      </defs>

      {/* tail (ayrı katman) */}
      <g id={tailId} style={{ transformOrigin: "58px 84px" }}>
        <path
          d="M58 84c-22 6-36 18-44 30 18 4 34 2 48-8 7 10 16 16 29 18-4-18-2-31 8-40-13 1-26 0-41 0z"
          fill="url(#sharkSkin)"
          stroke="hsl(var(--border))"
          strokeWidth="3"
          strokeLinejoin="round"
        />
      </g>

      {/* body */}
      <g id={bodyId}>
        <path
          d="M70 88c18-40 54-60 95-60 30 0 52 9 67 24-16 3-28 12-34 27-10 26-38 46-79 50-33 3-55-9-59-41z"
          fill="url(#sharkSkin)"
          stroke="hsl(var(--border))"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* dorsal fin */}
        <path
          d="M150 34c16 6 26 16 30 30-16-2-28-7-38-18"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* belly */}
        <path
          d="M104 98c18 12 44 14 68 4-10 16-32 28-58 30-22 2-35-7-10-34z"
          fill="url(#sharkBelly)"
          opacity="0.9"
        />

        {/* cheek blush */}
        <circle cx="114" cy="88" r="7" fill="hsl(var(--primary) / 0.22)" />
      </g>

      {/* eye */}
      <g id={eyeId} style={{ transformOrigin: "132px 76px" }}>
        <circle cx="132" cy="76" r="10" fill="hsl(var(--foreground))" />
        <circle cx="136" cy="72" r="3.5" fill="white" opacity="0.95" />
      </g>

      {/* mouth */}
      <g id={mouthId} style={{ transformOrigin: "150px 96px" }}>
        <path
          d="M122 98c18 16 54 14 74 2"
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* tiny teeth */}
        <path
          d="M154 104l3 10 3-10 3 10 3-10"
          stroke="hsl(var(--foreground))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}
