"use client";

import React from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export function RiveShark({
  className,
  src = "/assets/mascots/shark/shark.riv",
  // state machine adını bilmiyorsan boş bırak (görüntüyü garanti eder)
  stateMachines,
  animations,
}: {
  className?: string;
  src?: string;
  stateMachines?: string[];
  animations?: string[];
}) {
  const { RiveComponent } = useRive({
    // typed config bazen katı; garanti olsun diye minimal
    src,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    stateMachines,
    animations,
  });

  return (
    <div className={className} style={{ width: "100%", height: "100%" }}>
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
