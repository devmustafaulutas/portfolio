"use client";

import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function LottieShark({
  className,
  src = "/assets/mascots/shark/shark.json",
  loop = true,
  onFail,
}: {
  className?: string;
  src?: string;
  loop?: boolean;
  onFail?: () => void;
}) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    let alive = true;

    fetch(src, { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`Lottie not found: ${src}`);
        return r.json();
      })
      .then((j) => alive && setData(j))
      .catch(() => {
        if (!alive) return;
        setData(null);
        onFail?.();
      });

    return () => {
      alive = false;
    };
  }, [src, onFail]);

  if (!data) return null;

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <Lottie animationData={data} loop={loop} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
