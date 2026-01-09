// Visual block types for drag-and-drop coding

export type BlockCategory = 'motion' | 'looks' | 'sound' | 'events' | 'control' | 'variables';

export interface Block {
  id: string;
  type: BlockType;
  category: BlockCategory;
  label: string;
  emoji: string;
  description: string;
  template: string; // Code template with placeholders
  inputs?: BlockInput[];
}

export interface BlockInput {
  name: string;
  type: 'number' | 'string' | 'color' | 'dropdown';
  default: string | number;
  options?: string[]; // For dropdown type
}

export type BlockType =
  // Motion
  | 'move'
  | 'turn'
  | 'goto'
  | 'bounce'
  // Looks
  | 'setColor'
  | 'setSize'
  | 'show'
  | 'hide'
  // Sound
  | 'playSound'
  | 'stopSound'
  // Events
  | 'onClick'
  | 'onKey'
  | 'onStart'
  // Control
  | 'wait'
  | 'repeat'
  | 'forever'
  | 'ifThen';

export const availableBlocks: Block[] = [
  // Motion blocks
  {
    id: 'move',
    type: 'move',
    category: 'motion',
    label: 'Move',
    emoji: '➡️',
    description: 'Move forward',
    template: 'x += {{steps}};',
    inputs: [{ name: 'steps', type: 'number', default: 10 }],
  },
  {
    id: 'turn',
    type: 'turn',
    category: 'motion',
    label: 'Turn',
    emoji: '🔄',
    description: 'Turn around',
    template: 'angle += {{degrees}};',
    inputs: [{ name: 'degrees', type: 'number', default: 15 }],
  },
  {
    id: 'goto',
    type: 'goto',
    category: 'motion',
    label: 'Go To',
    emoji: '📍',
    description: 'Go to position',
    template: 'x = {{x}}; y = {{y}};',
    inputs: [
      { name: 'x', type: 'number', default: 200 },
      { name: 'y', type: 'number', default: 200 },
    ],
  },
  {
    id: 'bounce',
    type: 'bounce',
    category: 'motion',
    label: 'Bounce',
    emoji: '⚡',
    description: 'Bounce off edges',
    template: 'if (x < 0 || x > width) speedX *= -1;\nif (y < 0 || y > height) speedY *= -1;',
  },
  // Looks blocks
  {
    id: 'setColor',
    type: 'setColor',
    category: 'looks',
    label: 'Set Color',
    emoji: '🎨',
    description: 'Change color',
    template: 'fill("{{color}}");',
    inputs: [{ name: 'color', type: 'color', default: '#FF6B6B' }],
  },
  {
    id: 'setSize',
    type: 'setSize',
    category: 'looks',
    label: 'Set Size',
    emoji: '📏',
    description: 'Change size',
    template: 'size = {{size}};',
    inputs: [{ name: 'size', type: 'number', default: 50 }],
  },
  // Control blocks
  {
    id: 'wait',
    type: 'wait',
    category: 'control',
    label: 'Wait',
    emoji: '⏳',
    description: 'Wait some time',
    template: '// Wait {{seconds}} seconds',
    inputs: [{ name: 'seconds', type: 'number', default: 1 }],
  },
  {
    id: 'repeat',
    type: 'repeat',
    category: 'control',
    label: 'Repeat',
    emoji: '🔁',
    description: 'Repeat actions',
    template: 'for (let i = 0; i < {{times}}; i++) {\n  // actions here\n}',
    inputs: [{ name: 'times', type: 'number', default: 10 }],
  },
];

export interface PlacedBlock extends Block {
  instanceId: string;
  values: Record<string, string | number>;
  position: { x: number; y: number };
}
