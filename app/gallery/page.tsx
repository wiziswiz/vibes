'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FolderOpen, Plus, Trash2, Download, Play, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useWorkspaceStore } from '@/stores/workspace';
import { getProjects, deleteProject, downloadProject, SavedProject } from '@/lib/storage';

export default function GalleryPage() {
  const router = useRouter();
  const { theme } = useWorkspaceStore();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load projects from localStorage
  useEffect(() => {
    setProjects(getProjects());
  }, []);

  // Format relative time
  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Handle loading a project
  const handleLoad = (project: SavedProject) => {
    // Store project in sessionStorage for the create page to pick up
    sessionStorage.setItem('vibes_load_project', JSON.stringify(project));
    router.push('/create');
  };

  // Handle delete
  const handleDelete = (id: string) => {
    deleteProject(id);
    setProjects(getProjects());
    setDeleteConfirm(null);
  };

  // Handle download
  const handleDownload = (project: SavedProject) => {
    downloadProject(project);
  };

  // Get an emoji based on the project title/prompt
  const getProjectEmoji = (project: SavedProject): string => {
    const text = (project.title + ' ' + project.prompt).toLowerCase();
    if (text.includes('game') || text.includes('play')) return '🎮';
    if (text.includes('rainbow') || text.includes('color')) return '🌈';
    if (text.includes('star') || text.includes('space')) return '⭐';
    if (text.includes('cat') || text.includes('dog') || text.includes('animal')) return '🐱';
    if (text.includes('ball') || text.includes('bounce')) return '⚽';
    if (text.includes('flower') || text.includes('garden')) return '🌸';
    if (text.includes('fish') || text.includes('ocean') || text.includes('water')) return '🐠';
    if (text.includes('bird') || text.includes('fly')) return '🐦';
    if (text.includes('music') || text.includes('sound')) return '🎵';
    if (text.includes('heart') || text.includes('love')) return '❤️';
    if (text.includes('fire') || text.includes('flame')) return '🔥';
    if (text.includes('snow') || text.includes('winter')) return '❄️';
    return '✨';
  };

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
                  {projects.length === 0
                    ? 'Your projects will appear here!'
                    : `${projects.length} project${projects.length !== 1 ? 's' : ''} saved`}
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
            {/* Project cards */}
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="group relative rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/30 hover:border-[var(--color-primary)] transition-all overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Thumbnail area */}
                <div
                  className="aspect-square bg-[var(--color-background)] flex items-center justify-center cursor-pointer relative"
                  onClick={() => handleLoad(project)}
                >
                  <span className="text-6xl">{getProjectEmoji(project)}</span>

                  {/* Play overlay on hover */}
                  <div className="absolute inset-0 bg-[var(--color-primary)]/0 group-hover:bg-[var(--color-primary)]/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[var(--color-text)] mb-1 truncate">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-[var(--color-text-muted)]">
                    <Clock className="w-3 h-3" />
                    {formatTime(project.updatedAt)}
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    <motion.button
                      onClick={() => handleDownload(project)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-sm font-medium hover:bg-[var(--color-primary)]/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </motion.button>
                    <motion.button
                      onClick={() => setDeleteConfirm(project.id)}
                      className="px-3 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Delete confirmation overlay */}
                <AnimatePresence>
                  {deleteConfirm === project.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[var(--color-surface)]/95 flex flex-col items-center justify-center p-4"
                    >
                      <p className="text-[var(--color-text)] font-bold mb-4 text-center">
                        Delete this project?
                      </p>
                      <div className="flex gap-2">
                        <motion.button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-4 py-2 rounded-lg bg-[var(--color-primary)]/20 text-[var(--color-text)] font-medium"
                          whileTap={{ scale: 0.95 }}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(project.id)}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium"
                          whileTap={{ scale: 0.95 }}
                        >
                          Delete
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Create new card - always shown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: projects.length * 0.05 }}
            >
              <Link href="/create">
                <div className="aspect-[4/5] rounded-2xl border-2 border-dashed border-[var(--color-primary)]/50 hover:border-[var(--color-primary)] transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group">
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

          {/* Empty state message */}
          {projects.length === 0 && (
            <motion.div
              className="mt-8 p-8 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/30 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-6xl mb-4 block">🎨</span>
              <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">
                No creations yet!
              </h2>
              <p className="text-[var(--color-text-muted)] mb-4">
                Start creating and your projects will automatically save here.
              </p>
              <Link href="/create">
                <motion.button
                  className="px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Creating!
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
