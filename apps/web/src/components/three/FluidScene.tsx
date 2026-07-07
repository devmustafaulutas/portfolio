"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { scrollBus } from "@/lib/scroll-bus";

/**
 * Monochrome liquid + space warp.
 *
 * Layer 1 — a fullscreen quad running domain-warped fBm: the pattern
 * breathes on its own, bends toward the pointer and slowly churns as
 * the page scrolls. Luminance is capped low so white typography
 * always wins the contrast fight.
 *
 * Layer 2 — the warp field: white particles drifting toward the
 * camera. During the Z-axis tunnel flight (`scrollBus.warp`) and on
 * hard scroll velocity they accelerate into a starfield rush, selling
 * the "flying into the site" illusion.
 */

const FLUID_VERTEX = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FLUID_FRAGMENT = /* glsl */ `
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
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 2.4;

    // Pointer digs a slow whirl into the field
    vec2 pointer = uPointer * vec2(uAspect, -1.0) * 1.2;
    vec2 toPointer = p - pointer;
    float pointerWell = exp(-dot(toPointer, toPointer) * 1.6);

    float drift = uTime * 0.045;
    float churn = uScroll * 2.2;

    vec2 q = vec2(
      fbm(p + vec2(drift, -drift * 0.6)),
      fbm(p + vec2(5.2, 1.3) - drift)
    );

    vec2 r = vec2(
      fbm(p + 1.7 * q + vec2(1.7, 9.2) + churn * 0.35),
      fbm(p + 1.7 * q + vec2(8.3, 2.8) - churn * 0.2)
    );

    float field = fbm(p + 1.9 * r + toPointer * pointerWell * 0.7);

    // Carve ridges: thin bright veins over deep black
    float veins = smoothstep(0.42, 0.52, field) - smoothstep(0.52, 0.78, field);
    float body = pow(field, 2.4);

    float luminance = body * 0.16 + veins * 0.22 + pointerWell * 0.05;

    // Corner falloff keeps edges pitch black
    vec2 edge = abs(vUv - 0.5) * 2.0;
    float vignette = 1.0 - smoothstep(0.55, 1.05, max(edge.x, edge.y));
    luminance *= vignette;

    vec3 color = vec3(luminance);
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Deterministic PRNG (mulberry32): keeps particle generation pure for
 * React renders — same seed, same field, no hydration surprises.
 */
function createRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIELD_NEAR_Z = 5.6;
const FIELD_DEPTH = 46;

function WarpField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const { positions, speeds } = useMemo(() => {
    const random = createRandom(0x3a7f + count);
    const positionArray = new Float32Array(count * 3);
    const speedArray = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 0.7 + random() * 8.5;
      positionArray[i * 3] = Math.cos(angle) * radius;
      positionArray[i * 3 + 1] = Math.sin(angle) * radius * 0.62;
      positionArray[i * 3 + 2] = FIELD_NEAR_Z - random() * FIELD_DEPTH;
      speedArray[i] = 0.6 + random() * 1.4;
    }
    return { positions: positionArray, speeds: speedArray };
  }, [count]);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    const material = materialRef.current;
    if (!points || !material) return;

    const dt = Math.min(delta, 0.05);
    const velocityBoost = Math.min(Math.abs(scrollBus.velocity) * 0.02, 8);
    const drive = 1.6 + scrollBus.warp * 48 + velocityBoost;

    const attribute = points.geometry.getAttribute(
      "position",
    ) as THREE.BufferAttribute;
    const array = attribute.array as Float32Array;

    for (let i = 0; i < count; i += 1) {
      let z = array[i * 3 + 2] + dt * drive * speeds[i];
      if (z > FIELD_NEAR_Z) {
        z -= FIELD_DEPTH;
      }
      array[i * 3 + 2] = z;
    }
    attribute.needsUpdate = true;

    material.size = 0.05 + scrollBus.warp * 0.13;
    material.opacity = 0.45 + scrollBus.warp * 0.45;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#ffffff"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FluidPlane() {
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
        vertexShader={FLUID_VERTEX}
        fragmentShader={FLUID_FRAGMENT}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

function PointerRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      scrollBus.pointerX * 0.06,
      2.2,
      delta,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      scrollBus.pointerY * 0.04,
      2.2,
      delta,
    );
  });

  return <group ref={groupRef}>{children}</group>;
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
  const [particleCount, setParticleCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supportsWebGL()) return;
    setParticleCount(window.innerWidth < 768 ? 1100 : 2300);
  }, []);

  if (particleCount === null) {
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
      camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 80 }}
    >
      <AdaptiveDpr />
      <FluidPlane />
      <PointerRig>
        <WarpField count={particleCount} />
      </PointerRig>
    </Canvas>
  );
}
