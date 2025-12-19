"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { SharkSvg } from "./shark-svg";
import { cn } from "@/src/lib/cn";

type Pos = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const posCls: Record<Pos, string> = {
  "top-left": "left-0 top-0 -translate-x-3 -translate-y-3",
  "top-right": "right-0 top-0 translate-x-3 -translate-y-3",
  "bottom-left": "left-0 bottom-0 -translate-x-3 translate-y-3",
  "bottom-right": "right-0 bottom-0 translate-x-3 translate-y-3",
};

export function SharkPeek({
  position = "top-right",
  size = 96,
  auto = true,
  className,
}: {
  position?: Pos;
  size?: number;
  auto?: boolean;
  className?: string;
}) {
  const [show, setShow] = useState(false);
  const mounted = useRef(false);

  const dirScale = useMemo(() => {
    // sağdaysa sağa baksın, soldaysa aynalasın
    const isRight = position.includes("right");
    return isRight ? 1 : -1;
  }, [position]);

  useEffect(() => {
    mounted.current = true;
    if (!auto) return;

    const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));
    let t1: number | undefined;
    let t2: number | undefined;

    const loop = () => {
      t1 = window.setTimeout(() => {
        if (!mounted.current) return;
        setShow(true);
        t2 = window.setTimeout(() => setShow(false), rand(1200, 2200));
        loop();
      }, rand(5000, 12000));
    };

    loop();
    return () => {
      mounted.current = false;
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
    };
  }, [auto]);

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-10",
        posCls[position],
        className
      )}
      style={{ width: size, height: size }}
    >
      {/* sadece bir kısmı görünsün diye mask */}
      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        <div
          className={cn(
            "absolute bottom-0 right-0 transition duration-500 ease-[cubic-bezier(.2,.9,.2,1)]",
            show ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          )}
          style={{
            width: size + 40,
            height: size + 40,
            transform: `scaleX(${dirScale})`,
          }}
        >
          <SharkSvg className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
