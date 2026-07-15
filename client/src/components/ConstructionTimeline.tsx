import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ConstructionTimelineProps {
  progress: number; // 0 to 1
}

export const ConstructionTimeline: React.FC<ConstructionTimelineProps> = ({ progress }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle sway/rotation
    groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.15 + 0.5;
  });

  // Calculate triggers for 5 distinct stages
  // Stage 1: Foundation (0.0 to 0.2)
  const foundationScaleY = Math.max(0.001, Math.min(1, progress / 0.2));
  const foundationY = (foundationScaleY - 1) * 0.1;

  // Stage 2: Steel Columns (0.2 to 0.4)
  const columnsScaleY = Math.max(0, Math.min(1, (progress - 0.2) / 0.2));

  // Stage 3: Concrete Walls (0.4 to 0.6)
  const wallsOpacity = Math.max(0, Math.min(1, (progress - 0.4) / 0.2));
  const wallsScaleY = Math.max(0.001, Math.min(1, (progress - 0.4) / 0.2));

  // Stage 4: Windows & Roof (0.6 to 0.8)
  const roofY = progress < 0.6 ? 4 : THREE.MathUtils.lerp(4, 2.1, Math.min(1, (progress - 0.6) / 0.2));
  const roofOpacity = Math.max(0, Math.min(1, (progress - 0.6) / 0.2));
  const windowsOpacity = Math.max(0, Math.min(1, (progress - 0.65) / 0.15));

  // Stage 5: Landscaping & Lights (0.8 to 1.0)
  const landscapeScale = Math.max(0, Math.min(1, (progress - 0.8) / 0.2));
  const emissionIntensity = Math.max(0, Math.min(1.5, (progress - 0.85) / 0.15 * 1.5));

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* 1. FOUNDATION */}
      {progress > 0 && (
        <mesh position={[0, foundationY, 0]} receiveShadow castShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color="#2d3748" roughness={0.9} />
        </mesh>
      )}

      {/* Grid lines for foundation outline */}
      <gridHelper args={[6, 12, '#d4a853', '#374151']} position={[0, 0.11, 0]} />

      {/* 2. STEEL FRAMING COLUMNS */}
      {progress > 0.2 && (
        <group>
          {/* Columns */}
          {[-2.2, 0, 2.2].map((x, i) =>
            [-2.2, 2.2].map((z, j) => (
              <mesh
                key={`col-${i}-${j}`}
                position={[x, 1, z]}
                scale={[1, columnsScaleY, 1]}
                castShadow
              >
                <boxGeometry args={[0.15, 2, 0.15]} />
                <meshStandardMaterial color="#dc2626" metalness={0.8} roughness={0.2} /> {/* Steel Red */}
              </mesh>
            ))
          )}
          {/* Horizontal Beams */}
          {columnsScaleY > 0.9 && (
            <mesh position={[0, 2, 0]} castShadow>
              <boxGeometry args={[4.6, 0.1, 4.6]} />
              <meshStandardMaterial color="#dc2626" metalness={0.8} roughness={0.2} />
            </mesh>
          )}
        </group>
      )}

      {/* 3. WALL FINISHES */}
      {progress > 0.4 && (
        <group>
          {/* Back wall */}
          <mesh position={[0, 1, -2.1]} scale={[1, wallsScaleY, 1]} castShadow>
            <boxGeometry args={[4.4, 1.8, 0.1]} />
            <meshStandardMaterial color="#f3f4f6" roughness={0.6} transparent opacity={wallsOpacity} />
          </mesh>
          {/* Left wall */}
          <mesh position={[-2.1, 1, 0]} scale={[1, wallsScaleY, 1]} castShadow>
            <boxGeometry args={[0.1, 1.8, 4.2]} />
            <meshStandardMaterial color="#eaeaea" roughness={0.6} transparent opacity={wallsOpacity} />
          </mesh>
          {/* Right wall */}
          <mesh position={[2.1, 1, 0]} scale={[1, wallsScaleY, 1]} castShadow>
            <boxGeometry args={[0.1, 1.8, 4.2]} />
            <meshStandardMaterial color="#eaeaea" roughness={0.6} transparent opacity={wallsOpacity} />
          </mesh>
          {/* Front walls (segmented for door/windows) */}
          <mesh position={[-1.5, 1, 2.1]} scale={[1, wallsScaleY, 1]} castShadow>
            <boxGeometry args={[1.2, 1.8, 0.1]} />
            <meshStandardMaterial color="#eaeaea" roughness={0.6} transparent opacity={wallsOpacity} />
          </mesh>
          <mesh position={[1.5, 1, 2.1]} scale={[1, wallsScaleY, 1]} castShadow>
            <boxGeometry args={[1.2, 1.8, 0.1]} />
            <meshStandardMaterial color="#eaeaea" roughness={0.6} transparent opacity={wallsOpacity} />
          </mesh>
        </group>
      )}

      {/* 4. ROOF & WINDOWS */}
      {progress > 0.6 && (
        <group>
          {/* Roof slab */}
          <mesh position={[0, roofY, 0]} castShadow>
            <boxGeometry args={[5.2, 0.2, 5.2]} />
            <meshStandardMaterial
              color="#0f172a"
              roughness={0.4}
              transparent
              opacity={roofOpacity}
            />
          </mesh>

          {/* Windows glass front */}
          <mesh position={[0, 1, 2.1]} transparent>
            <boxGeometry args={[1.7, 1.3, 0.02]} />
            <meshStandardMaterial
              color="#bfdbfe"
              roughness={0.05}
              metalness={0.9}
              transparent
              opacity={windowsOpacity * 0.7}
              emissive="#fef08a" // warm window light reflection
              emissiveIntensity={emissionIntensity}
            />
          </mesh>
        </group>
      )}

      {/* 5. LANDSCAPING (Trees, grass) */}
      {progress > 0.8 && (
        <group scale={[landscapeScale, landscapeScale, landscapeScale]}>
          {/* Left Tree trunk */}
          <mesh position={[-2.8, 0.4, 2]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#78350f" />
          </mesh>
          {/* Left Tree leaves */}
          <mesh position={[-2.8, 1, 2]} castShadow>
            <coneGeometry args={[0.5, 0.8, 8]} />
            <meshStandardMaterial color="#15803d" roughness={0.9} />
          </mesh>

          {/* Right Bush */}
          <mesh position={[2.8, 0.25, 1.8]} castShadow>
            <dodecahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial color="#166534" roughness={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default ConstructionTimeline;
