import React from "react";
import styles from "./real-shark.module.css";
import { cn } from "@/src/lib/cn";

type Mood = "neutral" | "smile" | "bite";

export function RealShark({
  className,
  size = 140,
  mood = "smile",
}: {
  className?: string;
  size?: number;
  mood?: Mood;
}) {
  return (
    <svg
      viewBox="0 0 220 120"
      width={size}
      height={size}
      className={cn(styles.float, className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="body" x1="0" x2="1">
          <stop offset="0" stopColor="hsl(var(--muted-foreground) / 0.35)" />
          <stop offset="0.35" stopColor="hsl(var(--foreground) / 0.20)" />
          <stop offset="1" stopColor="hsl(var(--foreground) / 0.12)" />
        </linearGradient>
        <linearGradient id="belly" x1="0" x2="1">
          <stop offset="0" stopColor="hsl(var(--card))" stopOpacity="0.92" />
          <stop offset="1" stopColor="hsl(var(--card))" stopOpacity="0.68" />
        </linearGradient>
      </defs>

      {/* Tail (separate group for animation) */}
      <g className={styles.tail}>
        <path
          d="M22 60c-14 7-18 18-20 28 14 2 23 0 30-7 5 9 13 14 26 15-5-17-3-27 8-36-10 0-20-1-44 0z"
          fill="url(#body)"
          stroke="hsl(var(--border))"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path
          d="M42 73c-9 5-12 10-13 16 9 1 15-1 20-6 3 6 8 10 16 11-3-10-2-16 5-22-6 0-12 0-28 1z"
          fill="hsl(var(--foreground) / 0.10)"
        />
      </g>

      {/* Body */}
      <path
        d="M50 64c10-26 36-42 82-42 30 0 54 10 74 28-18 2-30 13-35 29-10 30-38 46-82 46-41 0-55-20-39-61z"
        fill="url(#body)"
        stroke="hsl(var(--border))"
        strokeWidth="2.8"
        strokeLinejoin="round"
      />

      {/* Dorsal fin */}
      <g className={styles.fin}>
        <path
          d="M130 18c18 7 28 20 31 39-16-4-26-12-39-26"
          fill="hsl(var(--foreground) / 0.14)"
          stroke="hsl(var(--border))"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      </g>

      {/* Pectoral fin */}
      <path
        d="M142 78c-10 4-18 12-19 23 12-4 21-11 29-22"
        fill="hsl(var(--foreground) / 0.10)"
        stroke="hsl(var(--border))"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Belly */}
      <path
        d="M78 74c12 22 44 30 80 16-14 20-38 32-72 32-24 0-28-18-8-48z"
        fill="url(#belly)"
      />

      {/* Gills */}
      <path d="M156 58c-6 2-10 6-12 11" stroke="hsl(var(--foreground) / 0.25)" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M162 60c-6 2-10 6-12 11" stroke="hsl(var(--foreground) / 0.20)" strokeWidth="2.0" strokeLinecap="round" />
      <path d="M168 62c-6 2-10 6-12 11" stroke="hsl(var(--foreground) / 0.16)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Eye */}
      <circle cx="182" cy="44" r="6.2" fill="hsl(var(--foreground))" opacity="0.92" />
      <circle cx="184" cy="42" r="2.1" fill="#fff" opacity="0.9" />

      {/* Mouth */}
      {mood === "bite" ? (
        <>
          <path
            d="M170 62c10 10 28 9 38 0"
            stroke="hsl(var(--primary))"
            strokeWidth="3.6"
            strokeLinecap="round"
          />
          {/* teeth */}
          <path
            d="M188 68l3 8 3-8 3 8 3-8 3 8 3-8"
            stroke="hsl(var(--foreground) / 0.55)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : mood === "neutral" ? (
        <path
          d="M172 64c10 6 26 6 36 0"
          stroke="hsl(var(--foreground) / 0.35)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M172 64c10 7 26 7 36 0"
          stroke="hsl(var(--primary))"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
