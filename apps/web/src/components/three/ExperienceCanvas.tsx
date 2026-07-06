"use client";

import dynamic from "next/dynamic";

/**
 * The WebGL scene ships as a separate client chunk and never renders
 * on the server: the canvas is a fixed, pointer-transparent backdrop,
 * so its late arrival can never shift layout (zero CLS by design).
 */
const DataStreamScene = dynamic(() => import("./DataStreamScene"), {
  ssr: false,
});

export function ExperienceCanvas() {
  return (
    <div className="experience-canvas" aria-hidden="true">
      <DataStreamScene />
    </div>
  );
}
