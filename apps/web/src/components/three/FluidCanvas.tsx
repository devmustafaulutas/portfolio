"use client";

import dynamic from "next/dynamic";

/**
 * The WebGL scene ships as a separate client chunk and never renders
 * on the server: the canvas is a fixed, pointer-transparent backdrop,
 * so its late arrival can never shift layout (zero CLS by design).
 */
const FluidScene = dynamic(() => import("./FluidScene"), {
  ssr: false,
});

export function FluidCanvas() {
  return (
    <div className="experience-canvas" aria-hidden="true">
      <FluidScene />
    </div>
  );
}
