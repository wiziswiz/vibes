'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

const SHAPE_COLORS = [
  'var(--color-primary)',
  'var(--color-accent)',
  'var(--color-accent-2)',
  'var(--color-accent-3)',
];

function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  }));
}

function generateShapes(count: number): FloatingShape[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 100 + 50,
    color: SHAPE_COLORS[i % SHAPE_COLORS.length],
    delay: Math.random() * 5,
  }));
}

export function MagicBackground() {
  const stars = useMemo(() => generateStars(50), []);
  const shapes = useMemo(() => generateShapes(8), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Gradient overlay blobs */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            width: shape.size,
            height: shape.size,
            background: shape.color,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Shooting star occasionally */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          boxShadow: '0 0 10px 2px white, -20px 0 20px 1px rgba(255,255,255,0.5)',
        }}
        initial={{ x: '-10%', y: '20%', opacity: 0 }}
        animate={{
          x: ['110%'],
          y: ['80%'],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 8,
          ease: 'easeIn',
        }}
      />

      {/* Noise texture */}
      <div className="noise-overlay" />
    </div>
  );
}
