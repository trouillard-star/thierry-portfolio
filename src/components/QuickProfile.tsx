import { methodSteps } from "@/src/data/highlights";
import { labels, profile, type Locale } from "@/src/data/profile";
import {
  featuredProjects,
  projects,
  type Project,
} from "@/src/data/projects";
import { skillGroups } from "@/src/data/skills";
import { ProjectCard } from "./ProjectCard";
import { SiteShell } from "./SiteShell";

const quickCopy = {
  fr: {
    eyebrow: "PARCOURS RECRUTEUR / 60 SECONDES",
    title: "Un aperçu rapide, des preuves accessibles tout de suite.",
    intro:
      "Je transforme des opérations dispersées en systèmes compréhensibles, automatisés et vérifiables. Voici l’essentiel avant d’entrer dans les détails.",
    contribution: "Ce que j’apporte",
    contributionIntro:
      "Une combinaison pratique de développement, d’opérations TI et d’architecture.",
    strengths: [
      {
        title: "Relier le logiciel au travail réel",
        detail:
          "Je pars des flux, des responsabilités et des points de friction avant de choisir l’outil.",
      },
      {
        title: "Automatiser sans créer de boîte noire",
        detail:
          "Les traitements restent observables, reprenables après incident et documentés.",
      },
      {
        title: "Livrer avec des garde-fous",
        detail:
          "Accès, confidentialité, tests, états d’erreur et maintenance font partie de la solution.",
      },
    ],
    featured: "Trois preuves principales",
    featuredIntro:
      "Chaque projet possède une démonstration, une architecture, des contrôles et un statut de maturité explicite.",
    method: "Ma méthode en quatre étapes",
    toolkit: "Boîte à outils",
    next: "Approfondir le profil",
    resume: "Consulter le CV",
    evidence: "Voir les preuves de compétences",
    github: "Ouvrir GitHub",
    cases: "études de cas",
    flagships: "projets phares",
    languages: "parcours bilingue",
    public: "déploiements publics",
  },
  en: {
    eyebrow: "RECRUITER PATH / 60 SECONDS",
    title: "A fast overview, with evidence available immediately.",
    intro:
      "I turn fragmented operations into understandable, automated, and verifiable systems. Here is the essential context before going deeper.",
    contribution: "What I bring",
    contributionIntro:
      "A practical combination of development, IT operations, and architecture.",
    strengths: [
      {
        title: "Connect software to real work",
        detail:
          "I start with flows, responsibilities, and friction points before choosing the tool.",
      },
      {
        title: "Automate without creating a black box",
        detail:
          "Processing remains observable, recoverable after failure, and documented.",
      },
      {
        title: "Ship with guardrails",
        detail:
          "Access, confidentiality, testing, error states, and maintenance are part of the solution.",
      },
    ],
    featured: "Three primary proofs",
    featuredIntro:
      "Every project includes a demonstration, an architecture, controls, and an explicit maturity status.",
    method: "My four-step method",
    toolkit: "Toolkit",
    next: "Explore the full profile",
    resume: "Read the résumé",
    evidence: "View competency evidence",
    github: "Open GitHub",
    cases: "case studies",
    flagships: "flagship projects",
    languages: "bilingual journey",
    public: "public deployments",
  },
} as const;

export function QuickProfile({ locale }: { locale: Locale }) {
  const content = quickCopy[locale];
  const copy = labels[locale];
  const home = locale === "fr" ? "/" : "/en";
  const alternate =
    locale === "fr" ? "/en/quick-profile" : "/profil-express";
  const resume = locale === "fr" ? "/cv" : "/en/resume";
  const evidence = locale === "fr" ? "/preuves-competences" : "/en/evidence";

  const profilePageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      homeLocation: profile.location[locale],
      knowsAbout: skillGroups.flatMap((group) => group.skills),
      sameAs: [profile.contact.github],
    },
  };

  return (
    <SiteShell locale={locale} alternatePath={alternate}>
      <main id="contenu" className="quick-profile">
        <header className="quick-profile-hero section-shell" data-reveal>
          <a className="back-link" href={home}>
            ← {locale === "fr" ? "Accueil" : "Home"}
          </a>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
          <div className="quick-profile-actions">
            <a className="button button-primary" href="#preuves">
              {content.featured}
            </a>
            <a className="button button-secondary" href={resume}>
              {content.resume}
            </a>
            <a className="button button-quiet" href={evidence}>
              {content.evidence}
            </a>
          </div>
          <dl className="quick-profile-proof">
            <Proof value={String(projects.length)} label={content.cases} />
            <Proof
              value={String(featuredProjects.length)}
              label={content.flagships}
            />
            <Proof value="FR/EN" label={content.languages} />
            <Proof value="2" label={content.public} />
          </dl>
        </header>

        <section className="quick-profile-section section-shell">
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow">01 / VALUE</p>
              <h2>{content.contribution}</h2>
            </div>
            <p>{content.contributionIntro}</p>
          </div>
          <div className="quick-strength-grid">
            {content.strengths.map((strength, index) => (
              <article key={strength.title} data-reveal>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{strength.title}</h3>
                <p>{strength.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          className="projects-section quick-featured-projects"
          id="preuves"
          aria-labelledby="quick-featured-title"
        >
          <div className="section-shell">
            <div className="section-heading" data-reveal>
              <div>
                <p className="eyebrow">02 / PROOF</p>
                <h2 id="quick-featured-title">{content.featured}</h2>
              </div>
              <p>{content.featuredIntro}</p>
            </div>
            <div className="project-grid">
              {featuredProjects.map((project: Project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="quick-profile-section section-shell">
          <div className="quick-method-grid">
            <div data-reveal>
              <p className="eyebrow">03 / METHOD</p>
              <h2>{content.method}</h2>
              <ol>
                {methodSteps.map((step, index) => (
                  <li key={step.title.en}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{step.title[locale]}</strong>
                    <p>{step.detail[locale]}</p>
                  </li>
                ))}
              </ol>
            </div>
            <aside data-reveal>
              <p className="eyebrow">04 / STACK</p>
              <h2>{content.toolkit}</h2>
              {skillGroups.map((group) => (
                <section key={group.title.en}>
                  <h3>{group.title[locale]}</h3>
                  <p>{group.skills.slice(0, 5).join(" · ")}</p>
                </section>
              ))}
            </aside>
          </div>
        </section>

        <section className="quick-profile-next">
          <div className="section-shell" data-reveal>
            <div>
              <p className="eyebrow">NEXT / CONTACT</p>
              <h2>{content.next}</h2>
              <p>{profile.introduction[locale]}</p>
            </div>
            <div className="quick-profile-actions">
              <a className="button button-primary" href={evidence}>
                {content.evidence}
              </a>
              <a
                className="button button-secondary"
                href={profile.contact.github}
                target="_blank"
                rel="noreferrer"
              >
                {content.github} ↗
              </a>
              <a className="button button-quiet" href={`${home}#contact`}>
                {copy.contactMe}
              </a>
            </div>
          </div>
        </section>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
    </SiteShell>
  );
}

function Proof({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt>{value}</dt>
      <dd>{label}</dd>
    </div>
  );
}
