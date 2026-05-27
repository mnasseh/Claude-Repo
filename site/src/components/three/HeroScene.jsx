import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Icosahedron, Float, Sparkles } from '@react-three/drei';
import { useReducedMotion } from '../../hooks/useReducedMotion';

function Wireframe() {
  const inner = useRef();
  const outer = useRef();
  useFrame((state, dt) => {
    if (inner.current) {
      inner.current.rotation.x += dt * 0.12;
      inner.current.rotation.y += dt * 0.18;
    }
    if (outer.current) {
      outer.current.rotation.x -= dt * 0.05;
      outer.current.rotation.y -= dt * 0.08;
      const t = state.clock.getElapsedTime();
      outer.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.04);
    }
  });
  return (
    <group>
      <Icosahedron ref={outer} args={[2.2, 1]}>
        <meshBasicMaterial wireframe color="#5EF2FF" transparent opacity={0.35} />
      </Icosahedron>
      <Icosahedron ref={inner} args={[1.55, 2]}>
        <meshBasicMaterial wireframe color="#22D3EE" transparent opacity={0.55} />
      </Icosahedron>
      <Icosahedron args={[0.85, 0]}>
        <meshBasicMaterial color="#E8B27A" transparent opacity={0.18} />
      </Icosahedron>
    </group>
  );
}

export function HeroScene() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={0.6} color="#5EF2FF" />
      <Suspense fallback={null}>
        {reduced ? (
          <Wireframe />
        ) : (
          <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
            <Wireframe />
          </Float>
        )}
        {!reduced && (
          <Sparkles count={60} scale={8} size={2} speed={0.4} color="#5EF2FF" opacity={0.6} />
        )}
      </Suspense>
    </Canvas>
  );
}
