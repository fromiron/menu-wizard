'use client';
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Shape, ExtrudeGeometry, type Group, Vector3 } from 'three';

const CONSTANTS = {
  LEFT_COLOR: 'ffdd01',
  RIGHT_COLOR: '151719',
  NUM_POINTS: 1250,
  INNER_RADIUS: { MIN: 5, MAX: 10 },
  OUTER_RADIUS: { MIN: 10, MAX: 15 },
  STAR_SHAPE: { OUTER_RADIUS: 0.05, INNER_RADIUS: 0.02, POINTS: 5 },
  ANIMATION: { SPEED: 0.01, AMPLITUDE: 0.1 },
};

const getGradientColor = (ratio: number): string => {
  const hex = (x: number) => Math.round(x).toString(16).padStart(2, '0');
  const r = Math.round(
    parseInt(CONSTANTS.LEFT_COLOR.slice(0, 2), 16) * (1 - ratio) +
      parseInt(CONSTANTS.RIGHT_COLOR.slice(0, 2), 16) * ratio,
  );
  const g = Math.round(
    parseInt(CONSTANTS.LEFT_COLOR.slice(2, 4), 16) * (1 - ratio) +
      parseInt(CONSTANTS.RIGHT_COLOR.slice(2, 4), 16) * ratio,
  );
  const b = Math.round(
    parseInt(CONSTANTS.LEFT_COLOR.slice(4, 6), 16) * (1 - ratio) +
      parseInt(CONSTANTS.RIGHT_COLOR.slice(4, 6), 16) * ratio,
  );
  return `#${hex(r)}${hex(g)}${hex(b)}`;
};

const useStarShape = () => {
  return useMemo(() => {
    const shape = new Shape();
    const { POINTS, OUTER_RADIUS, INNER_RADIUS } = CONSTANTS.STAR_SHAPE;

    for (let i = 0; i < POINTS * 2; i++) {
      const radius = i % 2 === 0 ? OUTER_RADIUS : INNER_RADIUS;
      const angle = (i / (POINTS * 2)) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      i === 0 ? shape.moveTo(x, y) : shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);
};

const useStarGeometry = (starShape: Shape) => {
  return useMemo(() => {
    const extrudeSettings = { steps: 1, depth: 0.005, bevelEnabled: false };
    return new ExtrudeGeometry(starShape, extrudeSettings);
  }, [starShape]);
};

const Particle: React.FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-50 bg-gradient">
    <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
      <directionalLight />
      <pointLight position={[-30, 0, -30]} power={10.0} />
      <PointCircle />
    </Canvas>
  </div>
);

const PointCircle: React.FC = () => {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={ref}>
      {[...pointsInner, ...pointsOuter].map((point, i) => (
        <AnimatedStar
          key={`star-${i}`}
          initialPosition={point.position}
          color={point.color}
        />
      ))}
    </group>
  );
};

interface AnimatedStarProps {
  initialPosition: number[];
  color: string;
}

const AnimatedStar: React.FC<AnimatedStarProps> = ({
  initialPosition,
  color,
}) => {
  const ref = useRef<Group>(null);
  const time = useRef(Math.random() * 100);
  const originalPosition = useRef(new Vector3(...initialPosition));

  const starShape = useStarShape();
  const geometry = useStarGeometry(starShape);

  useFrame(() => {
    if (ref.current) {
      time.current += CONSTANTS.ANIMATION.SPEED;
      const { AMPLITUDE } = CONSTANTS.ANIMATION;
      ref.current.position.x =
        originalPosition.current.x + Math.sin(time.current) * AMPLITUDE;
      ref.current.position.y =
        originalPosition.current.y + Math.cos(time.current) * AMPLITUDE;
      ref.current.position.z =
        originalPosition.current.z +
        Math.sin(time.current + Math.PI) * AMPLITUDE * 0.5;
      ref.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0.7}
          color={color}
        />
      </mesh>
    </group>
  );
};

const createPoints = (
  count: number,
  minRadius: number,
  maxRadius: number,
): Point[] => {
  return Array.from({ length: count }, (_, i) => {
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const z = (Math.random() - 0.5) * 2;
    return {
      idx: i,
      position: [x, y, z],
      color: getGradientColor(radius / maxRadius),
    };
  });
};

type Point = {
  idx: number;
  position: number[];
  color: string;
};

const pointsInner = createPoints(
  CONSTANTS.NUM_POINTS,
  CONSTANTS.INNER_RADIUS.MIN,
  CONSTANTS.INNER_RADIUS.MAX,
);
const pointsOuter = createPoints(
  CONSTANTS.NUM_POINTS / 4,
  CONSTANTS.OUTER_RADIUS.MIN,
  CONSTANTS.OUTER_RADIUS.MAX,
);

export default Particle;
