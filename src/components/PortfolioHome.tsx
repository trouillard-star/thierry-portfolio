import { education } from "@/src/data/education";
import { experience } from "@/src/data/experience";
import {
  impactHighlights,
  methodNote,
  methodSteps,
  quickWins,
} from "@/src/data/highlights";
import { labels, profile, type Locale } from "@/src/data/profile";
import {
  additionalProjects,
  featuredProjects,
  projects,
} from "@/src/data/projects";
import { skillGroups } from "@/src/data/skills";
import { ProjectCard } from "./ProjectCard";
import { SiteShell } from "./SiteShell";

export function PortfolioHome({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const resume = locale === "fr" ? "/cv" : "/en/resume";
  const evidence = locale === "fr" ? "/preuves-competences" : "/en/evidence";
  const quickProfile =
    locale === "fr" ? "/profil-express" : "/en/quick-profile";

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
              <a
                className="button button-primary"
                href={quickProfile}
                data-magnetic=""
              >
                {copy.quickProfile}
              </a>
              <a
                className="button button-secondary"
                href="#projets"
                data-magnetic=""
              >
                {copy.viewProjects}
              </a>
              <a className="button button-quiet" href={resume}>
                {copy.viewResume}
              </a>
            </div>
            <div className="hero-proofline" aria-label={copy.quickProfile}>
              <span>
                <strong>{projects.length}</strong>{" "}
                {locale === "fr" ? "études de cas" : "case studies"}
              </span>
              <span>
                <strong>FR/EN</strong>{" "}
                {locale === "fr" ? "parcours bilingue" : "bilingual journey"}
              </span>
              <span>
                <strong>LIVE</strong>{" "}
                {locale === "fr"
                  ? "démonstrations fonctionnelles"
                  : "functional demonstrations"}
              </span>
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
              <span className="heading-map">SYS.MAP / 07</span>
              <span className="heading-descent">
                {locale === "fr" ? "INSPECTION / 360°" : "INSPECTION / 360°"}
              </span>
              <span className="system-state">ONLINE</span>
            </div>
            {/* Replaces the capability map only once the shader has compiled;
                see public/hero-descent.js. */}
            <div
              className="descent-stage"
              data-hero-descent
              data-descent-label={
                locale === "fr"
                  ? "Vue d’inspection : caméra descendant dans une conduite"
                  : "Inspection view: camera descending through a pipe"
              }
            >
              <canvas aria-hidden="true" />
              <div className="descent-track" data-descent-track aria-hidden="true" />
              <p className="descent-status" aria-hidden="true">
                <i />
                {locale === "fr"
                  ? "Analyse autonome · détection en continu"
                  : "Autonomous analysis · continuous detection"}
              </p>
              <ul className="descent-log" data-descent-log aria-hidden="true" />
              <span className="descent-sim" aria-hidden="true">
                SIMULATION
              </span>
              <div className="descent-readout" aria-hidden="true">
                <div>
                  <b data-descent-distance>0.0</b>
                  <span>{locale === "fr" ? "m parcourus" : "m travelled"}</span>
                </div>
                <div>
                  <b data-descent-defects>0</b>
                  <span>{locale === "fr" ? "relevés" : "readings"}</span>
                </div>
              </div>
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
          <script src="/hero-descent.js" defer />
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
                <dt data-tally="">{item.value}</dt>
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
              {featuredProjects.map((project) => (
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
          className="projects-section projects-section-secondary"
          aria-labelledby="all-projects-title"
        >
          <div className="section-shell">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">{copy.additionalWorkEyebrow}</p>
                <h2 id="all-projects-title">{copy.additionalWorkTitle}</h2>
              </div>
              <p>{copy.additionalWorkIntro}</p>
            </div>
            <div className="project-grid">
              {additionalProjects.map((project) => (
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
              <a className="button button-secondary" href={resume}>
                {copy.downloadResume} <span aria-hidden="true">↓</span>
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
