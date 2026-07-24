import type { ReactNode } from "react";
import { labels, profile, type Locale } from "@/src/data/profile";
import { ThemeToggle } from "./ThemeToggle";

type Props = {
  locale: Locale;
  children: ReactNode;
  alternatePath?: string;
};

export function SiteShell({ locale, children, alternatePath }: Props) {
  const copy = labels[locale];
  const home = locale === "fr" ? "/" : "/en";
  const otherLocale = locale === "fr" ? "en" : "fr";
  const defaultAlternate = locale === "fr" ? "/en" : "/";

  return (
    <div lang={locale === "fr" ? "fr-CA" : "en-CA"}>
      <a className="skip-link" href="#contenu">
        {copy.skip}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href={home}
            aria-label={`${profile.name} — TR — ${locale === "fr" ? "accueil" : "home"}`}
          >
            <span className="brand-mark" aria-hidden="true">
              TR
            </span>
            <span className="brand-name">Thierry Rouillard</span>
          </a>
          <nav className="primary-nav" aria-label={copy.menu}>
            <a href={`${home}#projets`}>{copy.nav.projects}</a>
            <a href={`${home}#competences`}>{copy.nav.skills}</a>
            <a href={`${home}#a-propos`}>{copy.nav.about}</a>
            <a href={locale === "fr" ? "/preuves-competences" : "/en/evidence"}>
              {copy.nav.evidence}
            </a>
          </nav>
          <div className="header-actions">
            <a
              className="language-link"
              href={alternatePath ?? defaultAlternate}
              hrefLang={otherLocale}
              aria-label={`${copy.language} (${copy.languageCode})`}
            >
              {copy.languageCode}
            </a>
            <ThemeToggle locale={locale} />
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <strong>{profile.name}</strong>
            <p>{copy.footer}</p>
          </div>
          <div className="footer-links">
            <a href={locale === "fr" ? "/cv" : "/en/resume"}>
              {copy.nav.resume}
            </a>
            <a href={`${home}#contact`}>{copy.nav.contact}</a>
            <a href={locale === "fr" ? "/preuves-competences" : "/en/evidence"}>
              {copy.nav.evidence}
            </a>
          </div>
          <p className="footer-meta">
            Sherbrooke · Québec · Canada
            <br />© {new Date().getFullYear()} Thierry Rouillard
          </p>
        </div>
      </footer>
    </div>
  );
}
