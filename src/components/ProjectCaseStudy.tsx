import { ArchitectureFlow } from "./ArchitectureFlow";
import { SiteShell } from "./SiteShell";
import { labels, type Locale } from "@/src/data/profile";
import { projects, type Project } from "@/src/data/projects";

const caseCopy = {
  fr: {
    caseStudy: "Étude de cas",
    overview: "Vue d’ensemble",
    solution: "Solution",
    outcomes: "Résultats",
    validation: "Validation",
    executiveSummary: "Résumé exécutif",
    mandate: "Le mandat",
    challenge: "Le défi",
    contribution: "Ma contribution",
    design: "La réponse conçue",
    delivery: "Architecture de la solution",
    deliveryIntro:
      "Une chaîne simple et lisible, pensée pour limiter les dépendances et garder chaque responsabilité vérifiable.",
    impact: "Résultats et apprentissages",
    rigor: "Détails de réalisation",
    rigorIntro:
      "Les contrôles essentiels restent accessibles sans alourdir la lecture principale.",
    openSecurity: "Voir les mesures de sécurité",
    openTesting: "Voir la stratégie de validation",
    statusNote: "Où en est le projet",
    next: "Projet suivant",
    discover: "Découvrir l’étude de cas",
    download: "Télécharger le diagramme",
    quickFacts: "En bref",
  },
  en: {
    caseStudy: "Case study",
    overview: "Overview",
    solution: "Solution",
    outcomes: "Outcomes",
    validation: "Validation",
    executiveSummary: "Executive summary",
    mandate: "The mandate",
    challenge: "The challenge",
    contribution: "My contribution",
    design: "The designed response",
    delivery: "Solution architecture",
    deliveryIntro:
      "A clear, focused chain designed to limit dependencies and keep every responsibility verifiable.",
    impact: "Outcomes and learnings",
    rigor: "Delivery details",
    rigorIntro:
      "Essential controls remain available without weighing down the main narrative.",
    openSecurity: "View security measures",
    openTesting: "View validation strategy",
    statusNote: "Where the project stands",
    next: "Next project",
    discover: "Explore the case study",
    download: "Download the diagram",
    quickFacts: "At a glance",
  },
} as const;

export function ProjectCaseStudy({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const copy = labels[locale];
  const pageCopy = caseCopy[locale];
  const projectsHref = locale === "fr" ? "/#projets" : "/en#projets";
  const base = locale === "fr" ? "/projets" : "/en/projects";
  const alternatePath =
    locale === "fr"
      ? `/en/projects/${project.slug}`
      : `/projets/${project.slug}`;
  const projectIndex = projects.findIndex(
    (candidate) => candidate.slug === project.slug,
  );
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <SiteShell locale={locale} alternatePath={alternatePath}>
      <main id="contenu">
        <article className="case-study case-study-simple">
          <header className="case-hero case-hero-simple section-shell">
            <a className="back-link" href={projectsHref}>
              <span aria-hidden="true">←</span> {copy.back}
            </a>

            <div className="case-kicker">
              <p className="eyebrow">
                {pageCopy.caseStudy} / {project.index}
              </p>
              <span className={`status status-${project.status}`}>
                {project.statusLabel[locale]}
              </span>
            </div>

            <h1>{project.title[locale]}</h1>
            <p className="case-tagline">{project.tagline[locale]}</p>
            <p className="case-lead">{project.summary[locale]}</p>

            <nav className="case-local-nav" aria-label={pageCopy.caseStudy}>
              <a href="#vue-ensemble">01 · {pageCopy.overview}</a>
              <a href="#solution">02 · {pageCopy.solution}</a>
              <a href="#resultats">03 · {pageCopy.outcomes}</a>
              <a href="#validation">04 · {pageCopy.validation}</a>
            </nav>
          </header>

          <div className="case-body case-body-simple section-shell">
            <aside className="case-aside case-aside-simple">
              <p className="case-aside-title">{pageCopy.quickFacts}</p>
              <div>
                <span>{copy.status}</span>
                <strong className={`status status-${project.status}`}>
                  {project.statusLabel[locale]}
                </strong>
              </div>
              <div>
                <span>{copy.technologies}</span>
                <ul className="stacked-tech">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span>{copy.currentStatus}</span>
                <p>{project.currentStatus[locale]}</p>
              </div>
            </aside>

            <div className="case-content case-content-simple">
              <section
                className="case-story-section"
                id="vue-ensemble"
                aria-labelledby="overview-title"
                data-reveal
              >
                <CaseHeading
                  number="01"
                  eyebrow={pageCopy.executiveSummary}
                  title={pageCopy.mandate}
                  id="overview-title"
                />
                <div className="case-story-grid">
                  <article>
                    <span>{pageCopy.challenge}</span>
                    <p>{project.context[locale]}</p>
                    <p>{project.problem[locale]}</p>
                  </article>
                  <article>
                    <span>{pageCopy.contribution}</span>
                    <p>{project.role[locale]}</p>
                  </article>
                </div>
              </section>

              <section
                className="case-story-section"
                id="solution"
                aria-labelledby="solution-title"
                data-reveal
              >
                <CaseHeading
                  number="02"
                  eyebrow={copy.approach}
                  title={pageCopy.design}
                  id="solution-title"
                />
                <p className="case-section-intro">{project.approach[locale]}</p>

                <div className="case-architecture">
                  <div>
                    <h3>{pageCopy.delivery}</h3>
                    <p>{pageCopy.deliveryIntro}</p>
                  </div>
                  <ArchitectureFlow project={project} locale={locale} />
                  <a
                    className="source-link"
                    href={`/diagrams/${project.slug}.mmd`}
                    download
                  >
                    {pageCopy.download} <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </section>

              <section
                className="case-story-section"
                id="resultats"
                aria-labelledby="outcomes-title"
                data-reveal
              >
                <CaseHeading
                  number="03"
                  eyebrow={copy.results}
                  title={pageCopy.impact}
                  id="outcomes-title"
                />
                <div className="case-outcome-grid">
                  <CaseList
                    label={copy.results}
                    items={project.results.map((item) => item[locale])}
                  />
                  <CaseList
                    label={copy.lessons}
                    items={project.lessons.map((item) => item[locale])}
                  />
                </div>
              </section>

              <section
                className="case-story-section"
                id="validation"
                aria-labelledby="validation-title"
                data-reveal
              >
                <CaseHeading
                  number="04"
                  eyebrow={pageCopy.validation}
                  title={pageCopy.rigor}
                  id="validation-title"
                />
                <p className="case-section-intro">{pageCopy.rigorIntro}</p>
                <div className="case-details">
                  <CaseDetails
                    summary={pageCopy.openSecurity}
                    label={copy.security}
                    items={project.security.map((item) => item[locale])}
                  />
                  <CaseDetails
                    summary={pageCopy.openTesting}
                    label={copy.testing}
                    items={project.testing.map((item) => item[locale])}
                  />
                </div>
              </section>

              <section className="case-final case-final-simple" data-reveal>
                <span>{pageCopy.statusNote}</span>
                <p>{project.currentStatus[locale]}</p>
              </section>
            </div>
          </div>

          <nav className="case-next section-shell" aria-label={pageCopy.next}>
            <span>
              {pageCopy.next} / {nextProject.index}
            </span>
            <a href={`${base}/${nextProject.slug}`}>
              <strong>{nextProject.title[locale]}</strong>
              <small>
                {pageCopy.discover} <span aria-hidden="true">→</span>
              </small>
            </a>
          </nav>
        </article>
      </main>
    </SiteShell>
  );
}

function CaseHeading({
  number,
  eyebrow,
  title,
  id,
}: {
  number: string;
  eyebrow: string;
  title: string;
  id: string;
}) {
  return (
    <div className="case-story-heading">
      <span>{number}</span>
      <div>
        <p>{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
    </div>
  );
}

function CaseList({ label, items }: { label: string; items: string[] }) {
  return (
    <article>
      <h3>{label}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function CaseDetails({
  summary,
  label,
  items,
}: {
  summary: string;
  label: string;
  items: string[];
}) {
  return (
    <details>
      <summary>
        <span>{label}</span>
        <strong>{summary}</strong>
      </summary>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </details>
  );
}
