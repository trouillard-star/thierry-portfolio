/* eslint-disable @next/next/no-html-link-for-pages -- Document navigation is intentional for generic static hosts. */

export default function NotFound() {
  return (
    <main id="contenu" className="not-found section-shell">
      <p className="eyebrow">ERROR / 404</p>
      <h1>Signal introuvable</h1>
      <p>
        Cette route n’existe pas ou a été déplacée. / This route does not exist
        or has moved.
      </p>
      {/* A document link avoids Next route prefetch requests on generic static hosts. */}
      <a className="button button-primary" href="/">
        Retour au portfolio / Back to portfolio
      </a>
    </main>
  );
}
