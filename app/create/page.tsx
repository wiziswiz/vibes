'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Copy, Trash2, Sparkles, Check } from 'lucide-react';

import { Header } from '@/components/layout/Header';
import { saveProject, SavedProject } from '@/lib/storage';
import { P5Canvas } from '@/components/canvas/P5Canvas';
import { CanvasControls } from '@/components/canvas/CanvasControls';
import { CodePreview } from '@/components/canvas/CodePreview';
import { VoiceInput } from '@/components/input/VoiceInput';
import { TextInput } from '@/components/input/TextInput';
import { InputSwitcher } from '@/components/input/InputSwitcher';
import { ImageUpload } from '@/components/input/ImageUpload';
import { ThemePicker } from '@/components/ui/ThemePicker';
import { LoadingAnimation } from '@/components/ui/LoadingAnimation';

import { useWorkspaceStore } from '@/stores/workspace';
import { useCreationStore } from '@/stores/creation';
import { useCodeGeneration, ErrorInfo } from '@/hooks/useCodeGeneration';

export default function CreatePage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamingCode, setStreamingCode] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorInfo | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [lastPrompt, setLastPrompt] = useState('');

  // Undo/Redo history
  const [codeHistory, setCodeHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Workspace store
  const {
    theme,
    setTheme,
    inputMode,
    setInputMode,
    showCode,
    toggleShowCode,
    isPlaying,
    togglePlaying,
    isGenerating,
    setIsGenerating,
  } = useWorkspaceStore();

  // Creation store
  const { code, setCode, error, setError, reset } = useCreationStore();

  // Code generation hook
  const { generate } = useCodeGeneration({
    onChunk: (chunk) => {
      setStreamingCode((prev) => prev + chunk);
    },
    onComplete: (fullCode) => {
      setCode(fullCode);
      setStreamingCode('');
      setIsGenerating(false);

      // Add to history (truncate any redo history)
      if (fullCode) {
        setCodeHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          return [...newHistory, fullCode];
        });
        setHistoryIndex(prev => prev + 1);
      }

      // Auto-save the project (silent, no popups)
      if (fullCode && lastPrompt) {
        const saved = saveProject(lastPrompt, fullCode, currentProjectId || undefined);
        setCurrentProjectId(saved.id);

        // Show subtle saved indicator
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
      }
    },
    onError: (err, info) => {
      setError(err);
      setErrorInfo(info || { message: err });
      setIsGenerating(false);
    },
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load project from sessionStorage (coming from Gallery)
  useEffect(() => {
    const loadedProject = sessionStorage.getItem('vibes_load_project');
    if (loadedProject) {
      try {
        const project: SavedProject = JSON.parse(loadedProject);
        setCode(project.code);
        setCurrentProjectId(project.id);
        setLastPrompt(project.prompt);
        // Initialize history with loaded project
        setCodeHistory([project.code]);
        setHistoryIndex(0);
        // Clear sessionStorage after loading
        sessionStorage.removeItem('vibes_load_project');
      } catch (e) {
        console.error('Failed to load project from sessionStorage:', e);
      }
    }
  }, [setCode]);

  // Undo/Redo computed values
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < codeHistory.length - 1;

  // Undo handler
  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setCode(codeHistory[newIndex]);
  }, [canUndo, historyIndex, codeHistory, setCode]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setCode(codeHistory[newIndex]);
  }, [canRedo, historyIndex, codeHistory, setCode]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd/Ctrl + Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          // Redo: Cmd+Shift+Z
          e.preventDefault();
          handleRedo();
        } else {
          // Undo: Cmd+Z
          e.preventDefault();
          handleUndo();
        }
      }
      // Also support Cmd/Ctrl + Y for redo (Windows convention)
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Handle prompt submission
  const handlePromptSubmit = useCallback(
    async (prompt: string) => {
      setIsGenerating(true);
      setStreamingCode('');
      setError(null);
      setErrorInfo(null);
      setLastPrompt(prompt);

      const isModification = code !== '' && !code.includes('Welcome to VIBES');
      // If starting fresh (not a modification), clear the project ID
      if (!isModification) {
        setCurrentProjectId(null);
      }
      await generate(prompt, isModification ? code : undefined, referenceImage || undefined);
    },
    [code, generate, setIsGenerating, setError, referenceImage]
  );

  // Handle refinement submission
  const handleRefinementSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!refinementPrompt.trim() || isGenerating) return;

      setIsGenerating(true);
      setStreamingCode('');
      setError(null);
      setErrorInfo(null);

      await generate(refinementPrompt, code, referenceImage || undefined);
      setRefinementPrompt('');
    },
    [refinementPrompt, code, generate, setIsGenerating, setError, isGenerating, referenceImage]
  );

  // Handle start fresh
  const handleStartFresh = useCallback(() => {
    reset();
    setStreamingCode('');
    setErrorInfo(null);
    setRefinementPrompt('');
    setReferenceImage(null);
    setCurrentProjectId(null);
    setLastPrompt('');
    // Clear undo/redo history
    setCodeHistory([]);
    setHistoryIndex(-1);
  }, [reset]);

  // Dismiss error
  const handleDismissError = useCallback(() => {
    setError(null);
    setErrorInfo(null);
  }, [setError]);

  // Copy error reference
  const handleCopyErrorRef = useCallback(async () => {
    if (errorInfo?.errorRef) {
      await navigator.clipboard.writeText(errorInfo.errorRef);
    }
  }, [errorInfo]);

  // Handle fullscreen toggle
  function handleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  }

  // Handle reset
  function handleReset(): void {
    reset();
    setStreamingCode('');
  }

  // Display code prioritizes streaming content when generating
  const displayCode = isGenerating && streamingCode ? streamingCode : code;

  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: canvasSize.width,
      startHeight: canvasSize.height,
    };
  }, [canvasSize]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;

      const deltaX = e.clientX - resizeRef.current.startX;
      const deltaY = e.clientY - resizeRef.current.startY;

      // Use the larger delta to maintain aspect ratio, or allow free resize
      const newWidth = Math.max(200, Math.min(800, resizeRef.current.startWidth + deltaX));
      const newHeight = Math.max(200, Math.min(800, resizeRef.current.startHeight + deltaY));

      setCanvasSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSettingsClick={() => setSettingsOpen(true)} />

      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6">
        {/* Left side - Canvas and Controls */}
        <motion.div
          className="flex flex-col items-center gap-6 lg:w-1/2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Canvas */}
          <div className="relative">
            {isGenerating && !streamingCode ? (
              <div
                className="flex items-center justify-center rounded-2xl bg-[var(--color-surface)] border-4 border-[var(--color-primary)]"
                style={{ width: canvasSize.width, height: canvasSize.height }}
              >
                <LoadingAnimation />
              </div>
            ) : (
              <P5Canvas
                code={displayCode}
                isPlaying={isPlaying}
                onError={setError}
                width={canvasSize.width}
                height={canvasSize.height}
              />
            )}

            {/* Resize Handle */}
            <motion.div
              onMouseDown={handleResizeStart}
              className={`absolute -bottom-3 -right-3 w-8 h-8 rounded-lg bg-[var(--color-primary)] cursor-se-resize flex items-center justify-center shadow-lg ${isResizing ? 'scale-110' : ''}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Drag to resize"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                className="text-white"
                fill="currentColor"
              >
                <path d="M12 2L2 12M8 2L2 8M12 6L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </motion.div>

            {/* Size indicator while resizing */}
            <AnimatePresence>
              {isResizing && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold"
                >
                  {canvasSize.width} × {canvasSize.height}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Saved indicator - subtle, auto-fades */}
            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -10 }}
                  className="absolute -top-3 -right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-lg"
                >
                  <Check className="w-3 h-3" />
                  Saved
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Canvas Controls */}
          <CanvasControls
            isPlaying={isPlaying}
            isFullscreen={isFullscreen}
            onPlayPause={togglePlaying}
            onReset={handleReset}
            onFullscreen={handleFullscreen}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

          {/* Error display - persistent until dismissed */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="w-full max-w-[500px] p-4 rounded-xl bg-red-500/20 border-2 border-red-500"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-red-200 font-medium">{error}</p>
                    {errorInfo?.errorRef && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-red-300/70">
                          Reference: {errorInfo.errorRef}
                        </span>
                        <motion.button
                          onClick={handleCopyErrorRef}
                          className="p-1 rounded hover:bg-red-500/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Copy reference code"
                        >
                          <Copy className="w-3 h-3 text-red-300" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  <motion.button
                    onClick={handleDismissError}
                    className="p-1 rounded-lg hover:bg-red-500/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-red-300" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Refinement input - shows when there's existing code */}
          {code && !code.includes('Welcome to VIBES') && !isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[500px]"
            >
              <form onSubmit={handleRefinementSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={refinementPrompt}
                  onChange={(e) => setRefinementPrompt(e.target.value)}
                  placeholder="Make it better... (e.g., 'add more colors', 'make it faster')"
                  className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-primary)]/50 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors text-sm"
                />
                <motion.button
                  type="submit"
                  disabled={!refinementPrompt.trim()}
                  className="px-4 py-3 rounded-xl bg-[var(--color-accent)] text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Sparkles className="w-4 h-4" />
                  Improve
                </motion.button>
              </form>

              {/* Start Fresh button */}
              <motion.button
                onClick={handleStartFresh}
                className="mt-3 w-full px-4 py-2 rounded-xl bg-[var(--color-surface)] border-2 border-[var(--color-text-muted)]/30 text-[var(--color-text-muted)] font-medium flex items-center justify-center gap-2 hover:border-red-400 hover:text-red-400 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Trash2 className="w-4 h-4" />
                Start Fresh
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Right side - Input and Code */}
        <motion.div
          className="flex flex-col gap-6 lg:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Input Mode Switcher */}
          <div className="flex justify-center">
            <InputSwitcher currentMode={inputMode} onModeChange={setInputMode} />
          </div>

          {/* Input Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 rounded-2xl bg-[var(--color-surface)]/50">
            <AnimatePresence mode="wait">
              {inputMode === 'voice' && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full flex justify-center"
                >
                  <VoiceInput
                    onTranscript={handlePromptSubmit}
                    disabled={isGenerating}
                  />
                </motion.div>
              )}

              {inputMode === 'text' && (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full flex justify-center"
                >
                  <TextInput
                    onSubmit={handlePromptSubmit}
                    disabled={isGenerating}
                    isLoading={isGenerating}
                  />
                </motion.div>
              )}

              {inputMode === 'blocks' && (
                <motion.div
                  key="blocks"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full text-center"
                >
                  <p className="text-[var(--color-text-muted)] text-lg">
                    Block mode coming soon! 🧱
                  </p>
                  <p className="text-[var(--color-text-muted)] text-sm mt-2">
                    Try voice or text input for now.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reference Image - subtle button below input */}
            <div className="mt-4">
              <ImageUpload
                onImageSelect={setReferenceImage}
                currentImage={referenceImage}
                disabled={isGenerating}
              />
            </div>
          </div>

          {/* Code Preview */}
          <CodePreview
            code={displayCode}
            isVisible={showCode}
            onToggle={toggleShowCode}
            isStreaming={isGenerating && !!streamingCode}
          />
        </motion.div>
      </main>

      {/* Settings Panel */}
      <AnimatePresence>
        {settingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setSettingsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--color-surface)] border-l-2 border-[var(--color-primary)] p-6 z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Settings
                </h2>
                <motion.button
                  onClick={() => setSettingsOpen(false)}
                  className="p-2 rounded-xl hover:bg-[var(--color-background)] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6 text-[var(--color-text)]" />
                </motion.button>
              </div>

              <div className="space-y-8">
                <ThemePicker
                  currentTheme={theme}
                  onThemeChange={setTheme}
                />

                {/* More settings can be added here */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
