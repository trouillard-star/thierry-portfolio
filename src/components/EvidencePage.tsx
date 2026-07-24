import { labels, profile, type Locale } from "@/src/data/profile";
import { projects } from "@/src/data/projects";
import { skillGroups } from "@/src/data/skills";
import { SiteShell } from "./SiteShell";

export function EvidencePage({ locale }: { locale: Locale }) {
  const copy = labels[locale];
  const home = locale === "fr" ? "/" : "/en";
  const alternate = locale === "fr" ? "/en/evidence" : "/preuves-competences";
  const projectBase = locale === "fr" ? "/projets" : "/en/projects";
  const content =
    locale === "fr"
      ? {
          eyebrow: "Preuves de compétences",
          title: "Des affirmations reliées à des traces vérifiables",
          intro:
            "Cette page ne remplace pas une validation d’employeur. Elle montre où chercher les preuves : études de cas, historique Git, tests, décisions d’architecture, audits de sécurité, démonstrations et documents vérifiables.",
          principles: [
            [
              "Projets documentés",
              "Le contexte, les décisions, les limites et le statut de chaque projet sont présentés explicitement.",
            ],
            [
              "Historique Git",
              "Les changements peuvent être relus, attribués à une intention et comparés aux tests.",
            ],
            [
              "Tests automatisés",
              "Les contrôles exécutés et leurs limites sont consignés sans transformer un échec en réussite.",
            ],
            [
              "Architecture et sécurité",
              "Les ADR, diagrammes et audits rendent les compromis visibles.",
            ],
            [
              "Niveaux explicites",
              "Chaque étude de cas distingue clairement travail appliqué, prototype, recherche et concept.",
            ],
            [
              "Résolution pratique",
              "Les cas démontrent une démarche qui relie besoin, risque, mise en œuvre et retour d’expérience.",
            ],
          ],
          matrix: "Matrice compétences ↔ preuves",
          capability: "Capacité",
          evidence: "Preuves et projets",
          status: "Niveau de preuve",
          level: "Documentation + artefact de projet",
          caveat:
            "Les études de cas, le code source public et les contrôles documentés forment le périmètre de preuve présenté par ce portfolio.",
        }
      : {
          eyebrow: "Competency evidence",
          title: "Claims connected to verifiable traces",
          intro:
            "This page does not replace employer validation. It shows where to look for evidence: case studies, Git history, tests, architecture decisions, security audits, working demonstrations, and verifiable documents.",
          principles: [
            [
              "Documented projects",
              "Each project’s context, decisions, limits, and maturity are stated explicitly.",
            ],
            [
              "Git history",
              "Changes can be reviewed, tied to intent, and compared with tests.",
            ],
            [
              "Automated tests",
              "Executed checks and limitations are recorded without turning failures into passes.",
            ],
            [
              "Architecture and security",
              "ADRs, diagrams, and audits make trade-offs visible.",
            ],
            [
              "Explicit maturity",
              "Every case study clearly distinguishes applied work, prototypes, research, and concepts.",
            ],
            [
              "Practical problem-solving",
              "Cases demonstrate a method connecting need, risk, implementation, and lessons learned.",
            ],
          ],
          matrix: "Skills ↔ evidence matrix",
          capability: "Capability",
          evidence: "Evidence and projects",
          status: "Evidence level",
          level: "Documentation + project artifact",
          caveat:
            "The case studies, public source code, and documented checks define the evidence presented by this portfolio.",
        };

  return (
    <SiteShell locale={locale} alternatePath={alternate}>
      <main id="contenu" className="evidence-page">
        <header className="evidence-hero section-shell">
          <a className="back-link" href={home}>
            ← {locale === "fr" ? "Accueil" : "Home"}
          </a>
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.intro}</p>
        </header>

        <section className="evidence-principles section-shell">
          {content.principles.map(([title, detail], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h2>{title}</h2>
              <p>{detail}</p>
            </article>
          ))}
        </section>

        <section className="matrix-section">
          <div className="section-shell">
            <div className="matrix-heading">
              <p className="eyebrow">MATRIX / 10×06</p>
              <h2>{content.matrix}</h2>
            </div>
            <div className="matrix-table-wrap" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th>{content.capability}</th>
                    <th>{content.evidence}</th>
                    <th>{content.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {skillGroups.map((group) => (
                    <tr key={group.title.en}>
                      <th scope="row">{group.title[locale]}</th>
                      <td>
                        {group.evidenceSlugs.map((slug, index) => {
                          const project = projects.find(
                            (item) => item.slug === slug,
                          );
                          return project ? (
                            <span key={slug}>
                              <a href={`${projectBase}/${slug}`}>
                                {project.title[locale]}
                              </a>
                              {index < group.evidenceSlugs.length - 1
                                ? ", "
                                : ""}
                            </span>
                          ) : null;
                        })}
                      </td>
                      <td>{content.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="evidence-caveat">{content.caveat}</p>
            <p>
              <a
                className="text-link"
                href={profile.contact.repository}
                target="_blank"
                rel="noreferrer"
              >
                {copy.source} <span aria-hidden="true">↗</span>
              </a>
            </p>
            <a className="button button-primary" href={`${home}#projets`}>
              {copy.allProjects}
            </a>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
