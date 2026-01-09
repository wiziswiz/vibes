'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  disabled?: boolean;
}

export function VoiceInput({
  onTranscript,
  onInterimTranscript,
  disabled = false,
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Detect silence and auto-stop
  const checkForSilence = useCallback(() => {
    if (!analyserRef.current || !isListening) return;

    const analyser = analyserRef.current;
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

    // If volume is very low (silence), start countdown to stop
    if (average < 10) {
      if (!silenceTimeoutRef.current) {
        silenceTimeoutRef.current = setTimeout(() => {
          stopRecording();
        }, 1500); // Stop after 1.5s of silence
      }
    } else {
      // Sound detected, clear silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    // Continue checking
    if (isListening) {
      requestAnimationFrame(checkForSilence);
    }
  }, [isListening]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio analysis for silence detection
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Clean up audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Process the audio
        if (audioChunksRef.current.length > 0) {
          setIsProcessing(true);
          onInterimTranscript?.('Processing your voice...');

          try {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: mediaRecorder.mimeType
            });

            // Send to Whisper API
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            const response = await fetch('/api/transcribe', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Transcription failed');
            }

            const data = await response.json();
            if (data.text && data.text.trim()) {
              onTranscript(data.text.trim());
            }
          } catch (error) {
            console.error('Transcription error:', error);
            onInterimTranscript?.('');
          } finally {
            setIsProcessing(false);
          }
        }
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsListening(true);

      // Start silence detection after a short delay
      setTimeout(() => {
        checkForSilence();
      }, 500);

    } catch (error) {
      console.error('Error starting recording:', error);
      setIsSupported(false);
    }
  }, [onTranscript, onInterimTranscript, checkForSilence]);

  const stopRecording = useCallback(() => {
    // Clear silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopRecording();
    } else if (!isProcessing) {
      startRecording();
    }
  }, [isListening, isProcessing, startRecording, stopRecording]);

  if (!isSupported) {
    return (
      <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[var(--color-surface)] border-2 border-red-500/50">
        <MicOff className="w-12 h-12 text-red-400" />
        <p className="text-center text-[var(--color-text-muted)]">
          Voice input is not supported in your browser.
          <br />
          Please allow microphone access!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Microphone Button */}
      <motion.button
        onClick={toggleListening}
        disabled={disabled || isProcessing}
        className={`relative flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ${
          isListening ? 'bg-red-500 animate-pulse-glow' : isProcessing ? 'bg-yellow-500' : 'bg-[var(--color-primary)] hover:scale-110'
        } ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        whileHover={disabled || isProcessing ? {} : { scale: 1.1 }}
        whileTap={disabled || isProcessing ? {} : { scale: 0.95 }}
        style={{
          boxShadow: isListening
            ? '0 0 30px rgba(239, 68, 68, 0.5)'
            : isProcessing
            ? '0 0 30px rgba(234, 179, 8, 0.5)'
            : '0 0 20px var(--color-primary)',
        }}
      >
        {isProcessing ? (
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        ) : (
          <Mic className={`w-10 h-10 text-white ${isListening ? 'recording-indicator' : ''}`} />
        )}

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
        {isProcessing ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-yellow-400 font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Understanding your words...</span>
            </div>
          </div>
        ) : isListening ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-red-400 font-bold">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Listening... (tap to stop)</span>
            </div>
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
