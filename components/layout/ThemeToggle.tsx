"use client";

import { useThemeStore } from "@/store/theme.store";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import clsx from "clsx";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "flex items-center gap-2",
        "mt-8 cursor-pointer rounded-xl px-3 py-2",
        "bg-[var(--color-hover)] text-foreground/80",
        "hover:bg-[var(--color-active)] hover:text-foreground",
        "active:scale-95",
        "transition-all duration-200",
        "border border-white/10"
      )}
    >
      {theme === "light" ? (
        <>
          <MdDarkMode className="text-lg" />
          <span className="text-sm">Dark</span>
        </>
      ) : (
        <>
          <MdLightMode className="text-lg" />
          <span className="text-sm">Light</span>
        </>
      )}
    </button>
  );
}