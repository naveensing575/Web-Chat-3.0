import { create } from "zustand";

interface ThemeState {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee", // Default theme
  setTheme: (theme: string) => {
    localStorage.setItem("chat-theme", theme); // Persist theme to localStorage
    set({ theme });
  },
}));
