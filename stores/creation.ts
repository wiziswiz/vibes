import { create } from 'zustand';

interface CreationState {
  // Current code
  code: string;
  setCode: (code: string) => void;
  appendCode: (chunk: string) => void;

  // Code history for undo
  history: string[];
  historyIndex: number;
  pushHistory: (code: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  // Error state
  error: string | null;
  setError: (error: string | null) => void;

  // Creation metadata
  title: string;
  setTitle: (title: string) => void;

  // Reset
  reset: () => void;
}

const DEFAULT_CODE = `// Welcome to VIBES! 🎨
// Tell me what you want to create!

function setup() {
  createCanvas(400, 400);
  background('#1E1832');
}

function draw() {
  // Your creation will appear here!
  fill('#8B5CF6');
  noStroke();
  ellipse(width/2, height/2, 100, 100);
}
`;

export const useCreationStore = create<CreationState>()((set, get) => ({
  // Current code
  code: DEFAULT_CODE,
  setCode: (code) => {
    const { pushHistory } = get();
    pushHistory(get().code);
    set({ code, error: null });
  },
  appendCode: (chunk) => set((state) => ({ code: state.code + chunk })),

  // History
  history: [],
  historyIndex: -1,
  pushHistory: (code) =>
    set((state) => ({
      history: [...state.history.slice(0, state.historyIndex + 1), code],
      historyIndex: state.historyIndex + 1,
    })),
  undo: () => {
    const { history, historyIndex, code } = get();
    if (historyIndex >= 0) {
      set({
        code: history[historyIndex],
        historyIndex: historyIndex - 1,
      });
    }
  },
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({
        code: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
      });
    }
  },
  canUndo: () => get().historyIndex >= 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // Error
  error: null,
  setError: (error) => set({ error }),

  // Metadata
  title: 'My Creation',
  setTitle: (title) => set({ title }),

  // Reset
  reset: () =>
    set({
      code: DEFAULT_CODE,
      history: [],
      historyIndex: -1,
      error: null,
      title: 'My Creation',
    }),
}));
