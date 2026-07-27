import { labels, type Locale } from "@/src/data/profile";
import { isFeaturedProject, type Project } from "@/src/data/projects";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const base = locale === "fr" ? "/projets" : "/en/projects";
  const copy = labels[locale];
  const isFeatured = isFeaturedProject(project.slug);
  const isNeuro = project.slug === "neuro-lens";
  const headline = project.impact[0];

  return (
    <article
      className={`project-card${isFeatured ? " project-card-featured" : ""}`}
      data-tilt
      data-reveal
    >
      <div className="project-card-top">
        <span className="project-index">{project.index}</span>
        <div className="project-card-labels">
          {isFeatured ? (
            <span className="featured-label">{copy.featuredBadge}</span>
          ) : null}
          <span className={`status status-${project.status}`}>
            {project.statusLabel[locale]}
          </span>
        </div>
      </div>
      <h3>{project.title[locale]}</h3>
      <p className="project-sector">{project.sector[locale]}</p>
      <p className="project-tagline">{project.tagline[locale]}</p>
      {headline ? (
        <p className="project-headline">
          <b>{headline.value}</b>
          <span>{headline.label[locale]}</span>
        </p>
      ) : null}
      {isNeuro ? (
        <div className="neuro-card-preview" aria-hidden="true">
          <div className="neuro-card-brain">
            <span />
            <span />
            <i />
          </div>
          <div className="neuro-card-signal">
            <span>AMYLOÏDE</span>
            <b style={{ "--signal": "68%" } as React.CSSProperties} />
            <span>TAU</span>
            <b style={{ "--signal": "46%" } as React.CSSProperties} />
            <span>COGNITION</span>
            <b style={{ "--signal": "78%" } as React.CSSProperties} />
          </div>
        </div>
      ) : null}
      <ul className="tech-list" aria-label={copy.technologies}>
        {project.technologies.slice(0, 4).map((technology) => (
          <li key={technology}>{technology}</li>
        ))}
      </ul>
      <a className="text-link" href={`${base}/${project.slug}`}>
        {copy.explore}
        <span aria-hidden="true"> ↗</span>
      </a>
    </article>
  );
}
