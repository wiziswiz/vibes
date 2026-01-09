'use client';

import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  message?: string;
}

export function LoadingAnimation({
  message = 'Creating something amazing...',
}: LoadingAnimationProps) {
  const emojis = ['✨', '🎨', '🚀', '⭐', '🌈'];

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Animated emoji circle */}
      <div className="relative w-32 h-32">
        {emojis.map((emoji, index) => (
          <motion.div
            key={index}
            className="absolute text-3xl"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: Math.cos((index / emojis.length) * Math.PI * 2) * 50 - 15,
              y: Math.sin((index / emojis.length) * Math.PI * 2) * 50 - 15,
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: index * 0.2,
            }}
          >
            {emoji}
          </motion.div>
        ))}

        {/* Center pulsing circle */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-16 h-16 -ml-8 -mt-8 rounded-full bg-[var(--color-primary)]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Message */}
      <motion.p
        className="text-xl font-bold text-[var(--color-text)] text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-[var(--color-primary)]"
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
