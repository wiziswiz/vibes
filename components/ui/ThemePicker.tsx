'use client';

import { motion } from 'framer-motion';
import { themes, ThemeName } from '@/types/themes';

interface ThemePickerProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemePicker({ currentTheme, onThemeChange }: ThemePickerProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold text-[var(--color-text)]">
        Choose Your World
      </h3>
      <div className="flex flex-wrap gap-2">
        {Object.values(themes).map((theme) => {
          const isActive = currentTheme === theme.name;

          return (
            <motion.button
              key={theme.name}
              onClick={() => onThemeChange(theme.name)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-background)]'
                  : ''
              }`}
              style={{
                background: theme.colors.surface,
                borderColor: theme.colors.primary,
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl">{theme.emoji}</span>
              <span
                className="font-bold text-sm"
                style={{ color: theme.colors.text }}
              >
                {theme.displayName}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
