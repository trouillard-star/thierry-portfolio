import { labels, type Locale } from "@/src/data/profile";
import type { Project } from "@/src/data/projects";

export function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const base = locale === "fr" ? "/projets" : "/en/projects";
  const copy = labels[locale];

  return (
    <article className="project-card">
      <div className="project-card-top">
        <span className="project-index">{project.index}</span>
        <span className={`status status-${project.status}`}>
          {project.statusLabel[locale]}
        </span>
      </div>
      <h3>{project.title[locale]}</h3>
      <p className="project-tagline">{project.tagline[locale]}</p>
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
