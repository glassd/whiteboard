export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  userId: string;
  points: Point[];
  color: string;
  brushSize: number;
  tool: 'pen' | 'eraser';
  timestamp: number;
}

export interface UserInfo {
  id: string;
  name: string;
  color: string;
}

export interface CursorPosition {
  userId: string;
  position: Point;
  userName: string;
  color: string;
}

export type Tool = 'pen' | 'eraser';

export interface ToolSettings {
  color: string;
  brushSize: number;
  tool: Tool;
}
