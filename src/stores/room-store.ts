import { create } from 'zustand';
import type { Point, UserInfo } from '@/types';

interface CursorData {
  position: Point;
  userName: string;
  color: string;
}

interface RoomState {
  roomId: string | null;
  isConnected: boolean;
  users: UserInfo[];
  cursors: Map<string, CursorData>;

  // Actions
  setRoomId: (id: string | null) => void;
  setConnected: (connected: boolean) => void;
  setUsers: (users: UserInfo[]) => void;
  addUser: (user: UserInfo) => void;
  removeUser: (userId: string) => void;
  updateCursor: (userId: string, data: CursorData) => void;
  removeCursor: (userId: string) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  isConnected: false,
  users: [],
  cursors: new Map(),

  setRoomId: (roomId) => set({ roomId }),
  setConnected: (isConnected) => set({ isConnected }),
  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: state.users.some((u) => u.id === user.id)
        ? state.users
        : [...state.users, user],
    })),

  removeUser: (userId) =>
    set((state) => {
      const newCursors = new Map(state.cursors);
      newCursors.delete(userId);
      return {
        users: state.users.filter((u) => u.id !== userId),
        cursors: newCursors,
      };
    }),

  updateCursor: (userId, data) =>
    set((state) => {
      const newCursors = new Map(state.cursors);
      newCursors.set(userId, data);
      return { cursors: newCursors };
    }),

  removeCursor: (userId) =>
    set((state) => {
      const newCursors = new Map(state.cursors);
      newCursors.delete(userId);
      return { cursors: newCursors };
    }),

  reset: () =>
    set({
      roomId: null,
      isConnected: false,
      users: [],
      cursors: new Map(),
    }),
}));
