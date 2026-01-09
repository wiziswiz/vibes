'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Code2, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodePreviewProps {
  code: string;
  isVisible: boolean;
  onToggle: () => void;
  isStreaming?: boolean;
}

export function CodePreview({
  code,
  isVisible,
  onToggle,
  isStreaming = false,
}: CodePreviewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Custom theme that's more colorful and kid-friendly
  const customStyle = {
    ...vscDarkPlus,
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: 'transparent',
      margin: 0,
      padding: '1rem',
      fontSize: '0.95rem',
      lineHeight: '1.6',
      fontFamily: 'var(--font-fira-code), monospace',
    },
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      background: 'transparent',
      fontFamily: 'var(--font-fira-code), monospace',
    },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-text)] font-bold mb-3 hover:bg-[var(--color-primary)] transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Code2 className="w-5 h-5" />
        <span>Magic Spells</span>
        {isVisible ? (
          <EyeOff className="w-5 h-5 ml-auto" />
        ) : (
          <Eye className="w-5 h-5 ml-auto" />
        )}
      </motion.button>

      {/* Code Panel */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-hidden"
          >
            <div className="relative h-full rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-primary)]/30">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <span className="text-sm font-bold text-[var(--color-text-muted)]">
                    Your Code Spells
                  </span>
                  {isStreaming && (
                    <motion.span
                      className="inline-block w-2 h-4 bg-[var(--color-primary)] rounded"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Copy button */}
                <motion.button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[var(--color-background)] text-[var(--color-text-muted)] text-sm hover:text-[var(--color-text)] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Code content */}
              <div className="overflow-auto max-h-[400px]">
                <SyntaxHighlighter
                  language="javascript"
                  style={customStyle}
                  showLineNumbers
                  lineNumberStyle={{
                    color: 'var(--color-text-muted)',
                    opacity: 0.5,
                    minWidth: '2.5em',
                    paddingRight: '1em',
                    textAlign: 'right',
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>

              {/* Streaming indicator */}
              {isStreaming && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)]"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  style={{ backgroundSize: '200% 100%' }}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
