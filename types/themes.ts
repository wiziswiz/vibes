// Theme definitions for VIBES workspace

export type ThemeName = 'space' | 'ocean' | 'forest' | 'candy' | 'sunset';

export interface Theme {
  name: ThemeName;
  displayName: string;
  emoji: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
  };
  gradient: string;
}

export const themes: Record<ThemeName, Theme> = {
  space: {
    name: 'space',
    displayName: 'Space Adventure',
    emoji: '🚀',
    colors: {
      primary: '#8B5CF6',
      secondary: '#6366F1',
      accent: '#F59E0B',
      background: '#0F0B1A',
      surface: '#1E1832',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
    },
    gradient: 'linear-gradient(135deg, #0F0B1A 0%, #1E1832 50%, #2D1F4A 100%)',
  },
  ocean: {
    name: 'ocean',
    displayName: 'Ocean Explorer',
    emoji: '🐠',
    colors: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#F97316',
      background: '#0C1929',
      surface: '#1E3A5F',
      text: '#F0F9FF',
      textMuted: '#7DD3FC',
    },
    gradient: 'linear-gradient(135deg, #0C1929 0%, #1E3A5F 50%, #0E4D64 100%)',
  },
  forest: {
    name: 'forest',
    displayName: 'Magical Forest',
    emoji: '🌲',
    colors: {
      primary: '#22C55E',
      secondary: '#16A34A',
      accent: '#FACC15',
      background: '#0D1F12',
      surface: '#1A3D22',
      text: '#F0FDF4',
      textMuted: '#86EFAC',
    },
    gradient: 'linear-gradient(135deg, #0D1F12 0%, #1A3D22 50%, #14532D 100%)',
  },
  candy: {
    name: 'candy',
    displayName: 'Candy Land',
    emoji: '🍭',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#8B5CF6',
      background: '#1F1020',
      surface: '#3D1F3D',
      text: '#FDF2F8',
      textMuted: '#F9A8D4',
    },
    gradient: 'linear-gradient(135deg, #1F1020 0%, #3D1F3D 50%, #581C52 100%)',
  },
  sunset: {
    name: 'sunset',
    displayName: 'Sunset Beach',
    emoji: '🌅',
    colors: {
      primary: '#F97316',
      secondary: '#FB923C',
      accent: '#EAB308',
      background: '#1C1412',
      surface: '#3D2820',
      text: '#FFF7ED',
      textMuted: '#FDBA74',
    },
    gradient: 'linear-gradient(135deg, #1C1412 0%, #3D2820 50%, #7C2D12 100%)',
  },
};

export const defaultTheme: ThemeName = 'space';
