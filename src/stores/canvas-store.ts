import { create } from 'zustand';
import type { Stroke, Tool } from '@/types';

interface CanvasState {
  // Tool settings
  color: string;
  brushSize: number;
  tool: Tool;

  // Strokes
  strokes: Stroke[];

  // History
  undoStack: Stroke[];
  redoStack: Stroke[];

  // Actions
  setColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setTool: (tool: Tool) => void;
  addStroke: (stroke: Stroke) => void;
  removeStroke: (strokeId: string) => void;
  undo: () => Stroke | undefined;
  redo: () => Stroke | undefined;
  clearCanvas: () => void;
  loadStrokes: (strokes: Stroke[]) => void;
  reset: () => void;
}

const DEFAULT_COLOR = '#000000';
const DEFAULT_BRUSH_SIZE = 4;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  color: DEFAULT_COLOR,
  brushSize: DEFAULT_BRUSH_SIZE,
  tool: 'pen',
  strokes: [],
  undoStack: [],
  redoStack: [],

  setColor: (color) => set({ color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setTool: (tool) => set({ tool }),

  addStroke: (stroke) =>
    set((state) => ({
      strokes: [...state.strokes, stroke],
      undoStack: [...state.undoStack, stroke],
      redoStack: [],
    })),

  removeStroke: (strokeId) =>
    set((state) => ({
      strokes: state.strokes.filter((s) => s.id !== strokeId),
    })),

  undo: () => {
    const { undoStack, strokes } = get();
    if (undoStack.length === 0) return undefined;

    const lastStroke = undoStack[undoStack.length - 1];
    set((state) => ({
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, lastStroke],
      strokes: strokes.filter((s) => s.id !== lastStroke.id),
    }));
    return lastStroke;
  },

  redo: () => {
    const { redoStack } = get();
    if (redoStack.length === 0) return undefined;

    const strokeToRedo = redoStack[redoStack.length - 1];
    set((state) => ({
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, strokeToRedo],
      strokes: [...state.strokes, strokeToRedo],
    }));
    return strokeToRedo;
  },

  clearCanvas: () =>
    set({
      strokes: [],
      undoStack: [],
      redoStack: [],
    }),

  loadStrokes: (strokes) =>
    set({
      strokes,
      undoStack: [],
      redoStack: [],
    }),

  reset: () =>
    set({
      color: DEFAULT_COLOR,
      brushSize: DEFAULT_BRUSH_SIZE,
      tool: 'pen',
      strokes: [],
      undoStack: [],
      redoStack: [],
    }),
}));
