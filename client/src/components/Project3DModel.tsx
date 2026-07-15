import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Project3DModelProps {
  type: 'villa' | 'tower' | 'apartment';
  color?: string;
  wireframe?: boolean;
}

export const Project3DModel: React.FC<Project3DModelProps> = ({
  type = 'villa',
  color = '#d4a853',
  wireframe = false
}) => {
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation and subtle mouse tilt response
  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Auto-rotation
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    
    // Mouse hover parallax tilt
    const targetX = state.pointer.x * 0.12;
    const targetY = -state.pointer.y * 0.08;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.1);
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetX, 0.1);
  });

  // Common materials based on configuration
  const primaryMaterial = wireframe 
    ? new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.8 })
    : new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.7 });

  const concreteMaterial = wireframe
    ? new THREE.MeshBasicMaterial({ color: '#8892b0', wireframe: true, transparent: true, opacity: 0.4 })
    : new THREE.MeshStandardMaterial({ color: '#374151', roughness: 0.8, metalness: 0.1 });

  const glassMaterial = wireframe
    ? new THREE.MeshBasicMaterial({ color: '#00f3ff', wireframe: true, transparent: true, opacity: 0.5 })
    : new THREE.MeshStandardMaterial({ color: '#93c5fd', roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.6 });

  const accentMaterial = wireframe
    ? new THREE.MeshBasicMaterial({ color: '#ffffff', wireframe: true, transparent: true, opacity: 0.6 })
    : new THREE.MeshStandardMaterial({ color: '#eaeaea', roughness: 0.5, metalness: 0.2 });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      
      {/* ======================================================== */}
      {/* 1. LUXURY VILLA MODEL */}
      {/* ======================================================== */}
      {type === 'villa' && (
        <group scale={[1.1, 1.1, 1.1]}>
          {/* Foundation Concrete Slab */}
          <mesh position={[0, 0.1, 0]} receiveShadow castShadow material={concreteMaterial}>
            <boxGeometry args={[4, 0.2, 4]} />
          </mesh>

          {/* Ground Floor Main Wall Block */}
          <mesh position={[0, 1.0, 0]} receiveShadow castShadow material={accentMaterial}>
            <boxGeometry args={[3.6, 1.6, 3.6]} />
          </mesh>

          {/* Wooden Feature Panel in Front */}
          {!wireframe && (
            <mesh position={[0, 1.0, 1.82]} receiveShadow castShadow>
              <boxGeometry args={[1.6, 1.3, 0.05]} />
              <meshStandardMaterial color="#8c5825" roughness={0.6} />
            </mesh>
          )}

          {/* Ground Floor Glass Window */}
          <mesh position={[1.1, 1.0, 1.82]} receiveShadow castShadow material={glassMaterial}>
            <boxGeometry args={[0.8, 1.1, 0.05]} />
          </mesh>

          {/* Mid Ceiling Concrete Slab */}
          <mesh position={[0, 1.9, 0]} receiveShadow castShadow material={concreteMaterial}>
            <boxGeometry args={[4.2, 0.15, 4.2]} />
          </mesh>

          {/* First Floor Bedroom Block (Rich Gold / Custom Color) */}
          <mesh position={[-0.2, 2.7, -0.2]} receiveShadow castShadow material={primaryMaterial}>
            <boxGeometry args={[2.8, 1.4, 2.8]} />
          </mesh>

          {/* First Floor Glass Balcony Window */}
          <mesh position={[-0.2, 2.7, 1.22]} receiveShadow castShadow material={glassMaterial}>
            <boxGeometry args={[2.0, 1.1, 0.04]} />
          </mesh>

          {/* Roof Slab */}
          <mesh position={[-0.2, 3.45, -0.2]} receiveShadow castShadow material={concreteMaterial}>
            <boxGeometry args={[3.0, 0.12, 3.0]} />
          </mesh>

          {/* Villa Column Pillar */}
          <mesh position={[1.8, 1.0, 1.8]} receiveShadow castShadow material={primaryMaterial}>
            <cylinderGeometry args={[0.08, 0.08, 1.6, 16]} />
          </mesh>
        </group>
      )}

      {/* ======================================================== */}
      {/* 2. COMMERCIAL TOWER MODEL */}
      {/* ======================================================== */}
      {type === 'tower' && (
        <group scale={[0.8, 0.8, 0.8]} position={[0, -0.8, 0]}>
          {/* Base Foundation Concrete Pad */}
          <mesh position={[0, 0.15, 0]} receiveShadow castShadow material={concreteMaterial}>
            <boxGeometry args={[4.5, 0.3, 4.5]} />
          </mesh>

          {/* Stacked Skyscraper Floors (Procedural 6-story grid) */}
          {[0, 1, 2, 3, 4, 5].map((floor) => {
            const yPos = 0.3 + floor * 1.0 + 0.5;
            const scale = 1.0 - floor * 0.05; // slightly tapers at top
            return (
              <group key={`floor-${floor}`} position={[0, yPos, 0]} scale={[scale, 1, scale]}>
                
                {/* Floor Glass Body */}
                <mesh receiveShadow castShadow material={glassMaterial}>
                  <boxGeometry args={[2.6, 0.9, 2.6]} />
                </mesh>

                {/* Steel Slab Dividers */}
                <mesh position={[0, 0.48, 0]} receiveShadow castShadow material={concreteMaterial}>
                  <boxGeometry args={[2.9, 0.08, 2.9]} />
                </mesh>

                {/* Vertical Steel Frame Mullions on Corners */}
                {[-1.35, 1.35].map((x, i) =>
                  [-1.35, 1.35].map((z, j) => (
                    <mesh key={`column-${floor}-${i}-${j}`} position={[x, 0, z]} receiveShadow castShadow material={primaryMaterial}>
                      <boxGeometry args={[0.15, 0.9, 0.15]} />
                    </mesh>
                  ))
                )}
              </group>
            );
          })}

          {/* Architectural Crown Fins on Top */}
          <mesh position={[0, 6.7, 0]} receiveShadow castShadow material={primaryMaterial}>
            <boxGeometry args={[2.0, 0.8, 2.0]} />
          </mesh>
          <mesh position={[0, 7.3, 0]} receiveShadow castShadow material={accentMaterial}>
            <cylinderGeometry args={[0.02, 0.02, 1.0, 8]} />
          </mesh>
        </group>
      )}

      {/* ======================================================== */}
      {/* 3. RESIDENTIAL APARTMENT MODEL */}
      {/* ======================================================== */}
      {type === 'apartment' && (
        <group scale={[0.9, 0.9, 0.9]} position={[0, -0.4, 0]}>
          {/* Foundation Base */}
          <mesh position={[0, 0.15, 0]} receiveShadow castShadow material={concreteMaterial}>
            <boxGeometry args={[5, 0.3, 3]} />
          </mesh>

          {/* Three Stacked Apartment Floors */}
          {[0, 1, 2].map((floor) => {
            const yPos = 0.3 + floor * 1.3 + 0.65;
            return (
              <group key={`apt-floor-${floor}`} position={[0, yPos, 0]}>
                {/* Main Apartment Wall Body */}
                <mesh receiveShadow castShadow material={accentMaterial}>
                  <boxGeometry args={[4.2, 1.2, 2.2]} />
                </mesh>

                {/* Balcony slab sticking out in front */}
                <mesh position={[1.0, -0.55, 1.4]} receiveShadow castShadow material={concreteMaterial}>
                  <boxGeometry args={[1.8, 0.1, 0.8]} />
                </mesh>

                {/* Balcony glass railing */}
                <mesh position={[1.0, -0.3, 1.78]} receiveShadow castShadow material={glassMaterial}>
                  <boxGeometry args={[1.8, 0.4, 0.04]} />
                </mesh>

                {/* Large sliding balcony doors */}
                <mesh position={[1.0, 0.05, 1.11]} receiveShadow castShadow material={glassMaterial}>
                  <boxGeometry args={[1.6, 1.0, 0.02]} />
                </mesh>

                {/* Left side standard windows */}
                <mesh position={[-1.2, 0.1, 1.11]} receiveShadow castShadow material={glassMaterial}>
                  <boxGeometry args={[1.0, 0.7, 0.02]} />
                </mesh>

                {/* Level Concrete Ceiling Divider */}
                <mesh position={[0, 0.65, 0]} receiveShadow castShadow material={concreteMaterial}>
                  <boxGeometry args={[4.6, 0.1, 2.5]} />
                </mesh>

                {/* Exterior Vertical Columns for structural aesthetic */}
                {[-2.2, 2.2].map((x, i) => (
                  <mesh key={`apt-col-${floor}-${i}`} position={[x, 0, 0]} receiveShadow castShadow material={primaryMaterial}>
                    <cylinderGeometry args={[0.08, 0.08, 1.3, 12]} />
                  </mesh>
                ))}
              </group>
            );
          })}

          {/* Penthouse structure on top */}
          <group position={[-0.8, 4.5, 0]}>
            <mesh receiveShadow castShadow material={primaryMaterial}>
              <boxGeometry args={[2.0, 0.9, 1.8]} />
            </mesh>
            <mesh position={[0, 0.5, 0]} receiveShadow castShadow material={concreteMaterial}>
              <boxGeometry args={[2.2, 0.1, 2.0]} />
            </mesh>
          </group>
        </group>
      )}

    </group>
  );
};

export default Project3DModel;
