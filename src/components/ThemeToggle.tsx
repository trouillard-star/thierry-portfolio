import type { Locale } from "@/src/data/profile";
import { labels } from "@/src/data/profile";

export function ThemeToggle({ locale }: { locale: Locale }) {
  const copy = labels[locale];

  return (
    <button
      className="theme-toggle"
      type="button"
      data-theme-toggle
      data-light-label={copy.themeLight}
      data-dark-label={copy.themeDark}
      aria-label={copy.theme}
      title={copy.theme}
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}
