'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImagePlus, X, Camera, Upload } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (imageData: string | null) => void;
  currentImage: string | null;
  disabled?: boolean;
}

export function ImageUpload({ onImageSelect, currentImage, disabled }: ImageUploadProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelect(result);
      setIsExpanded(false);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  const handleRemove = useCallback(() => {
    onImageSelect(null);
  }, [onImageSelect]);

  // If there's a current image, show small thumbnail with remove button
  if (currentImage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-primary)]"
      >
        <img
          src={currentImage}
          alt="Reference"
          className="w-8 h-8 rounded object-cover"
        />
        <span className="text-xs text-[var(--color-text-muted)]">Reference</span>
        <motion.button
          onClick={handleRemove}
          disabled={disabled}
          className="p-1 rounded-full hover:bg-red-500/20 text-red-400 disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-3 h-3" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="relative inline-block">
      {/* Camera button trigger */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all
          ${isExpanded
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-surface)] border border-[var(--color-primary)]/50 text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-text)]'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Camera className="w-4 h-4" />
        <span className="text-sm font-medium">Add Reference</span>
      </motion.button>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 p-4 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)] shadow-xl z-20 min-w-[250px]"
          >
            <p className="text-sm text-[var(--color-text)] font-medium mb-1">
              Add a reference image
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mb-3">
              Draw something, find a character, or snap a photo!
            </p>

            <div className="flex gap-2">
              <motion.button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Upload className="w-4 h-4" />
                Upload
              </motion.button>

              <motion.button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={disabled}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--color-accent)] text-white text-sm font-medium disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Camera className="w-4 h-4" />
                Camera
              </motion.button>
            </div>

            {/* Click outside to close */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute -top-1 -right-1 p-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-text-muted)]/30 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
}
