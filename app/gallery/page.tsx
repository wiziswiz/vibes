'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FolderOpen, Plus, Sparkles } from 'lucide-react';
import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { useWorkspaceStore } from '@/stores/workspace';

export default function GalleryPage() {
  const { theme } = useWorkspaceStore();

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Placeholder data - will be replaced with real data from Supabase
  const placeholderCreations = [
    { id: 1, title: 'Bouncing Ball', emoji: '🎮', date: 'Today' },
    { id: 2, title: 'Rainbow Art', emoji: '🌈', date: 'Yesterday' },
    { id: 3, title: 'Dancing Stars', emoji: '⭐', date: '2 days ago' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)]">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-text)]">
                  My Creations
                </h1>
                <p className="text-[var(--color-text-muted)]">
                  All your amazing projects in one place!
                </p>
              </div>
            </div>

            <Link href="/create">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-5 h-5" />
                New Creation
              </motion.button>
            </Link>
          </motion.div>

          {/* Grid of creations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder cards */}
            {placeholderCreations.map((creation, index) => (
              <motion.div
                key={creation.id}
                className="group relative p-6 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] transition-all cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-square rounded-xl bg-[var(--color-background)] flex items-center justify-center mb-4">
                  <span className="text-6xl">{creation.emoji}</span>
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">
                  {creation.title}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {creation.date}
                </p>

                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-2xl bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-[var(--color-text)] font-bold">
                    Open
                  </span>
                </div>
              </motion.div>
            ))}

            {/* Empty state / Create new card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/create">
                <div className="aspect-square p-6 rounded-2xl border-2 border-dashed border-[var(--color-primary)]/50 hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center group-hover:bg-[var(--color-primary)]/30 transition-all"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Plus className="w-8 h-8 text-[var(--color-primary)]" />
                  </motion.div>
                  <span className="text-[var(--color-text-muted)] font-medium group-hover:text-[var(--color-text)] transition-colors">
                    Create Something New!
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Coming soon notice */}
          <motion.div
            className="mt-12 p-6 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-accent)]/30 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="font-bold text-[var(--color-text)]">
                Coming Soon!
              </span>
            </div>
            <p className="text-[var(--color-text-muted)]">
              Save your creations, share them with friends, and see what others have made.
              <br />
              For now, have fun creating in the workspace!
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
