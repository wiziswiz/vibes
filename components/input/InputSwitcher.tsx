'use client';

import { motion } from 'framer-motion';
import { Mic, Type, Blocks } from 'lucide-react';
import { InputMode } from '@/stores/workspace';

interface InputSwitcherProps {
  currentMode: InputMode;
  onModeChange: (mode: InputMode) => void;
}

const modes = [
  {
    id: 'voice' as InputMode,
    icon: Mic,
    label: 'Voice',
    emoji: '🎤',
    description: 'Talk to create',
  },
  {
    id: 'text' as InputMode,
    icon: Type,
    label: 'Type',
    emoji: '⌨️',
    description: 'Write it out',
  },
  {
    id: 'blocks' as InputMode,
    icon: Blocks,
    label: 'Blocks',
    emoji: '🧱',
    description: 'Drag & drop',
  },
];

export function InputSwitcher({ currentMode, onModeChange }: InputSwitcherProps) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/30">
      {modes.map((mode) => {
        const isActive = currentMode === mode.id;
        const Icon = mode.icon;

        return (
          <motion.button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-[var(--color-primary)] text-white'
                : 'hover:bg-[var(--color-background)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="inputModeIndicator"
                className="absolute inset-0 rounded-xl bg-[var(--color-primary)]"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ zIndex: -1 }}
              />
            )}

            <div className="flex items-center gap-2">
              <span className="text-lg">{mode.emoji}</span>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold">{mode.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
