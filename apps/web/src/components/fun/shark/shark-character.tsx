"use client";

import React, { useEffect, useState } from "react";
import { RiveShark } from "./rive-shark";
import { LottieShark } from "./lottie-shark";

type Mode = "rive" | "lottie" | "svg";

async function exists(url: string) {
  try {
    const r = await fetch(url, { cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}

function FallbackSvg({ className }: { className?: string }) {
  // Basit ama “görünür” fallback
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M10 36c6-14 18-22 34-22 10 0 17 3 21 8-5 1-9 5-11 10-3 9-12 16-25 17-12 1-19-4-19-13z"
        fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M8 35 3 38l5 3" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="28" cy="32" r="3.5" fill="hsl(var(--foreground))" />
      <path d="M24 42c7 5 18 5 26 0" stroke="hsl(var(--primary))" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function SharkCharacter({
  className,
  riveSrc = "/assets/mascots/shark/shark.riv",
  lottieSrc = "/assets/mascots/shark/shark.json",
  prefer = "rive",
  riveStateMachines,
  riveAnimations,
}: {
  className?: string;
  riveSrc?: string;
  lottieSrc?: string;
  prefer?: "rive" | "lottie";
  riveStateMachines?: string[];
  riveAnimations?: string[];
}) {
  const [mode, setMode] = useState<Mode>(prefer);

  useEffect(() => {
    let alive = true;

    (async () => {
      const riveOk = await exists(riveSrc);
      const lottieOk = await exists(lottieSrc);

      if (!alive) return;

      if (prefer === "rive") {
        if (riveOk) setMode("rive");
        else if (lottieOk) setMode("lottie");
        else setMode("svg");
      } else {
        if (lottieOk) setMode("lottie");
        else if (riveOk) setMode("rive");
        else setMode("svg");
      }
    })();

    return () => {
      alive = false;
    };
  }, [prefer, riveSrc, lottieSrc]);

  if (mode === "rive") {
    return (
      <RiveShark
        className={className}
        src={riveSrc}
        stateMachines={riveStateMachines}
        animations={riveAnimations}
      />
    );
  }

  if (mode === "lottie") {
    return (
      <LottieShark
        className={className}
        src={lottieSrc}
        onFail={() => setMode("svg")}
      />
    );
  }

  return <FallbackSvg className={className} />;
}
