"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { scrollBus } from "@/lib/scroll-bus";

/**
 * The Technical Print. A domain-warped fBm field drives a live
 * halftone screen: the fluid isn't rendered as smoke but as a grid
 * of ink dots whose radius follows the field's luminance — a moving
 * newspaper print. It leans toward the pointer, churns gently with
 * scroll, and the ink "settles" (fades to pure black) as the reader
 * descends into the document.
 */

const PRINT_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const PRINT_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uPointer;
  uniform float uAspect;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.02 + vec2(11.3, 7.9);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.2;

    // Pointer bends the field toward the reader's hand
    vec2 pointer = uPointer * vec2(uAspect, -1.0) * 1.1;
    vec2 toPointer = p - pointer;
    float pointerWell = exp(-dot(toPointer, toPointer) * 1.7);

    float drift = uTime * 0.04;

    vec2 q = vec2(
      fbm(p + vec2(drift, -drift * 0.6)),
      fbm(p + vec2(5.2, 1.3) - drift)
    );

    vec2 r = vec2(
      fbm(p + 1.7 * q + vec2(1.7, 9.2) + uScroll * 0.8),
      fbm(p + 1.7 * q + vec2(8.3, 2.8) - uScroll * 0.5)
    );

    float field = fbm(p + 1.9 * r + toPointer * pointerWell * 0.6);

    // Luminance of the source image the halftone screen will print
    float body = pow(field, 2.1);
    float veins = smoothstep(0.44, 0.54, field) - smoothstep(0.54, 0.8, field);
    float luminance = body * 0.55 + veins * 0.5 + pointerWell * 0.12;

    // Edge falloff, then the ink settles as the reader descends
    vec2 edge = abs(vUv - 0.5) * 2.0;
    luminance *= 1.0 - smoothstep(0.5, 1.08, max(edge.x, edge.y));
    luminance *= 1.0 - uScroll * 0.85;

    // Halftone screen: rotated dot grid, radius follows luminance
    float angle = 0.26;
    mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    vec2 screenCell = fract(rot * p * 34.0) - 0.5;
    float cellDist = length(screenCell);
    float dotRadius = clamp(luminance, 0.0, 1.0) * 0.42;
    float ink = smoothstep(dotRadius, dotRadius - 0.09, cellDist);

    // Dots print at a restrained grey so type always wins
    vec3 color = vec3(ink * 0.34 * step(0.015, luminance));
    gl_FragColor = vec4(color, 1.0);
  }
`;

function PrintPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uniforms.uTime.value += delta;
    material.uniforms.uAspect.value =
      state.viewport.width / state.viewport.height;
    material.uniforms.uScroll.value = THREE.MathUtils.damp(
      material.uniforms.uScroll.value,
      scrollBus.progress,
      2.5,
      delta,
    );

    const pointer = material.uniforms.uPointer.value as THREE.Vector2;
    pointer.x = THREE.MathUtils.damp(pointer.x, scrollBus.pointerX, 2.2, delta);
    pointer.y = THREE.MathUtils.damp(pointer.y, scrollBus.pointerY, 2.2, delta);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={PRINT_VERTEX}
        fragmentShader={PRINT_FRAGMENT}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

export default function FluidScene() {
  // Capability is probed after mount: renders stay pure and browsers
  // without WebGL simply keep the pure-black CSS backdrop.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (supportsWebGL()) {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 1], fov: 50 }}
    >
      <AdaptiveDpr />
      <PrintPlane />
    </Canvas>
  );
}
