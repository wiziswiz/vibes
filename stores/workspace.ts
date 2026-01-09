import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeName, defaultTheme } from '@/types/themes';

export type InputMode = 'voice' | 'text' | 'blocks';

interface WorkspaceState {
  // Theme
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;

  // Input mode
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;

  // Code visibility
  showCode: boolean;
  toggleShowCode: () => void;
  setShowCode: (show: boolean) => void;

  // Canvas state
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  togglePlaying: () => void;

  // Current prompt/description
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;

  // Generation state
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      // Theme
      theme: defaultTheme,
      setTheme: (theme) => set({ theme }),

      // Input mode
      inputMode: 'voice',
      setInputMode: (inputMode) => set({ inputMode }),

      // Code visibility
      showCode: false,
      toggleShowCode: () => set((state) => ({ showCode: !state.showCode })),
      setShowCode: (showCode) => set({ showCode }),

      // Canvas state
      isPlaying: true,
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),

      // Current prompt
      currentPrompt: '',
      setCurrentPrompt: (currentPrompt) => set({ currentPrompt }),

      // Generation state
      isGenerating: false,
      setIsGenerating: (isGenerating) => set({ isGenerating }),

      // Sidebar
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'vibes-workspace',
      partialize: (state) => ({
        theme: state.theme,
        inputMode: state.inputMode,
        showCode: state.showCode,
      }),
    }
  )
);
