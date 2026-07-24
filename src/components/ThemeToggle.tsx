"use client";

import type { Locale } from "@/src/data/profile";
import { labels } from "@/src/data/profile";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const copy = labels[locale];

  function toggleTheme() {
    const current =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("portfolio-theme", next);
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={copy.theme}
      title={copy.theme}
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}
