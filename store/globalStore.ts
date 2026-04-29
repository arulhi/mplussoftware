"use client";
import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

interface GlobalState {
  title: string | null;
  setTitle: (title: string | null) => void;
  theme: "light" | "dark" | "system";
  setTheme: (type: "light" | "dark" | "system") => void;
}

const customStorage: PersistStorage<GlobalState> = {
  getItem: (key) => {
    if (typeof window === 'undefined') return null; // Prevents SSR issues
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  },
};

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      title: null,
      theme: "light",
      setTitle: (title) => set({ title }),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'global-storage',
      storage: customStorage,
    }
  )
);
