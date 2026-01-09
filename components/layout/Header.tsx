'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Settings, Home, FolderOpen } from 'lucide-react';

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  return (
    <motion.header
      className="flex items-center justify-between px-6 py-4 bg-[var(--color-surface)]/80 backdrop-blur-sm border-b-2 border-[var(--color-primary)]/30"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)]"
          whileHover={{ rotate: 10, scale: 1.1 }}
        >
          <Sparkles className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
            VIBES
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            Vibe Coding for Kids
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-2">
        <Link href="/">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent hover:bg-[var(--color-primary)]/20 text-[var(--color-text)] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">Home</span>
          </motion.button>
        </Link>

        <Link href="/create">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            <span className="hidden sm:inline">Create</span>
          </motion.button>
        </Link>

        <Link href="/gallery">
          <motion.button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent hover:bg-[var(--color-primary)]/20 text-[var(--color-text)] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FolderOpen className="w-5 h-5" />
            <span className="font-bold hidden sm:inline">My Stuff</span>
          </motion.button>
        </Link>

        {onSettingsClick && (
          <motion.button
            onClick={onSettingsClick}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-transparent hover:bg-[var(--color-primary)]/20 text-[var(--color-text)] transition-colors"
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
        )}
      </nav>
    </motion.header>
  );
}
