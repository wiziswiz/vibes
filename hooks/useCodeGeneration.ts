'use client';

import { useState, useCallback, useRef } from 'react';

export interface ErrorInfo {
  message: string;
  errorRef?: string;
  technicalError?: string;
}

interface UseCodeGenerationOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (code: string) => void;
  onError?: (error: string, errorInfo?: ErrorInfo) => void;
}

interface UseCodeGenerationResult {
  generate: (prompt: string, currentCode?: string, referenceImage?: string) => Promise<string>;
  isGenerating: boolean;
  error: string | null;
}

export function useCodeGeneration(
  options: UseCodeGenerationOptions = {}
): UseCodeGenerationResult {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to avoid recreating generate on every render when options change
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const generate = useCallback(
    async (prompt: string, currentCode?: string, referenceImage?: string): Promise<string> => {
      setIsGenerating(true);
      setError(null);
      let fullCode = '';

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            currentCode,
            isModification: !!currentCode,
            referenceImage,
          }),
        });

        if (!response.ok) {
          // Try to parse error response for reference code
          try {
            const errorData = await response.json();
            const errorInfo: ErrorInfo = {
              message: errorData.error || 'Failed to generate code',
              errorRef: errorData.errorRef,
              technicalError: errorData.technicalError,
            };
            setError(errorInfo.message);
            optionsRef.current.onError?.(errorInfo.message, errorInfo);
            return '';
          } catch {
            throw new Error('Failed to generate code');
          }
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;

            const data = line.slice(6);
            if (data === '[DONE]') {
              optionsRef.current.onComplete?.(fullCode);
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullCode += parsed.text;
                optionsRef.current.onChunk?.(parsed.text);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        optionsRef.current.onError?.(errorMessage);
      } finally {
        setIsGenerating(false);
      }

      return fullCode;
    },
    []
  );

  return { generate, isGenerating, error };
}
