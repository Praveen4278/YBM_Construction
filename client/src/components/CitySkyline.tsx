import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CitySkyline: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const crane1Ref = useRef<THREE.Group>(null);
  const crane2Ref = useRef<THREE.Group>(null);

  // Generate randomized skyscrapers details once
  const buildings = useMemo(() => {
    const data = [];
    const count = 28;
    for (let i = 0; i < count; i++) {
      // Horizontal placement along x
      const x = (i - count / 2) * 0.9 + (Math.random() - 0.5) * 0.4;
      const height = 1.5 + Math.random() * 4;
      const width = 0.4 + Math.random() * 0.45;
      const depth = 0.4 + Math.random() * 0.45;
      const color = Math.random() > 0.4 ? '#031c3c' : '#1f2937';
      const wireframeColor = Math.random() > 0.65 ? '#d4a853' : '#38bdf8';
      
      data.push({ x, height, width, depth, color, wireframeColor });
    }
    return data;
  }, []);

  // Frame animations for rotation and crane sways
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    
    // Slow camera pan effect
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(elapsed * 0.05) * 0.08;
    }

    // Rotate Crane 1
    if (crane1Ref.current) {
      crane1Ref.current.rotation.y = Math.sin(elapsed * 0.4) * 0.5;
    }

    // Rotate Crane 2
    if (crane2Ref.current) {
      crane2Ref.current.rotation.y = Math.cos(elapsed * 0.3) * 0.4 - 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, -2]}>
      {/* Skyscraper Buildings */}
      {buildings.map((b, idx) => (
        <group key={`b-${idx}`} position={[b.x, b.height / 2, -1.5 + (idx % 3) * 0.5]}>
          {/* Solid low-poly tower base */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.width, b.height, b.depth]} />
            <meshStandardMaterial color={b.color} roughness={0.9} metalness={0.2} />
          </mesh>
          {/* Wireframe glowing border overlay */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[b.width + 0.01, b.height + 0.01, b.depth + 0.01]} />
            <meshBasicMaterial color={b.wireframeColor} wireframe transparent opacity={0.25} />
          </mesh>
          {/* Rooftop red warning beacon light */}
          {b.height > 3 && (
            <mesh position={[0, b.height / 2 + 0.05, 0]}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          )}
        </group>
      ))}

      {/* 3D BUILDING CRANE 1 */}
      <group ref={crane1Ref} position={[-3, 0, -0.5]}>
        {/* Vertical Mast Tower */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 3.6, 6]} />
          <meshBasicMaterial color="#d4a853" wireframe />
        </mesh>
        
        {/* Horizontal Jib Arm */}
        <group position={[0, 3.6, 0]}>
          {/* Working Jib */}
          <mesh position={[1, 0, 0]} rotation={[0, 0, 0]}>
            <boxGeometry args={[2, 0.06, 0.06]} />
            <meshBasicMaterial color="#d4a853" wireframe />
          </mesh>
          {/* Counterweight Jib */}
          <mesh position={[-0.4, 0, 0]}>
            <boxGeometry args={[0.8, 0.06, 0.06]} />
            <meshBasicMaterial color="#374151" />
          </mesh>
          {/* Hook Cable */}
          <mesh position={[1.4, -0.6, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 1.2, 4]} />
            <meshBasicMaterial color="#b3b3b3" />
          </mesh>
          {/* Hook Weight */}
          <mesh position={[1.4, -1.2, 0]}>
            <boxGeometry args={[0.04, 0.06, 0.04]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>

      {/* 3D BUILDING CRANE 2 */}
      <group ref={crane2Ref} position={[2.5, 0, -1.0]}>
        {/* Vertical Mast */}
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 4.4, 6]} />
          <meshBasicMaterial color="#d4a853" wireframe />
        </mesh>
        
        {/* Horizontal Jib */}
        <group position={[0, 4.4, 0]}>
          {/* Jib */}
          <mesh position={[1.2, 0, 0]}>
            <boxGeometry args={[2.4, 0.07, 0.07]} />
            <meshBasicMaterial color="#d4a853" wireframe />
          </mesh>
          {/* Counter Jib */}
          <mesh position={[-0.5, 0, 0]}>
            <boxGeometry args={[1, 0.07, 0.07]} />
            <meshBasicMaterial color="#374151" />
          </mesh>
          {/* Cable */}
          <mesh position={[1.8, -0.8, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 1.6, 4]} />
            <meshBasicMaterial color="#b3b3b3" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

export default CitySkyline;
