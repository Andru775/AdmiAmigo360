"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Knot() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.35;
    ref.current.rotation.y = t * 0.55;
  });

  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1, 0.35, 220, 28]} />
      <meshStandardMaterial metalness={0.7} roughness={0.2} />
    </mesh>
  );
}

export default function Hero3D() {
  return (
    <div className="h-[420px] w-full">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 3, 3]} intensity={2} />
        <Knot />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  );
}