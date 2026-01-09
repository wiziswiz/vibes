'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Wand2, Mic, Sparkles, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/stores/workspace';
import { Mascot } from '@/components/ui/Mascot';
import { MagicBackground } from '@/components/ui/MagicBackground';

export default function HomePage() {
  const { theme } = useWorkspaceStore();
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited'>('happy');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const steps = [
    {
      icon: Mic,
      title: 'Speak Your Wish',
      description: 'Tell the wizard what you want to create',
      color: 'var(--color-accent-2)',
    },
    {
      icon: Wand2,
      title: 'Magic Happens',
      description: 'Watch the code spells appear',
      color: 'var(--color-primary)',
    },
    {
      icon: Eye,
      title: 'See It Live',
      description: 'Your creation comes to life!',
      color: 'var(--color-accent-3)',
    },
  ];

  const creationIdeas = [
    { emoji: '🌈', text: 'Rainbow explosions' },
    { emoji: '🚀', text: 'Flying spaceships' },
    { emoji: '🎮', text: 'Bouncy ball games' },
    { emoji: '🦋', text: 'Dancing butterflies' },
    { emoji: '⭐', text: 'Twinkling stars' },
    { emoji: '🎨', text: 'Color paintings' },
    { emoji: '🐱', text: 'Silly cats' },
    { emoji: '🌊', text: 'Ocean waves' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <MagicBackground />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative z-10">
        <div className="text-center max-w-4xl">
          {/* Mascot */}
          <motion.div
            className="mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            onHoverStart={() => setMascotMood('excited')}
            onHoverEnd={() => setMascotMood('happy')}
          >
            <Mascot size="xl" mood={mascotMood} />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h1 className="font-display text-7xl md:text-9xl font-bold mb-2">
              <span className="text-rainbow">VIBES</span>
            </h1>
            <motion.div
              className="flex items-center justify-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              <span className="text-lg md:text-xl text-[var(--color-text-muted)] font-display">
                Where Code Becomes Magic
              </span>
              <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
            </motion.div>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-2xl md:text-3xl text-[var(--color-text)] mb-10 font-body leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Say what you want to create, and watch your ideas come to life with{' '}
            <span className="text-[var(--color-accent)] font-semibold">real code spells!</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.8,
            }}
          >
            <Link href="/create">
              <motion.button
                className="btn-magic text-2xl px-12 py-6"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setMascotMood('excited')}
                onHoverEnd={() => setMascotMood('happy')}
              >
                <Wand2 className="w-8 h-8" />
                <span>Start Creating Magic!</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Fun hint for kids */}
          <motion.p
            className="mt-6 text-[var(--color-text-muted)] text-sm font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            For wizards ages 6 and up! No coding experience needed.
          </motion.p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-20 bg-[var(--color-surface)]/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold text-center mb-16 text-[var(--color-text)]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How The Magic Works
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  className="relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                >
                  {/* Connection line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[var(--color-primary)] to-transparent opacity-30" />
                  )}

                  <motion.div
                    className="card-magic text-center p-8"
                    whileHover={{ scale: 1.05, rotate: [-1, 1, 0] }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    {/* Step number */}
                    <motion.div
                      className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[var(--color-surface-elevated)] border-2 flex items-center justify-center font-display font-bold text-lg"
                      style={{ borderColor: step.color, color: step.color }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                    >
                      {index + 1}
                    </motion.div>

                    {/* Icon */}
                    <motion.div
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                      style={{ background: `${step.color}30` }}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="w-10 h-10" style={{ color: step.color }} />
                    </motion.div>

                    <h3 className="font-display text-2xl font-bold mb-3 text-[var(--color-text)]">
                      {step.title}
                    </h3>
                    <p className="text-[var(--color-text-muted)] font-body text-lg">
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Creation Ideas Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="font-display text-4xl md:text-5xl font-bold mb-4 text-[var(--color-text)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What Will You Create?
          </motion.h2>
          <motion.p
            className="text-xl text-[var(--color-text-muted)] mb-12 font-body"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Tap an idea or make up your own!
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {creationIdeas.map((idea, index) => (
              <Link href="/create" key={idea.text}>
                <motion.div
                  className="group flex items-center gap-3 px-6 py-4 rounded-2xl bg-[var(--color-surface)] border-2 border-transparent cursor-pointer font-body"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.1,
                    borderColor: 'var(--color-primary)',
                    boxShadow: '0 0 30px var(--glow-color)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="text-3xl"
                    whileHover={{ rotate: [0, -20, 20, 0], scale: 1.2 }}
                    transition={{ duration: 0.4 }}
                  >
                    {idea.emoji}
                  </motion.span>
                  <span className="text-lg font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                    {idea.text}
                  </span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 py-16 bg-[var(--color-surface)]/60 backdrop-blur-sm">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="mb-6"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Mascot size="lg" mood="excited" />
          </motion.div>

          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-[var(--color-text)]">
            Ready to Make Magic?
          </h2>
          <p className="text-xl text-[var(--color-text-muted)] mb-8 font-body">
            Your wizard adventure starts now!
          </p>

          <Link href="/create">
            <motion.button
              className="btn-magic text-xl"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-6 h-6" />
              <span>Let&apos;s Go!</span>
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-[var(--color-primary)]/20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--gradient-magic)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-[var(--color-text)]">
              VIBES
            </span>
          </div>
          <p className="text-[var(--color-text-muted)] text-sm font-body">
            Made with{' '}
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💜
            </motion.span>
            {' '}for young wizards everywhere
          </p>
          <div className="flex items-center gap-2">
            {['✨', '🌟', '💫', '⭐', '🌠'].map((star, i) => (
              <motion.span
                key={i}
                className="text-lg"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              >
                {star}
              </motion.span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
