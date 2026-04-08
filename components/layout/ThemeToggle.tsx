"use client";

import { useThemeStore } from "@/store/theme.store";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import clsx from "clsx";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={clsx(
        "mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted px-3 py-2.5 text-sm font-medium text-foreground transition",
        "hover:bg-[var(--color-hover)] active:scale-[0.98]"
      )}
    >
      {theme === "light" ? (
        <>
          <MdDarkMode className="text-lg" />
          <span>Dark</span>
        </>
      ) : (
        <>
          <MdLightMode className="text-lg" />
          <span>Light</span>
        </>
      )}
    </button>
  );
}