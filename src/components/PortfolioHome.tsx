import { education } from "@/src/data/education";
import { experience } from "@/src/data/experience";
import {
  impactHighlights,
  methodNote,
  methodSteps,
  quickWins,
} from "@/src/data/highlights";
import { labels, profile, type Locale } from "@/src/data/profile";
import { labProjects, workProjects } from "@/src/data/projects";
import { skillGroups } from "@/src/data/skills";
import { ProjectCard } from "./ProjectCard";
import { SiteShell } from "./SiteShell";

export function PortfolioHome({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const resume = locale === "fr" ? "/cv" : "/en/resume";
  const evidence = locale === "fr" ? "/preuves-competences" : "/en/evidence";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sherbrooke",
      addressRegion: "Québec",
      addressCountry: "CA",
    },
    knowsAbout: [
      "Software development",
      "Information technology",
      "Automation",
      "Systems architecture",
      "Cybersecurity fundamentals",
    ],
    sameAs: [profile.contact.github],
  };

  return (
    <SiteShell locale={locale}>
      <main id="contenu">
        <section className="hero section-shell" aria-labelledby="hero-title">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">
              <span className="signal-dot" aria-hidden="true" />
              {profile.eyebrow[locale]}
            </p>
            <h1 id="hero-title">
              Thierry
              <br />
              <span>Rouillard</span>
            </h1>
            <p className="hero-positioning">
              {profile.positioning[locale].map((item, index) => (
                <span key={item}>
                  {item}
                  {index < profile.positioning[locale].length - 1 ? (
                    <b aria-hidden="true"> / </b>
                  ) : null}
                </span>
              ))}
            </p>
            <p className="hero-intro">{profile.introduction[locale]}</p>
            <div className="button-row">
              <a className="button button-primary" href="#projets">
                {copy.viewProjects}
              </a>
              <a className="button button-secondary" href={resume}>
                {copy.viewResume}
              </a>
              <a className="button button-quiet" href="#contact">
                {copy.contactMe}
              </a>
            </div>
          </div>
          <div
            className="hero-system"
            data-tilt
            data-reveal
            aria-label={
              locale === "fr"
                ? "Carte de capacités techniques"
                : "Technical capability map"
            }
          >
            <div className="system-heading">
              <span>SYS.MAP / 07</span>
              <span className="system-state">ONLINE</span>
            </div>
            <div className="system-grid">
              <div className="system-node node-code">
                <span>01</span>
                <strong>CODE</strong>
                <small>.NET · TS · PY</small>
              </div>
              <div className="system-node node-ops">
                <span>02</span>
                <strong>OPS</strong>
                <small>SUPPORT · FLOW</small>
              </div>
              <div className="system-node node-sec">
                <span>03</span>
                <strong>SEC</strong>
                <small>ACCESS · AUDIT</small>
              </div>
              <div className="system-node node-cloud">
                <span>04</span>
                <strong>CLOUD</strong>
                <small>AWS · DEPLOY</small>
              </div>
              <div className="system-core">
                <span>PROBLEM</span>
                <strong>→</strong>
                <span>SYSTEM</span>
              </div>
            </div>
            <p className="system-caption">
              {locale === "fr"
                ? "Observer · modéliser · construire · vérifier"
                : "Observe · model · build · verify"}
            </p>
          </div>
        </section>

        <section
          className="impact-section section-shell"
          aria-labelledby="impact-title"
        >
          <div className="impact-heading" data-reveal>
            <p className="eyebrow">{copy.impactEyebrow}</p>
            <h2 id="impact-title">{copy.impactTitle}</h2>
          </div>
          <dl className="impact-band" data-reveal>
            {impactHighlights.map((item) => (
              <div className="impact-tile" key={item.label.en}>
                <dt>{item.value}</dt>
                <dd>{item.label[locale]}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section
          className="projects-section"
          id="projets"
          aria-labelledby="projects-title"
        >
          <div className="section-shell">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">{copy.featuredWork}</p>
                <h2 id="projects-title">{copy.featuredWorkTitle}</h2>
              </div>
              <p>{copy.featuredWorkIntro}</p>
            </div>
            <div className="project-grid">
              {workProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="quickwins-section section-shell"
          id="realisations"
          aria-labelledby="quickwins-title"
        >
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">{copy.quickWinsEyebrow}</p>
              <h2 id="quickwins-title">{copy.quickWinsTitle}</h2>
            </div>
            <p>{copy.quickWinsIntro}</p>
          </div>
          <ul className="quickwin-grid">
            {quickWins.map((win) => (
              <li className="quickwin-card" key={win.title.en} data-reveal>
                <h3>{win.title[locale]}</h3>
                <p>{win.removed[locale]}</p>
                <ul className="tech-list" aria-label={copy.technologies}>
                  {win.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="method-section section-shell"
          id="methode"
          aria-labelledby="method-title"
        >
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">{copy.methodEyebrow}</p>
              <h2 id="method-title">{copy.methodTitle}</h2>
            </div>
            <p>{copy.methodIntro}</p>
          </div>
          <ol className="method-list">
            {methodSteps.map((step, index) => (
              <li key={step.title.en} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title[locale]}</h3>
                  <p>{step.detail[locale]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="method-note" data-reveal>
            {methodNote[locale]}
          </p>
        </section>

        {labProjects.length ? (
          <section
            className="lab-section section-shell"
            id="laboratoire"
            aria-labelledby="lab-title"
          >
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">{copy.labEyebrow}</p>
                <h2 id="lab-title">{copy.labTitle}</h2>
              </div>
              <p>{copy.labIntro}</p>
            </div>
            <div className="project-grid project-grid-lab">
              {labProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          </section>
        ) : null}

        <section className="skills-section section-shell" id="competences">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">{copy.skillsEyebrow}</p>
              <h2>{copy.skillsTitle}</h2>
            </div>
            <a className="text-link" href={evidence}>
              {copy.evidence} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="skill-grid">
            {skillGroups.map((group, index) => (
              <article className="skill-group" key={group.title.en}>
                <span className="skill-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{group.title[locale]}</h3>
                <p>{group.summary[locale]}</p>
                <ul>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="about-section" id="a-propos">
          <div className="section-shell about-grid" data-reveal>
            <div>
              <p className="eyebrow">{copy.aboutEyebrow}</p>
              <h2>{copy.aboutTitle}</h2>
            </div>
            <div className="about-copy">
              {profile.about[locale].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <div className="learning-panel">
                <span>{locale === "fr" ? "FORMATION" : "EDUCATION"}</span>
                <strong>{education[locale].title}</strong>
                <p>{education[locale].detail}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="experience-section section-shell" id="experience">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">{copy.experienceEyebrow}</p>
              <h2>{copy.experienceTitle}</h2>
            </div>
            <p>{experience.note[locale]}</p>
          </div>
          <div className="responsibility-list">
            {experience.responsibilities.map((item, index) => (
              <article key={item.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title[locale]}</h3>
                <p>{item.detail[locale]}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="section-shell contact-grid" data-reveal>
            <div>
              <p className="eyebrow">{copy.contactEyebrow}</p>
              <h2>{copy.contactTitle}</h2>
              <p className="contact-intro">{copy.contactIntro}</p>
              <address>
                <span>{profile.location[locale]}</span>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub · trouillard-star
                </a>
              </address>
            </div>
            <div className="contact-card" data-reveal>
              <span>CONTACT / GITHUB</span>
              <strong>{profile.name}</strong>
              <p>{profile.location[locale]}</p>
              <a
                className="button button-primary"
                href={profile.contact.github}
                target="_blank"
                rel="noreferrer"
              >
                {copy.contactAction} <span aria-hidden="true">↗</span>
              </a>
              <a
                className="text-link"
                href={profile.contact.repository}
                target="_blank"
                rel="noreferrer"
              >
                {copy.repositoryAction} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </SiteShell>
  );
}
