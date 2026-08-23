"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Mudar para modo claro"
          : "Mudar para modo escuro"
      }
      title={
        isDark
          ? "Modo claro"
          : "Modo escuro"
      }
      className="
        rounded-full
        p-2.5
        text-zinc-700
        transition
        hover:bg-zinc-100
        hover:text-pink-500
        dark:text-zinc-200
        dark:hover:bg-zinc-900
        dark:hover:text-pink-500
      "
    >
      {isDark ? (
        <Sun size={22} />
      ) : (
        <Moon size={22} />
      )}
    </button>
  );
}