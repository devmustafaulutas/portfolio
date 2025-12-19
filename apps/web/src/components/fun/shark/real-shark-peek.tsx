"use client";

import React, { useEffect, useState } from "react";
import { RealShark } from "./real-shark";
import { cn } from "@/src/lib/cn";

type Pos = "top-left" | "top-right" | "bottom-left" | "bottom-right";
const posCls: Record<Pos, string> = {
  "top-left": "left-0 top-0 -translate-x-3 -translate-y-3",
  "top-right": "right-0 top-0 translate-x-3 -translate-y-3",
  "bottom-left": "left-0 bottom-0 -translate-x-3 translate-y-3",
  "bottom-right": "right-0 bottom-0 translate-x-3 translate-y-3",
};

export function RealSharkPeek({
  position = "top-right",
  size = 120,
  mood = "smile",
  auto = true,
  className,
}: {
  position?: Pos;
  size?: number;
  mood?: "neutral" | "smile" | "bite";
  auto?: boolean;
  className?: string;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!auto) return;

    const rand = (a: number, b: number) => Math.floor(a + Math.random() * (b - a));
    let t1: number | undefined;
    let t2: number | undefined;

    const loop = () => {
      t1 = window.setTimeout(() => {
        setShow(true);
        t2 = window.setTimeout(() => setShow(false), rand(1200, 2200));
        loop();
      }, rand(4200, 9800));
    };

    t2 = window.setTimeout(() => setShow(false), 1600);
    loop();

    return () => {
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, [auto]);

  return (
    <div
      className={cn("pointer-events-none absolute z-20", posCls[position], className)}
      style={{ width: size, height: size }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[28px]">
        <div
          className={cn(
            "absolute bottom-0 right-0 transition duration-500 ease-[cubic-bezier(.2,.9,.2,1)]",
            show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
        >
          <RealShark size={size + 70} mood={mood} />
        </div>
      </div>
    </div>
  );
}
