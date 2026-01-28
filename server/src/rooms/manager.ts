import type { Room, Stroke, UserInfo } from '../types.js';

const MAX_STROKES_PER_ROOM = 10_000;
const STALE_ROOM_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes
const STALE_ROOM_THRESHOLD = 60 * 60 * 1000; // 1 hour

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private cleanupTimer: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupTimer = setInterval(() => this.cleanupStaleRooms(), STALE_ROOM_CHECK_INTERVAL);
  }

  destroy(): void {
    clearInterval(this.cleanupTimer);
  }

  private cleanupStaleRooms(): void {
    const now = Date.now();
    for (const [roomId, room] of this.rooms) {
      if (room.users.size === 0 && now - room.lastActivity.getTime() > STALE_ROOM_THRESHOLD) {
        this.rooms.delete(roomId);
      }
    }
  }

  createRoom(roomId: string): Room {
    const room: Room = {
      id: roomId,
      strokes: [],
      users: new Map(),
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  getOrCreateRoom(roomId: string): Room {
    let room = this.rooms.get(roomId);
    if (!room) {
      room = this.createRoom(roomId);
    }
    return room;
  }

  addUserToRoom(roomId: string, user: UserInfo): void {
    const room = this.getOrCreateRoom(roomId);
    room.users.set(user.id, user);
    room.lastActivity = new Date();
  }

  removeUserFromRoom(roomId: string, userId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.users.delete(userId);
    room.lastActivity = new Date();

    // Clean up empty rooms after a delay
    if (room.users.size === 0) {
      setTimeout(() => {
        const currentRoom = this.rooms.get(roomId);
        if (currentRoom && currentRoom.users.size === 0) {
          this.rooms.delete(roomId);
        }
      }, 5 * 60 * 1000); // 5 minutes
    }
  }

  addStroke(roomId: string, stroke: Stroke): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    if (room.strokes.length >= MAX_STROKES_PER_ROOM) {
      // Remove oldest 10% to make room
      room.strokes.splice(0, Math.floor(MAX_STROKES_PER_ROOM * 0.1));
    }
    room.strokes.push(stroke);
    room.lastActivity = new Date();
  }

  removeStroke(roomId: string, strokeId: string): Stroke | undefined {
    const room = this.rooms.get(roomId);
    if (!room) return undefined;

    const index = room.strokes.findIndex((s) => s.id === strokeId);
    if (index === -1) return undefined;

    const [removed] = room.strokes.splice(index, 1);
    room.lastActivity = new Date();
    return removed;
  }

  addStrokeBack(roomId: string, stroke: Stroke): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.strokes.push(stroke);
    room.lastActivity = new Date();
  }

  clearStrokes(roomId: string): void {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.strokes = [];
    room.lastActivity = new Date();
  }

  getRoomState(roomId: string): { strokes: Stroke[]; users: UserInfo[] } | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    return {
      strokes: room.strokes,
      users: Array.from(room.users.values()),
    };
  }

  getUsers(roomId: string): UserInfo[] {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.users.values());
  }
}
