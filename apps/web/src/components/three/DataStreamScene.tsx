"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Float, Icosahedron } from "@react-three/drei";
import { scrollBus } from "@/lib/scroll-bus";

/**
 * "Liquid energy" data stream:
 *  - Shape A (page top): a horizontal particle river, calm and wide.
 *  - Shape B (deeper):   a tightening vortex helix — evolution.
 * The morph between the two is driven by page scroll, the flow speed
 * and colour temperature by the narrative intensity (Envanty apex),
 * and the whole rig leans toward the pointer.
 */

const STREAM_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uIntensity;
  uniform float uPixelRatio;

  attribute float aSeed;

  varying float vAlpha;
  varying float vHot;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  void main() {
    float t = position.x;
    float theta = position.y;
    float radial = position.z;

    float speed = mix(0.4, 1.0, aSeed);
    float flow = fract(t + uTime * 0.022 * speed * (1.0 + uIntensity * 2.4));

    // Shape A — data river drifting across the viewport
    float xA = mix(-15.0, 15.0, flow);
    float wave = sin(flow * 9.42478 + uTime * 0.35 + theta);
    vec3 posA = vec3(
      xA,
      wave * 1.5 + sin(theta) * radial * 1.6 - 0.4,
      cos(theta) * radial * 2.4 - 2.5
    );

    // Shape B — vortex helix, radius tightening as particles sink
    float angle = theta + flow * 12.56636 + uTime * 0.22;
    float radius = mix(5.2, 0.7, flow) + radial * 0.7 - uIntensity * 0.6;
    vec3 posB = vec3(
      cos(angle) * radius,
      mix(4.6, -4.6, flow),
      sin(angle) * radius - 2.0
    );

    vec3 pos = mix(posA, posB, uMorph);

    // Cheap turbulence — keeps the stream organic in both shapes
    pos.x += sin(uTime * 0.6 + aSeed * 97.0 + pos.y * 0.6) * 0.2;
    pos.y += cos(uTime * 0.5 + aSeed * 61.0 + pos.x * 0.4) * 0.2;
    pos.z += sin(uTime * 0.4 + aSeed * 43.0) * 0.25;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float size = mix(1.1, 3.2, hash(aSeed * 7.31)) * (1.0 + uIntensity * 1.5);
    gl_PointSize = size * uPixelRatio * (11.0 / -mvPosition.z);

    vAlpha = smoothstep(26.0, 6.0, -mvPosition.z) * mix(0.28, 1.0, aSeed);
    vHot = step(0.85, aSeed);
  }
`;

const STREAM_FRAGMENT = /* glsl */ `
  precision highp float;

  uniform float uIntensity;

  varying float vAlpha;
  varying float vHot;

  void main() {
    vec2 centered = gl_PointCoord - 0.5;
    float dist = length(centered);
    float disc = smoothstep(0.5, 0.06, dist);

    vec3 deepTeal = vec3(0.04, 0.42, 0.58);
    vec3 pulse = vec3(0.22, 0.88, 1.0);
    vec3 ember = vec3(1.0, 0.29, 0.15);

    vec3 color = mix(deepTeal, pulse, vHot * 0.85 + uIntensity * 0.35);
    color = mix(color, ember, clamp(uIntensity * vHot, 0.0, 0.8));

    gl_FragColor = vec4(color, disc * vAlpha * (0.75 + uIntensity * 0.25));
  }
`;

/**
 * Deterministic PRNG (mulberry32): keeps particle generation pure for
 * React renders — same seed, same stream, no hydration surprises.
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

function DataStream({ count }: { count: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, seeds } = useMemo(() => {
    const random = createRandom(0x5eed + count);
    const positionArray = new Float32Array(count * 3);
    const seedArray = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positionArray[i * 3] = random();
      positionArray[i * 3 + 1] = random() * Math.PI * 2;
      positionArray[i * 3 + 2] = random();
      seedArray[i] = random();
    }
    return { positions: positionArray, seeds: seedArray };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uIntensity: { value: 0 },
      uPixelRatio: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    const morphTarget = THREE.MathUtils.smoothstep(
      scrollBus.progress,
      0.12,
      0.62,
    );

    material.uniforms.uTime.value += delta;
    material.uniforms.uMorph.value = THREE.MathUtils.damp(
      material.uniforms.uMorph.value,
      morphTarget,
      3,
      delta,
    );
    material.uniforms.uIntensity.value = THREE.MathUtils.damp(
      material.uniforms.uIntensity.value,
      scrollBus.intensity,
      2.5,
      delta,
    );
    material.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={STREAM_VERTEX}
        fragmentShader={STREAM_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function EnergyCore() {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const material = materialRef.current;
    const mesh = meshRef.current;
    if (!material || !mesh) return;

    material.opacity = THREE.MathUtils.damp(
      material.opacity,
      0.04 + scrollBus.intensity * 0.34,
      3,
      delta,
    );
    const scale = THREE.MathUtils.damp(
      mesh.scale.x,
      1 + scrollBus.intensity * 0.9,
      3,
      delta,
    );
    mesh.scale.setScalar(scale);
    mesh.rotation.y += delta * (0.08 + scrollBus.intensity * 0.5);
    mesh.rotation.x += delta * 0.04;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <Icosahedron ref={meshRef} args={[2.3, 1]} position={[0, 0, -3.5]}>
        <meshBasicMaterial
          ref={materialRef}
          color="#38e1ff"
          wireframe
          transparent
          opacity={0.04}
        />
      </Icosahedron>
    </Float>
  );
}

function PointerRig({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;
    group.rotation.y = THREE.MathUtils.damp(
      group.rotation.y,
      scrollBus.pointerX * 0.14,
      2.2,
      delta,
    );
    group.rotation.x = THREE.MathUtils.damp(
      group.rotation.x,
      scrollBus.pointerY * 0.1,
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

export default function DataStreamScene() {
  // Device capability is probed after mount: renders are kept pure and
  // unsupported browsers simply keep the CSS gradient backdrop.
  const [particleCount, setParticleCount] = useState<number | null>(null);

  useEffect(() => {
    if (!supportsWebGL()) return;
    setParticleCount(window.innerWidth < 768 ? 3800 : 8500);
  }, []);

  if (particleCount === null) {
    return null;
  }

  return (
    <Canvas
      dpr={[1, 1.8]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{ position: [0, 0, 9], fov: 52, near: 0.1, far: 60 }}
    >
      <AdaptiveDpr />
      <PointerRig>
        <DataStream count={particleCount} />
        <EnergyCore />
      </PointerRig>
    </Canvas>
  );
}
