import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

const USER_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef',
];

function getRandomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}

interface UserState {
  id: string;
  name: string;
  color: string;
  setName: (name: string) => void;
  regenerateId: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: nanoid(10),
      name: `User-${nanoid(4)}`,
      color: getRandomColor(),
      setName: (name) => set({ name }),
      regenerateId: () => set({ id: nanoid(10), color: getRandomColor() }),
    }),
    {
      name: 'whiteboard-user',
    }
  )
);
