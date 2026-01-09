'use client';

import { motion } from 'framer-motion';

interface MascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  mood?: 'happy' | 'excited' | 'thinking' | 'sleeping';
  className?: string;
}

const sizeMap = {
  sm: 60,
  md: 100,
  lg: 150,
  xl: 200,
};

export function Mascot({ size = 'md', mood = 'happy', className = '' }: MascotProps) {
  const dimensions = sizeMap[size];

  // Different eye expressions based on mood
  const eyeVariants = {
    happy: { scaleY: 1 },
    excited: { scaleY: 1.2 },
    thinking: { scaleY: 0.8, x: 5 },
    sleeping: { scaleY: 0.1 },
  };

  // Body bounce animation based on mood
  const bodyVariants = {
    happy: {
      y: [0, -5, 0],
      rotate: [0, 2, -2, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
    excited: {
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const },
    },
    thinking: {
      rotate: [0, 5, 0],
      transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
    },
    sleeping: {
      y: [0, 2, 0],
      transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
    },
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: dimensions, height: dimensions }}
      animate={bodyVariants[mood]}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl"
      >
        {/* Glow effect */}
        <defs>
          <radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="50%" stopColor="var(--color-accent-2)" />
            <stop offset="100%" stopColor="var(--color-secondary)" />
          </linearGradient>
          <linearGradient id="cheekGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F472B6" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer glow */}
        <circle cx="50" cy="55" r="48" fill="url(#mascotGlow)" />

        {/* Body - blob shape */}
        <motion.path
          d="M50 10 C80 10 95 35 95 55 C95 80 75 95 50 95 C25 95 5 80 5 55 C5 35 20 10 50 10"
          fill="url(#bodyGradient)"
          animate={{
            d: [
              "M50 10 C80 10 95 35 95 55 C95 80 75 95 50 95 C25 95 5 80 5 55 C5 35 20 10 50 10",
              "M50 12 C78 8 93 38 93 55 C93 82 73 93 50 93 C27 93 7 82 7 55 C7 38 22 8 50 12",
              "M50 10 C80 10 95 35 95 55 C95 80 75 95 50 95 C25 95 5 80 5 55 C5 35 20 10 50 10",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Shine highlight */}
        <ellipse cx="35" cy="35" rx="15" ry="10" fill="white" opacity="0.3" />

        {/* Eyes */}
        <motion.g animate={eyeVariants[mood]} transition={{ duration: 0.3 }}>
          {/* Left eye */}
          <ellipse cx="35" cy="50" rx="8" ry="10" fill="white" />
          <motion.circle
            cx="37"
            cy="52"
            r="5"
            fill="#1a1a2e"
            animate={{ cx: [37, 35, 37] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle cx="39" cy="49" r="2" fill="white" />

          {/* Right eye */}
          <ellipse cx="65" cy="50" rx="8" ry="10" fill="white" />
          <motion.circle
            cx="67"
            cy="52"
            r="5"
            fill="#1a1a2e"
            animate={{ cx: [67, 65, 67] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <circle cx="69" cy="49" r="2" fill="white" />
        </motion.g>

        {/* Blush cheeks */}
        <ellipse cx="22" cy="60" rx="8" ry="5" fill="url(#cheekGradient)" />
        <ellipse cx="78" cy="60" rx="8" ry="5" fill="url(#cheekGradient)" />

        {/* Mouth */}
        {mood === 'happy' && (
          <path
            d="M40 68 Q50 78 60 68"
            stroke="#1a1a2e"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {mood === 'excited' && (
          <ellipse cx="50" cy="70" rx="10" ry="8" fill="#1a1a2e" />
        )}
        {mood === 'thinking' && (
          <ellipse cx="55" cy="70" rx="5" ry="4" fill="#1a1a2e" />
        )}
        {mood === 'sleeping' && (
          <>
            <path
              d="M40 70 Q50 72 60 70"
              stroke="#1a1a2e"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Z's for sleeping */}
            <motion.text
              x="75"
              y="30"
              fill="var(--color-accent)"
              fontSize="12"
              fontWeight="bold"
              animate={{ y: [30, 20], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Z
            </motion.text>
            <motion.text
              x="82"
              y="22"
              fill="var(--color-accent)"
              fontSize="10"
              fontWeight="bold"
              animate={{ y: [22, 12], opacity: [1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            >
              z
            </motion.text>
          </>
        )}

        {/* Wizard hat for the magical theme */}
        <motion.g
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '50px 0px' }}
        >
          <path
            d="M30 18 L50 -15 L70 18 Z"
            fill="var(--color-secondary)"
          />
          <ellipse cx="50" cy="18" rx="22" ry="6" fill="var(--color-secondary)" />
          {/* Hat band */}
          <rect x="28" y="15" width="44" height="6" rx="2" fill="var(--color-accent)" />
          {/* Star on hat */}
          <motion.path
            d="M50 -5 L52 0 L57 0 L53 3 L55 8 L50 5 L45 8 L47 3 L43 0 L48 0 Z"
            fill="var(--color-accent)"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: '50px 2px' }}
          />
        </motion.g>

        {/* Magic sparkles around */}
        {mood === 'excited' && (
          <>
            <motion.circle
              cx="15"
              cy="40"
              r="3"
              fill="var(--color-accent)"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.circle
              cx="85"
              cy="35"
              r="2"
              fill="var(--color-accent-2)"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle
              cx="20"
              cy="75"
              r="2"
              fill="var(--color-accent-3)"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
            />
            <motion.circle
              cx="80"
              cy="80"
              r="3"
              fill="var(--color-primary)"
              animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.9 }}
            />
          </>
        )}
      </svg>
    </motion.div>
  );
}
