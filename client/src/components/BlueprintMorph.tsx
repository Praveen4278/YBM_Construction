import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlueprintMorphProps {
  progress: number; // 0 to 1 representing scroll position
}

export const BlueprintMorph: React.FC<BlueprintMorphProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Animate rotation and subtle mouse parallax
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Slow auto-rotation
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15 + progress * Math.PI * 0.5;
    
    // Mouse follow tilt (pointer coordinates go from -1 to 1)
    const targetX = state.pointer.x * 0.15;
    const targetY = -state.pointer.y * 0.1;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetX, 0.1);
  });

  // Clamp progress values
  const wireframeOpacity = Math.max(0, Math.min(1, 1.2 - progress * 1.5));
  const solidOpacity = Math.max(0, Math.min(1, (progress - 0.2) * 1.35));

  return (
    <group ref={groupRef} position={[0, -1, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* 1. BLUEPRINT WIREFRAME LAYER */}
      {wireframeOpacity > 0.01 && (
        <group>
          {/* Foundation Slab Wire */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[4, 0.2, 4]} />
            <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={wireframeOpacity * 0.8} />
          </mesh>

          {/* First Floor Walls Wire */}
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[3.8, 1.8, 3.8]} />
            <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={wireframeOpacity * 0.6} />
          </mesh>

          {/* First Floor Ceiling Slab Wire */}
          <mesh position={[0, 2.1, 0]}>
            <boxGeometry args={[4, 0.2, 4]} />
            <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={wireframeOpacity * 0.8} />
          </mesh>

          {/* Second Floor Office Walls Wire */}
          <mesh position={[0, 3.1, 0]}>
            <boxGeometry args={[3, 1.8, 3]} />
            <meshBasicMaterial color="#d4a853" wireframe transparent opacity={wireframeOpacity * 0.6} />
          </mesh>

          {/* Roof Structure Wire */}
          <mesh position={[0, 4.3, 0]} rotation={[0, Math.PI / 4, 0]}>
            <coneGeometry args={[2.5, 0.8, 4]} />
            <meshBasicMaterial color="#00f3ff" wireframe transparent opacity={wireframeOpacity * 0.7} />
          </mesh>

          {/* Framing Pillars (Wireframe Cylinders) */}
          {[-1.8, 1.8].map((x, i) =>
            [-1.8, 1.8].map((z, j) => (
              <mesh key={`p-${i}-${j}`} position={[x, 1.1, z]}>
                <cylinderGeometry args={[0.08, 0.08, 1.8, 8]} />
                <meshBasicMaterial color="#d4a853" wireframe transparent opacity={wireframeOpacity} />
              </mesh>
            ))
          )}
        </group>
      )}

      {/* 2. REALISTIC COMPLETED BUILDING LAYER */}
      {solidOpacity > 0.01 && (
        <group>
          {/* Foundation Concrete Slab */}
          <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[4, 0.2, 4]} />
            <meshStandardMaterial
              color="#374151"
              roughness={0.8}
              transparent
              opacity={solidOpacity}
            />
          </mesh>

          {/* Ground Floor Main Wall (Concrete Gray) */}
          <mesh position={[0, 1.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[3.7, 1.8, 3.7]} />
            <meshStandardMaterial
              color="#eaeaea"
              roughness={0.6}
              transparent
              opacity={solidOpacity}
            />
          </mesh>

          {/* Luxury Wood Accents Panels */}
          <mesh position={[0, 1.1, 1.87]} receiveShadow castShadow>
            <boxGeometry args={[1.5, 1.4, 0.05]} />
            <meshStandardMaterial
              color="#8c5825"
              roughness={0.5}
              transparent
              opacity={solidOpacity}
            />
          </mesh>

          {/* Front Glass Windows */}
          <mesh position={[1.2, 1.1, 1.87]} transparent>
            <boxGeometry args={[0.8, 1.2, 0.05]} />
            <meshStandardMaterial
              color="#93c5fd"
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={solidOpacity * 0.75}
            />
          </mesh>

          {/* Center Floor Concrete Slab */}
          <mesh position={[0, 2.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[4.2, 0.2, 4.2]} />
            <meshStandardMaterial
              color="#1f2937"
              roughness={0.7}
              metalness={0.2}
              transparent
              opacity={solidOpacity}
            />
          </mesh>

          {/* Second Floor Living Area (Rich Gold Frame / Glass) */}
          <mesh position={[0, 3.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[2.9, 1.8, 2.9]} />
            <meshStandardMaterial
              color="#d4a853"
              roughness={0.4}
              metalness={0.6}
              transparent
              opacity={solidOpacity}
            />
          </mesh>

          {/* Second Floor Floor-To-Ceiling Panoramic Windows */}
          <mesh position={[0, 3.1, 1.46]} receiveShadow castShadow>
            <boxGeometry args={[2.2, 1.5, 0.02]} />
            <meshStandardMaterial
              color="#93c5fd"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={solidOpacity * 0.8}
            />
          </mesh>

          {/* Roof Cover Structure */}
          <mesh position={[0, 4.1, 0]} receiveShadow castShadow>
            <boxGeometry args={[3.2, 0.15, 3.2]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.5}
              transparent
              opacity={solidOpacity}
            />
          </mesh>

          {/* Architectural Concrete Columns */}
          {[-1.9, 1.9].map((x, i) =>
            [-1.9, 1.9].map((z, j) => (
              <mesh key={`solid-col-${i}-${j}`} position={[x, 1.1, z]} receiveShadow castShadow>
                <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
                <meshStandardMaterial
                  color="#d4a853"
                  roughness={0.2}
                  metalness={0.8}
                  transparent
                  opacity={solidOpacity}
                />
              </mesh>
            ))
          )}
        </group>
      )}
    </group>
  );
};

export default BlueprintMorph;
