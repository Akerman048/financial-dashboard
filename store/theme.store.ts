import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

type ThemeStore = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: "light" as Theme,
      toggleTheme: () =>
        set((state: { theme: string; }) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setTheme: (theme: any) => set({ theme }),
    }),
    {
      name: "theme-storage",
    }
  ) as unknown as (set: any, get: any, store: any) => ThemeStore
);