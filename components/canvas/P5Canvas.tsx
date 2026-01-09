'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface P5CanvasProps {
  code: string;
  isPlaying: boolean;
  onError?: (error: string) => void;
  width?: number;
  height?: number;
}

function createIframeContent(sketchCode: string, canvasWidth: number, canvasHeight: number): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: transparent;
      overflow: hidden;
    }
    canvas {
      border-radius: 12px;
      display: block;
    }
  </style>
</head>
<body>
  <script>
    // Store canvas dimensions for use in sketches
    window.__canvasWidth = ${canvasWidth};
    window.__canvasHeight = ${canvasHeight};

    // Safety wrapper
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      window.parent.postMessage({
        type: 'error',
        message: msg,
        line: lineNo
      }, '*');
      return true;
    };

    // Override console to send to parent
    const originalLog = console.log;
    console.log = function(...args) {
      originalLog.apply(console, args);
      window.parent.postMessage({
        type: 'log',
        message: args.join(' ')
      }, '*');
    };

    // Listen for resize messages from parent
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'resize') {
        window.__canvasWidth = event.data.width;
        window.__canvasHeight = event.data.height;
        if (typeof resizeCanvas === 'function') {
          resizeCanvas(event.data.width, event.data.height);
        }
      }
    });

    try {
      // User's p5.js code
      ${sketchCode}
    } catch (e) {
      window.parent.postMessage({
        type: 'error',
        message: e.message
      }, '*');
    }

    // Notify parent when sketch is ready
    window.addEventListener('load', function() {
      window.parent.postMessage({ type: 'ready' }, '*');
    });
  </script>
</body>
</html>`;
}

export function P5Canvas({
  code,
  isPlaying,
  onError,
  width = 400,
  height = 400,
}: P5CanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const prevCodeRef = useRef(code);
  const dimensionsRef = useRef({ width, height });

  // Handle messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, message, line } = event.data;

      if (type === 'error' && onError) {
        onError(`Error${line ? ` on line ${line}` : ''}: ${message}`);
      } else if (type === 'ready') {
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onError]);

  // Update iframe content when code changes
  useEffect(() => {
    if (!iframeRef.current) return;

    // Only reload iframe if code actually changed
    if (prevCodeRef.current !== code) {
      setIsLoading(true);
      iframeRef.current.srcdoc = createIframeContent(code, width, height);
      prevCodeRef.current = code;
    }
  }, [code, width, height]);

  // Update dimensions ref
  useEffect(() => {
    dimensionsRef.current = { width, height };
  }, [width, height]);

  // Send resize message to iframe when dimensions change (without reloading)
  useEffect(() => {
    if (!iframeRef.current?.contentWindow || isLoading) return;

    try {
      iframeRef.current.contentWindow.postMessage({
        type: 'resize',
        width,
        height
      }, '*');
    } catch {
      // Cross-origin restrictions may prevent this
    }
  }, [width, height, isLoading]);

  // Handle play/pause by controlling iframe
  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;

    try {
      const iframeWindow = iframeRef.current.contentWindow as Window & {
        loop?: () => void;
        noLoop?: () => void;
      };

      if (isPlaying) {
        iframeWindow.loop?.();
      } else {
        iframeWindow.noLoop?.();
      }
    } catch {
      // Cross-origin restrictions may prevent this
    }
  }, [isPlaying]);

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-[var(--color-surface)] border-4 border-[var(--color-primary)]"
      style={{ width, height }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-surface)] z-10">
          <motion.div
            className="text-4xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            ✨
          </motion.div>
        </div>
      )}

      {/* p5.js iframe */}
      <iframe
        ref={iframeRef}
        title="Creation Canvas"
        sandbox="allow-scripts"
        className="w-full h-full border-0"
        style={{ background: 'transparent' }}
      />

      {/* Play/Pause indicator */}
      {!isPlaying && !isLoading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            className="text-6xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            ⏸️
          </motion.span>
        </motion.div>
      )}
    </motion.div>
  );
}
