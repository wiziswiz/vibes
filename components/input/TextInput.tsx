'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Loader2 } from 'lucide-react';

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

export function TextInput({
  onSubmit,
  disabled = false,
  placeholder = 'Tell me what to create...',
  isLoading = false,
}: TextInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [text]);

  const handleSubmit = () => {
    if (!text.trim() || disabled || isLoading) return;
    onSubmit(text.trim());
    setText('');
  };

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  const canSubmit = text.trim() && !disabled && !isLoading;

  const examples = [
    { emoji: '🎮', text: 'Make a bouncing ball game' },
    { emoji: '🌈', text: 'Draw a colorful rainbow' },
    { emoji: '⭐', text: 'Create twinkling stars' },
    { emoji: '🐱', text: 'Make a dancing cat' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl">
      {/* Main input area */}
      <motion.div
        className="relative flex items-end gap-3 p-4 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)] focus-within:border-[var(--color-accent)] focus-within:shadow-lg transition-all"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)',
        }}
      >
        {/* Sparkle decoration */}
        <motion.div
          className="absolute -top-2 -left-2 text-2xl"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
        </motion.div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isLoading}
          className="flex-1 bg-transparent text-[var(--color-text)] text-xl font-medium resize-none outline-none placeholder:text-[var(--color-text-muted)] min-h-[48px] max-h-[150px]"
          rows={1}
        />

        {/* Submit button */}
        <motion.button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`flex items-center justify-center w-14 h-14 rounded-full transition-all ${
            canSubmit
              ? 'bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] cursor-pointer'
              : 'bg-[var(--color-surface)] border-2 border-[var(--color-text-muted)] cursor-not-allowed opacity-50'
          }`}
          whileHover={canSubmit ? { scale: 1.1 } : {}}
          whileTap={canSubmit ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Send className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </motion.div>

      {/* Example prompts */}
      <div className="flex flex-col gap-2">
        <p className="text-sm text-[var(--color-text-muted)] text-center">
          Try saying something like:
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {examples.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setText(example.text)}
              className="px-4 py-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-primary)]/30 text-[var(--color-text)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{example.emoji}</span>
              <span className="text-sm font-medium">{example.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
