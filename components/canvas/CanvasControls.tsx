'use client';

import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Download,
} from 'lucide-react';

interface CanvasControlsProps {
  isPlaying: boolean;
  isFullscreen: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onFullscreen: () => void;
  onDownload?: () => void;
}

export function CanvasControls({
  isPlaying,
  isFullscreen,
  onPlayPause,
  onReset,
  onFullscreen,
  onDownload,
}: CanvasControlsProps) {
  const buttonClass =
    'flex items-center justify-center w-14 h-14 rounded-full bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-text)] hover:bg-[var(--color-primary)] transition-all duration-200 hover:scale-110';

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Play/Pause */}
      <motion.button
        className={`${buttonClass} ${isPlaying ? 'bg-[var(--color-primary)]' : ''}`}
        onClick={onPlayPause}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6 ml-1" />
        )}
      </motion.button>

      {/* Reset */}
      <motion.button
        className={buttonClass}
        onClick={onReset}
        whileHover={{ scale: 1.1, rotate: -180 }}
        whileTap={{ scale: 0.95 }}
        title="Reset"
      >
        <RotateCcw className="w-6 h-6" />
      </motion.button>

      {/* Fullscreen */}
      <motion.button
        className={buttonClass}
        onClick={onFullscreen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
      >
        {isFullscreen ? (
          <Minimize2 className="w-6 h-6" />
        ) : (
          <Maximize2 className="w-6 h-6" />
        )}
      </motion.button>

      {/* Download (optional) */}
      {onDownload && (
        <motion.button
          className={buttonClass}
          onClick={onDownload}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Download"
        >
          <Download className="w-6 h-6" />
        </motion.button>
      )}
    </motion.div>
  );
}
