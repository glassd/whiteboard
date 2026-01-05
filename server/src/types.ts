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

export interface Room {
  id: string;
  strokes: Stroke[];
  users: Map<string, UserInfo>;
  createdAt: Date;
  lastActivity: Date;
}

export interface ClientToServerEvents {
  'room:join': (data: { roomId: string; user: UserInfo }) => void;
  'room:leave': (data: { roomId: string }) => void;
  'draw:stroke': (data: { roomId: string; stroke: Stroke }) => void;
  'draw:undo': (data: { roomId: string; strokeId: string }) => void;
  'draw:redo': (data: { roomId: string; stroke: Stroke }) => void;
  'draw:clear': (data: { roomId: string }) => void;
  'presence:cursor': (data: { roomId: string; position: Point }) => void;
}

export interface ServerToClientEvents {
  'room:state': (data: { strokes: Stroke[]; users: UserInfo[] }) => void;
  'room:user-joined': (data: { user: UserInfo }) => void;
  'room:user-left': (data: { userId: string }) => void;
  'draw:stroke': (data: { stroke: Stroke }) => void;
  'draw:undo': (data: { strokeId: string }) => void;
  'draw:redo': (data: { stroke: Stroke }) => void;
  'draw:clear': () => void;
  'presence:cursor': (data: { userId: string; position: Point; userName: string; color: string }) => void;
  'presence:users': (data: { users: UserInfo[] }) => void;
  error: (data: { message: string; code: string }) => void;
}

export interface SocketData {
  userId: string;
  userName: string;
  userColor: string;
  roomId: string | null;
}
