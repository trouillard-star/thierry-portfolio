import { certifications, education } from "@/src/data/certifications";
import { experience } from "@/src/data/experience";
import { profile, type Locale } from "@/src/data/profile";
import { skillGroups } from "@/src/data/skills";
import { PrintButton } from "./PrintButton";
import { SiteShell } from "./SiteShell";

export function ResumePage({ locale }: { locale: Locale }) {
  const home = locale === "fr" ? "/" : "/en";
  const alternate = locale === "fr" ? "/en/resume" : "/cv";
  const headings =
    locale === "fr"
      ? {
          title: "Curriculum vitæ",
          profile: "Profil",
          capabilities: "Compétences principales",
          experience: "Responsabilités techniques",
          education: "Formation",
          certifications: "Certifications",
          download: "PDF à venir",
          print: "Imprimer ou enregistrer en PDF",
          verified: "Coordonnées et détails vérifiables à compléter.",
        }
      : {
          title: "Résumé",
          profile: "Profile",
          capabilities: "Core capabilities",
          experience: "Technical responsibilities",
          education: "Education",
          certifications: "Certifications",
          download: "PDF coming soon",
          print: "Print or save as PDF",
          verified:
            "Contact details and verifiable information to be completed.",
        };

  return (
    <SiteShell locale={locale} alternatePath={alternate}>
      <main id="contenu" className="resume-page section-shell">
        <div className="resume-toolbar no-print">
          <a className="back-link" href={home}>
            ← {locale === "fr" ? "Accueil" : "Home"}
          </a>
          <div>
            <PrintButton>{headings.print}</PrintButton>
            <span className="button button-disabled" aria-disabled="true">
              {headings.download}
            </span>
          </div>
        </div>

        <article className="resume-sheet">
          <header className="resume-header">
            <div>
              <p className="eyebrow">CV / 2026</p>
              <h1>{profile.name}</h1>
              <p>{profile.positioning[locale].join(" · ")}</p>
            </div>
            <address>
              {profile.location[locale]}
              <br />
              {headings.verified}
            </address>
          </header>

          <section className="resume-section">
            <h2>{headings.profile}</h2>
            <p>{profile.introduction[locale]}</p>
            <p>{profile.about[locale][0]}</p>
          </section>

          <section className="resume-section">
            <h2>{headings.capabilities}</h2>
            <div className="resume-skills">
              {skillGroups.map((group) => (
                <div key={group.title.en}>
                  <h3>{group.title[locale]}</h3>
                  <p>{group.skills.join(" · ")}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-section">
            <h2>{headings.experience}</h2>
            <p className="resume-note">{experience.note[locale]}</p>
            <div className="resume-experience">
              {experience.responsibilities.map((item) => (
                <div key={item.title.en}>
                  <h3>{item.title[locale]}</h3>
                  <p>{item.detail[locale]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="resume-section resume-two-column">
            <div>
              <h2>{headings.education}</h2>
              <h3>{education[locale].title}</h3>
              <p>{education[locale].detail}</p>
            </div>
            <div>
              <h2>{headings.certifications}</h2>
              <p>{certifications.current[locale]}</p>
              <p>{certifications.future[locale]}</p>
            </div>
          </section>
        </article>
      </main>
    </SiteShell>
  );
}
