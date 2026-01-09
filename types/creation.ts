// Types for creations and projects in VIBES

export interface Creation {
  id: string;
  title: string;
  description?: string;
  code: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreationState {
  currentCode: string;
  isRunning: boolean;
  error: string | null;
  history: string[];
}

export type CreationType = 'game' | 'animation' | 'art' | 'story' | 'other';

export interface CreationMetadata {
  type: CreationType;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}
