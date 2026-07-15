import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';

interface ThreeCanvasProps {
  children: React.ReactNode;
  enableControls?: boolean;
  cameraPos?: [number, number, number];
  fov?: number;
  shadows?: boolean;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  children,
  enableControls = false,
  cameraPos = [0, 5, 12],
  fov = 45,
  shadows = false
}) => {
  return (
    <div className="w-full h-full min-h-[300px] relative pointer-events-auto">
      <Canvas
        shadows={shadows}
        dpr={[1, 1.5]} // Limit pixel ratio to max 1.5x on retina screens to boost rendering speed
        camera={{ position: cameraPos, fov }}
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: "high-performance", // Force dedicated GPU usage where available
          precision: "mediump" // Use medium precision shaders for performance
        }}
      >
        <Suspense fallback={null}>
          {/* Ambient Lighting for base visibility */}
          <ambientLight intensity={0.7} />
          
          {/* Main Key Light representing the sun */}
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.2}
            castShadow={shadows}
            shadow-mapSize-width={512} // Reduced shadow resolution for better FPS if enabled
            shadow-mapSize-height={512}
            shadow-bias={-0.0002}
          />
          
          {/* Warm fill light */}
          <pointLight position={[-10, 5, -10]} intensity={0.5} color="#d4a853" />
          
          {/* Soft blue back light */}
          <pointLight position={[0, -5, 5]} intensity={0.4} color="#031124" />

          {/* Floating particle stars */}
          <Stars radius={100} depth={50} count={200} factor={4} saturation={0} fade speed={1} />

          {children}

          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2 - 0.05} // don't go below ground
              minPolarAngle={0.1}
              dampingFactor={0.05}
              enableDamping
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeCanvas;
