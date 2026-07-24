import { certifications, education } from "@/src/data/certifications";
import { experience } from "@/src/data/experience";
import { labels, profile, type Locale } from "@/src/data/profile";
import { projects } from "@/src/data/projects";
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
          <div className="hero-copy">
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
            aria-label={
              locale === "fr"
                ? "Carte de capacités techniques"
                : "Technical capability map"
            }
          >
            <div className="system-heading">
              <span>SYS.MAP / 06</span>
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
          className="projects-section"
          id="projets"
          aria-labelledby="projects-title"
        >
          <div className="section-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">{copy.featuredWork}</p>
                <h2 id="projects-title">{copy.featuredWorkTitle}</h2>
              </div>
              <p>{copy.featuredWorkIntro}</p>
            </div>
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="skills-section section-shell" id="competences">
          <div className="section-heading">
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
          <div className="section-shell about-grid">
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
                <p>{certifications.current[locale]}</p>
                <p>{certifications.future[locale]}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="experience-section section-shell" id="experience">
          <div className="section-heading">
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
          <div className="section-shell contact-grid">
            <div>
              <p className="eyebrow">{copy.contactEyebrow}</p>
              <h2>{copy.contactTitle}</h2>
              <p className="contact-intro">{copy.contactIntro}</p>
              <address>
                <span>{profile.location[locale]}</span>
                <span>{profile.availability[locale]}</span>
                <a
                  href={profile.contact.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub · trouillard-star
                </a>
                <span className="placeholder">{copy.contactPlaceholder}</span>
              </address>
            </div>
            <form className="contact-form" aria-describedby="contact-notice">
              <label>
                {copy.name}
                <input type="text" name="name" autoComplete="name" disabled />
              </label>
              <label>
                {copy.email}
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  disabled
                />
              </label>
              <label>
                {copy.message}
                <textarea name="message" rows={5} disabled />
              </label>
              <button className="button button-primary" type="button" disabled>
                {copy.sendDisabled}
              </button>
              <p id="contact-notice">
                {locale === "fr"
                  ? "Interface préparée; aucun service de collecte n’est connecté."
                  : "Interface prepared; no collection service is connected."}
              </p>
            </form>
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
