"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

function Particles() {
  const points = useRef<THREE.Points>(null!);

  const { positions } = useMemo(() => {
    const count = 1200;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const rx = pseudoRandom(i * 3 + 1);
      const ry = pseudoRandom(i * 3 + 2);
      const rz = pseudoRandom(i * 3 + 3);

      pos[i * 3 + 0] = (rx - 0.5) * 10;
      pos[i * 3 + 1] = (ry - 0.5) * 6;
      pos[i * 3 + 2] = (rz - 0.5) * 10;
    }

    return { positions: pos };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotación lenta
    points.current.rotation.y = t * 0.03;
    points.current.rotation.x = t * 0.01;

    // Parallax suave con mouse
    const mx = (state.pointer.x ?? 0) * 0.25;
    const my = (state.pointer.y ?? 0) * 0.25;

    points.current.rotation.y += mx * 0.02;
    points.current.rotation.x += my * 0.02;
  });

  return (
    <points ref={points}>
        <bufferGeometry>
            <bufferAttribute
                attach="attributes-position"
                args={[positions, 3]}
            />
        </bufferGeometry>

      <pointsMaterial
        size={0.02}
        transparent
        opacity={0.45}
        color="#ffffff"
      />
    </points>
  );
}

export default function Ambient3D() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }}>
        <ambientLight intensity={1} />
        <Particles />
      </Canvas>
    </div>
  );
}
