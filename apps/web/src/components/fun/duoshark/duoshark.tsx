import React from "react";
import styles from "./duoshark.module.css";

export function DuoShark({
  className,
  mood = "smile",
}: {
  className?: string;
  mood?: "smile" | "bite";
}) {
  return (
    <div className={`${styles.wrap} ${className ?? ""}`} aria-hidden>
      <svg viewBox="0 0 96 96" className={styles.float}>
        {/* shadow */}
        <ellipse cx="52" cy="86" rx="22" ry="5" fill="hsl(var(--border) / 0.35)" />

        {/* tail */}
        <g className={styles.tail}>
          <path
            d="M16 52c-9 3-13 9-15 15 8 2 14 1 18-3 3 5 7 8 13 9-3-9-2-15 3-20-6 0-11 0-19-1z"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>

        {/* body */}
        <g className={styles.bobble}>
          <path
            d="M26 52c8-18 24-28 46-28 15 0 26 5 34 13-9 2-16 9-18 18-5 15-19 24-38 26-18 2-31-6-24-29z"
            fill="hsl(var(--card))"
            stroke="hsl(var(--border))"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* dorsal fin */}
          <path
            d="M60 20c9 3 15 9 17 18-9-1-15-4-21-11"
            fill="hsl(var(--muted))"
            stroke="hsl(var(--border))"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* belly */}
          <path
            d="M42 60c10 9 26 10 40 3-7 12-20 19-36 21-11 1-17-6-4-24z"
            fill="hsl(var(--muted) / 0.7)"
          />

          {/* eyes */}
          <circle cx="40" cy="40" r="6" fill="hsl(var(--foreground))" opacity="0.95" />
          <circle cx="42" cy="38" r="2" fill="white" opacity="0.9" />

          <g className={styles.blink}>
            <circle cx="54" cy="38" r="6.5" fill="hsl(var(--foreground))" />
            <circle cx="56.5" cy="36" r="2.2" fill="white" opacity="0.9" />
          </g>

          {/* cheek */}
          <circle cx="34" cy="54" r="4" fill="hsl(var(--primary) / 0.18)" />

          {/* mouth */}
          {mood === "bite" ? (
            <>
              <path
                d="M40 56c8 8 22 7 30 1"
                stroke="hsl(var(--primary))"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M56 63l2 6 2-6 2 6 2-6"
                stroke="hsl(var(--foreground))"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
              />
            </>
          ) : (
            <path
              d="M38 56c8 6 22 6 30 0"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
