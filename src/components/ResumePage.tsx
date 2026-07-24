import { education } from "@/src/data/education";
import { experience } from "@/src/data/experience";
import { profile, type Locale } from "@/src/data/profile";
import { skillGroups } from "@/src/data/skills";
import { PrintButton } from "./PrintButton";
import { SiteShell } from "./SiteShell";

export function ResumePage({ locale }: { locale: Locale }) {
  const home = locale === "fr" ? "/" : "/en";
  const alternate = locale === "fr" ? "/en/resume" : "/cv";
  const evidence = locale === "fr" ? "/preuves-competences" : "/en/evidence";
  const headings =
    locale === "fr"
      ? {
          title: "Curriculum vitæ",
          profile: "Profil",
          capabilities: "Boîte à outils",
          experience: "Expérience appliquée",
          education: "Parcours et formation",
          print: "Imprimer ou enregistrer en PDF",
          availability: "Disponible pour des conversations pertinentes",
          overview: "À propos",
          proof: "Voir les preuves, architectures et études de cas",
          proofNote:
            "Chaque compétence est reliée à un contexte, une démarche et un niveau de maturité explicite.",
          selectedPractice: "Champs de pratique",
          method: "Méthode de travail",
          appliedWork: "responsabilités techniques",
          practiceAreas: "domaines de compétence",
          bilingual: "portfolio bilingue",
        }
      : {
          title: "Résumé",
          profile: "Profile",
          capabilities: "Toolkit",
          experience: "Applied experience",
          education: "Background and education",
          print: "Print or save as PDF",
          availability: "Available for relevant conversations",
          overview: "About",
          proof: "View evidence, architectures, and case studies",
          proofNote:
            "Every capability is connected to context, an approach, and an explicit maturity level.",
          selectedPractice: "Practice areas",
          method: "Working method",
          appliedWork: "technical responsibilities",
          practiceAreas: "capability areas",
          bilingual: "bilingual portfolio",
        };

  const highlights = [
    { value: "06", label: headings.appliedWork },
    { value: "10", label: headings.practiceAreas },
    { value: "FR/EN", label: headings.bilingual },
  ];
  const method =
    locale === "fr"
      ? ["Observer", "Modéliser", "Construire", "Vérifier"]
      : ["Observe", "Model", "Build", "Verify"];

  return (
    <SiteShell locale={locale} alternatePath={alternate}>
      <main id="contenu" className="resume-page section-shell">
        <div className="resume-toolbar no-print">
          <a className="back-link" href={home}>
            ← {locale === "fr" ? "Accueil" : "Home"}
          </a>
          <div>
            <PrintButton>{headings.print}</PrintButton>
          </div>
        </div>

        <article className="resume-sheet">
          <div className="resume-signal" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <header className="resume-masthead" data-reveal>
            <div className="resume-identity">
              <span className="resume-monogram" aria-hidden="true">
                TR
              </span>
              <div>
                <p className="resume-kicker">CV / 2026 · SHERBROOKE</p>
                <h1>{profile.name}</h1>
                <p className="resume-roleline">
                  {profile.positioning[locale].join(" / ")}
                </p>
              </div>
            </div>
            <address className="resume-contact-card">
              <span>LOCALISATION / LOCATION</span>
              <strong>{profile.location[locale]}</strong>
              <span>{headings.availability}</span>
              <a href={profile.contact.github} target="_blank" rel="noreferrer">
                github.com/trouillard-star ↗
              </a>
            </address>
          </header>

          <div className="resume-overview" data-reveal>
            <section className="resume-introduction">
              <p className="resume-section-label">{headings.overview}</p>
              <h2>{headings.profile}</h2>
              <p className="resume-lead">{profile.introduction[locale]}</p>
              <p>{profile.about[locale][0]}</p>
            </section>
            <div className="resume-highlights" aria-label={headings.profile}>
              {highlights.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="resume-layout">
            <section className="resume-main-column" data-reveal>
              <div className="resume-heading-row">
                <div>
                  <p className="resume-section-label">01 / EXPERIENCE</p>
                  <h2>{headings.experience}</h2>
                </div>
                <p className="resume-note">{experience.note[locale]}</p>
              </div>
              <ol className="resume-timeline">
                {experience.responsibilities.map((item, index) => (
                  <li key={item.title.en}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{item.title[locale]}</h3>
                      <p>{item.detail[locale]}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <aside className="resume-sidebar">
              <section className="resume-credentials" data-reveal>
                <p className="resume-section-label">02 / FORMATION</p>
                <h2>{headings.education}</h2>
                <h3>{education[locale].title}</h3>
                <p>{education[locale].detail}</p>
              </section>

              <section className="resume-method" data-reveal>
                <p className="resume-section-label">METHOD / 04</p>
                <h3>{headings.method}</h3>
                <ol>
                  {method.map((step, index) => (
                    <li key={step}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </section>
            </aside>
          </div>

          <section className="resume-toolkit-section" data-reveal>
            <div className="resume-heading-row">
              <div>
                <p className="resume-section-label">
                  03 / {headings.selectedPractice}
                </p>
                <h2>{headings.capabilities}</h2>
              </div>
            </div>
            <div className="resume-toolbox">
              {skillGroups.map((group) => (
                <div key={group.title.en}>
                  <h3>{group.title[locale]}</h3>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <footer className="resume-proof" data-reveal>
            <span aria-hidden="true">↗</span>
            <div>
              <a href={evidence}>{headings.proof}</a>
              <p>{headings.proofNote}</p>
            </div>
          </footer>
        </article>
      </main>
    </SiteShell>
  );
}
