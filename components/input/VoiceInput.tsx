'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  disabled?: boolean;
}

// Extend Window interface for Speech Recognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

type SpeechRecognitionType = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
};

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognitionType;
    SpeechRecognition: new () => SpeechRecognitionType;
  }
}

export function VoiceInput({
  onTranscript,
  onInterimTranscript,
  disabled = false,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSpokenRef = useRef(false);
  const accumulatedTranscriptRef = useRef('');

  // Check for browser support
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }

      // Clear any existing silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      if (interim) {
        hasSpokenRef.current = true;
        setInterimText(interim);
        onInterimTranscript?.(interim);
      }

      if (finalTranscript) {
        hasSpokenRef.current = true;
        // Accumulate the transcript
        accumulatedTranscriptRef.current += ' ' + finalTranscript;
        setInterimText('');
      }

      // After any speech activity, set a silence timeout to auto-stop
      // This gives the user time to continue speaking but stops after a pause
      if (hasSpokenRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognition.stop();
          }
        }, finalTranscript ? 1200 : 2000); // Shorter timeout after final result
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
      // Clear timeout on end
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      // Submit accumulated transcript when stopping
      const fullTranscript = accumulatedTranscriptRef.current.trim();
      if (fullTranscript) {
        onTranscript(fullTranscript);
        accumulatedTranscriptRef.current = '';
      }
      hasSpokenRef.current = false;
    };

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [onTranscript, onInterimTranscript]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Reset state for new recording
      setInterimText('');
      hasSpokenRef.current = false;
      accumulatedTranscriptRef.current = '';
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      recognitionRef.current.start();
    }
  }, [isListening]);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--color-surface)] border-2 border-red-500/50">
        <MicOff className="w-12 h-12 text-red-400" />
        <p className="text-center text-[var(--color-text-muted)]">
          Voice input is not supported in your browser.
          <br />
          Try using Chrome or Edge!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Microphone Button */}
      <motion.button
        onClick={toggleListening}
        disabled={disabled}
        className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
          isListening ? 'bg-red-500 animate-pulse-glow' : 'bg-[var(--color-primary)] hover:scale-110'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        whileHover={disabled ? {} : { scale: 1.1 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        style={{
          boxShadow: isListening
            ? '0 0 30px rgba(239, 68, 68, 0.5)'
            : '0 0 20px var(--color-primary)',
        }}
      >
        <Mic className={`w-10 h-10 text-white ${isListening ? 'recording-indicator' : ''}`} />

        {/* Ripple effect when listening */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-red-400"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Status text */}
      <motion.div
        className="text-center min-h-[60px]"
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
      >
        {isListening ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Listening...</span>
            </div>
            {interimText && (
              <motion.p
                className="text-lg text-[var(--color-text)] max-w-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.7, y: 0 }}
              >
                &ldquo;{interimText}&rdquo;
              </motion.p>
            )}
          </div>
        ) : (
          <p className="text-[var(--color-text-muted)] text-lg">
            Tap the microphone and tell me what to create! 🎨
          </p>
        )}
      </motion.div>

      {/* Instructions for kids */}
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {['🎮 A game', '🌈 Rainbow art', '⭐ Dancing stars', '🐱 A cat'].map(
          (example) => (
            <motion.span
              key={example}
              className="px-3 py-1 rounded-full bg-[var(--color-surface)] text-sm text-[var(--color-text-muted)] border border-[var(--color-primary)]/30"
              whileHover={{ scale: 1.05, borderColor: 'var(--color-primary)' }}
            >
              {example}
            </motion.span>
          )
        )}
      </div>
    </div>
  );
}
