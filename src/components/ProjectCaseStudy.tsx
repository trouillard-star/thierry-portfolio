import { ArchitectureFlow } from "./ArchitectureFlow";
import { AlzheimerResearchLab } from "./AlzheimerResearchLab";
import { SiteShell } from "./SiteShell";
import { labels, type Locale } from "@/src/data/profile";
import type { Project } from "@/src/data/projects";

export function ProjectCaseStudy({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const copy = labels[locale];
  const projectsHref = locale === "fr" ? "/#projets" : "/en#projets";
  const alternatePath =
    locale === "fr"
      ? `/en/projects/${project.slug}`
      : `/projets/${project.slug}`;

  return (
    <SiteShell locale={locale} alternatePath={alternatePath}>
      <main id="contenu">
        <article className="case-study">
          <header className="case-hero section-shell">
            <a className="back-link" href={projectsHref}>
              <span aria-hidden="true">←</span> {copy.back}
            </a>
            <div className="case-title-row">
              <div>
                <p className="eyebrow">CASE / {project.index}</p>
                <h1>{project.title[locale]}</h1>
                <p className="case-tagline">{project.tagline[locale]}</p>
              </div>
              <div className="case-status">
                <span>{copy.status}</span>
                <strong className={`status status-${project.status}`}>
                  {project.statusLabel[locale]}
                </strong>
              </div>
            </div>
          </header>

          <div className="case-body section-shell">
            <aside className="case-aside">
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

            <div className="case-content">
              <p className="case-summary">{project.summary[locale]}</p>
              {project.slug === "neuro-lens" ? (
                <AlzheimerResearchLab locale={locale} />
              ) : null}
              <div className="case-facts">
                <section>
                  <span>01</span>
                  <h2>{copy.context}</h2>
                  <p>{project.context[locale]}</p>
                </section>
                <section>
                  <span>02</span>
                  <h2>{copy.problem}</h2>
                  <p>{project.problem[locale]}</p>
                </section>
                <section>
                  <span>03</span>
                  <h2>{copy.role}</h2>
                  <p>{project.role[locale]}</p>
                </section>
                <section>
                  <span>04</span>
                  <h2>{copy.approach}</h2>
                  <p>{project.approach[locale]}</p>
                </section>
              </div>

              <section
                className="architecture-section"
                aria-labelledby="architecture-title"
              >
                <div className="case-section-heading">
                  <span>05</span>
                  <h2 id="architecture-title">{copy.architecture}</h2>
                </div>
                <ArchitectureFlow project={project} locale={locale} />
                <a
                  className="source-link"
                  href={`/diagrams/${project.slug}.mmd`}
                  download
                >
                  {copy.sourceDiagram} ↓
                </a>
              </section>

              <CaseList
                number="06"
                title={copy.security}
                items={project.security.map((item) => item[locale])}
              />
              <CaseList
                number="07"
                title={copy.testing}
                items={project.testing.map((item) => item[locale])}
              />
              <CaseList
                number="08"
                title={copy.results}
                items={project.results.map((item) => item[locale])}
              />
              <CaseList
                number="09"
                title={copy.lessons}
                items={project.lessons.map((item) => item[locale])}
              />

              <section className="case-final">
                <span>10 / {copy.currentStatus}</span>
                <p>{project.currentStatus[locale]}</p>
              </section>
            </div>
          </div>
        </article>
      </main>
    </SiteShell>
  );
}

function CaseList({
  number,
  title,
  items,
}: {
  number: string;
  title: string;
  items: string[];
}) {
  return (
    <section className="case-list-section">
      <div className="case-section-heading">
        <span>{number}</span>
        <h2>{title}</h2>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
