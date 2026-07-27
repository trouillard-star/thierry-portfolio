"use client";

import { useState } from "react";
import type { Locale } from "@/src/data/profile";

type DemoCopy = {
  title: string;
  subtitle: string;
  tabs: string[];
};

const demos: Record<string, Record<Locale, DemoCopy>> = {
  "neuro-lens": {
    fr: {
      title: "Laboratoire de trajectoires",
      subtitle: "Scénarios éducatifs · données synthétiques",
      tabs: ["Biomarqueurs", "Réseaux", "Étude"],
    },
    en: {
      title: "Trajectory laboratory",
      subtitle: "Educational scenarios · synthetic data",
      tabs: ["Biomarkers", "Networks", "Study"],
    },
  },
  "operations-crm": {
    fr: {
      title: "Centre d’opérations CRM",
      subtitle: "Portefeuille, équipes et livrables",
      tabs: ["Vue d’ensemble", "Flux projet", "Intelligence"],
    },
    en: {
      title: "CRM operations centre",
      subtitle: "Portfolio, teams, and deliverables",
      tabs: ["Overview", "Project flow", "Intelligence"],
    },
  },
  "secure-client-portal": {
    fr: {
      title: "Espace client sécurisé",
      subtitle: "Publications contrôlées · lecture seule",
      tabs: ["Projets", "Livrables", "Notifications"],
    },
    en: {
      title: "Secure client workspace",
      subtitle: "Controlled publishing · read-only",
      tabs: ["Projects", "Deliverables", "Notifications"],
    },
  },
  "mario-ai": {
    fr: {
      title: "MarioAI · Copilote opérationnel",
      subtitle: "Analyse locale · contexte isolé",
      tabs: ["Résumé", "Tâches", "Décisions"],
    },
    en: {
      title: "MarioAI · Operations copilot",
      subtitle: "Local analysis · isolated context",
      tabs: ["Summary", "Tasks", "Decisions"],
    },
  },
  "remote-assist": {
    fr: {
      title: "ADE Assist",
      subtitle: "Parc TI · assistance consentie",
      tabs: ["Parc", "Alertes", "Assistance"],
    },
    en: {
      title: "ADE Assist",
      subtitle: "IT fleet · consent-based support",
      tabs: ["Fleet", "Alerts", "Support"],
    },
  },
  boreal: {
    fr: {
      title: "Boréal · Système unifié",
      subtitle: "Concept produit · opérations terrain",
      tabs: ["Commandement", "Actifs", "Automatisation"],
    },
    en: {
      title: "Boreal · Unified system",
      subtitle: "Product concept · field operations",
      tabs: ["Command", "Assets", "Automation"],
    },
  },
  "pipe360-profiler": {
    fr: {
      title: "Pipe360 · Analyse de profil",
      subtitle: "ASTM F1216 · inspection synthétique",
      tabs: ["Analyse", "Qualité", "Livrables"],
    },
    en: {
      title: "Pipe360 · Profile analysis",
      subtitle: "ASTM F1216 · synthetic inspection",
      tabs: ["Analysis", "Quality", "Deliverables"],
    },
  },
};

export function ProjectDemo({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const copy = demos[slug]?.[locale];

  if (!copy) return null;

  return (
    <section
      className={`project-demo project-demo-${slug}`}
      aria-labelledby={`demo-${slug}-title`}
      data-reveal
    >
      <div className="demo-window-bar">
        <div className="demo-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>
          {locale === "fr"
            ? "Démonstration portfolio · données anonymisées"
            : "Portfolio demonstration · anonymized data"}
        </span>
        <strong>
          <i aria-hidden="true" />
          {locale === "fr" ? "Fonctionnel" : "Functional"}
        </strong>
      </div>

      <header className="demo-heading">
        <div>
          <span>{copy.subtitle}</span>
          <h2 id={`demo-${slug}-title`}>{copy.title}</h2>
        </div>
        <nav aria-label={copy.title}>
          {copy.tabs.map((tab, index) => (
            <button
              type="button"
              key={tab}
              aria-pressed={activeTab === index}
              onClick={() => setActiveTab(index)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      <div className="demo-stage">
        {slug === "operations-crm" ? (
          <CrmDemo locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "secure-client-portal" ? (
          <PortalDemo locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "mario-ai" ? (
          <MarioDemo locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "remote-assist" ? (
          <AssistDemo locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "pipe360-profiler" ? (
          <PipeDemo locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "neuro-lens" ? (
          <NeuroDemo locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "boreal" ? (
          <BorealDemo locale={locale} activeTab={activeTab} />
        ) : null}
      </div>
    </section>
  );
}

function CrmDemo({ locale, activeTab }: { locale: Locale; activeTab: number }) {
  const fr = locale === "fr";
  const metrics =
    activeTab === 2 ? ["94 %", "2,4 h", "18", "0"] : ["38", "12", "7", "96 %"];
  const labels =
    activeTab === 2
      ? fr
        ? [
            "Données complètes",
            "Délai moyen",
            "Risques détectés",
            "Sync bloquée",
          ]
        : ["Data complete", "Average delay", "Risks detected", "Blocked sync"]
      : fr
        ? ["Projets actifs", "À livrer", "Équipes terrain", "Santé système"]
        : ["Active projects", "Due soon", "Field teams", "System health"];

  return (
    <div className="demo-crm">
      <div className="demo-metrics">
        {metrics.map((metric, index) => (
          <article key={labels[index]}>
            <span>{labels[index]}</span>
            <strong>{metric}</strong>
            <small>{index === 3 ? "SLA" : `+${index + 2} %`}</small>
          </article>
        ))}
      </div>
      <div className="demo-split">
        <article className="demo-table-card">
          <header>
            <div>
              <span>{fr ? "Portefeuille" : "Portfolio"}</span>
              <h3>{fr ? "Projets prioritaires" : "Priority projects"}</h3>
            </div>
            <button type="button">{fr ? "Filtrer" : "Filter"}</button>
          </header>
          <div className="demo-table">
            {[
              [
                "DÉMO-2604",
                fr ? "Inspection réseau nord" : "North network inspection",
                "82 %",
              ],
              [
                "DÉMO-2598",
                fr ? "Réhabilitation secteur 4" : "Sector 4 rehabilitation",
                "64 %",
              ],
              [
                "DÉMO-2571",
                fr ? "Programme annuel CCTV" : "Annual CCTV program",
                "91 %",
              ],
            ].map((row, index) => (
              <div key={row[0]}>
                <span>{row[0]}</span>
                <strong>{row[1]}</strong>
                <i style={{ "--progress": row[2] } as React.CSSProperties} />
                <b>{row[2]}</b>
                <em className={index === 1 ? "is-warning" : ""}>
                  {index === 1
                    ? fr
                      ? "À surveiller"
                      : "Watch"
                    : fr
                      ? "En cours"
                      : "Active"}
                </em>
              </div>
            ))}
          </div>
        </article>
        <article className="demo-activity">
          <span>{fr ? "Flux temps réel" : "Live activity"}</span>
          <h3>{fr ? "Dernières opérations" : "Latest operations"}</h3>
          <ol>
            <li>
              <i />
              <div>
                <strong>{fr ? "Rapport validé" : "Report validated"}</strong>
                <small>DÉMO-2604 · 09:42</small>
              </div>
            </li>
            <li>
              <i />
              <div>
                <strong>{fr ? "Synchronisation terrain" : "Field sync"}</strong>
                <small>Équipe 03 · 09:18</small>
              </div>
            </li>
            <li>
              <i />
              <div>
                <strong>{fr ? "Risque anticipé" : "Risk anticipated"}</strong>
                <small>DÉMO-2598 · 08:55</small>
              </div>
            </li>
          </ol>
        </article>
      </div>
    </div>
  );
}

function PortalDemo({
  locale,
  activeTab,
}: {
  locale: Locale;
  activeTab: number;
}) {
  const fr = locale === "fr";
  const views = [
    [
      [
        fr ? "Projet Réseau Est" : "East Network Project",
        fr ? "3 nouveaux livrables" : "3 new deliverables",
        "75 %",
      ],
      [
        fr ? "Secteur municipal 08" : "Municipal Sector 08",
        fr ? "Rapport final publié" : "Final report published",
        "100 %",
      ],
    ],
    [
      [
        fr ? "Rapport d’inspection final" : "Final inspection report",
        "PDF · 18,4 MB",
        fr ? "Publié" : "Published",
      ],
      [
        fr ? "Vidéo annotée" : "Annotated video",
        "MP4 · 1,2 GB",
        fr ? "Lecture" : "View",
      ],
    ],
    [
      [
        fr ? "Nouveau rapport disponible" : "New report available",
        fr ? "Il y a 12 min" : "12 min ago",
        "01",
      ],
      [
        fr ? "Document mis à jour" : "Document updated",
        fr ? "Hier" : "Yesterday",
        "02",
      ],
    ],
  ];

  return (
    <div className="demo-portal">
      <aside>
        <strong>CLIENT/</strong>
        <nav>
          <span className="is-active">
            {fr ? "Tableau de bord" : "Dashboard"}
          </span>
          <span>{fr ? "Mes projets" : "My projects"}</span>
          <span>{fr ? "Notifications" : "Notifications"}</span>
          <span>{fr ? "Profil" : "Profile"}</span>
        </nav>
        <small>{fr ? "Session sécurisée" : "Secure session"}</small>
      </aside>
      <div>
        <header>
          <div>
            <span>
              {fr ? "Bienvenue, Client Démo" : "Welcome, Demo Client"}
            </span>
            <h3>
              {fr
                ? "Vos livrables, au même endroit."
                : "Your deliverables, in one place."}
            </h3>
          </div>
          <b>3 {fr ? "non lus" : "unread"}</b>
        </header>
        <div className="demo-portal-grid">
          {views[activeTab].map((item, index) => (
            <article key={item[0]}>
              <span>0{index + 1}</span>
              <h4>{item[0]}</h4>
              <p>{item[1]}</p>
              <strong>{item[2]}</strong>
              <button type="button">{fr ? "Consulter" : "Open"} →</button>
            </article>
          ))}
        </div>
        <p className="demo-security-note">
          <i aria-hidden="true">✓</i>
          {fr
            ? "Accès limité au client, publications explicites et liens temporaires."
            : "Client-scoped access, explicit publishing, and temporary links."}
        </p>
      </div>
    </div>
  );
}

function MarioDemo({
  locale,
  activeTab,
}: {
  locale: Locale;
  activeTab: number;
}) {
  const fr = locale === "fr";
  const outputs = fr
    ? [
        [
          "Résumé exécutif",
          "L’équipe confirme la livraison du secteur nord vendredi. La validation finale demeure le seul point bloquant.",
        ],
        [
          "Tâches extraites",
          "01 · Thierry — valider le rapport · vendredi\n02 · Équipe terrain — téléverser les vidéos · jeudi",
        ],
        [
          "Décisions",
          "✓ Livraison maintenue vendredi\n✓ Rapport PDF et vidéos publiés ensemble\n✓ Suivi client lundi matin",
        ],
      ]
    : [
        [
          "Executive summary",
          "The team confirms delivery of the north sector on Friday. Final validation remains the only blocker.",
        ],
        [
          "Extracted tasks",
          "01 · Thierry — validate report · Friday\n02 · Field team — upload videos · Thursday",
        ],
        [
          "Decisions",
          "✓ Friday delivery maintained\n✓ PDF report and videos published together\n✓ Client follow-up Monday morning",
        ],
      ];

  return (
    <div className="demo-mario">
      <aside>
        <div className="demo-ai-orb">M</div>
        <strong>MarioAI</strong>
        <small>
          {fr ? "Contexte projet isolé" : "Isolated project context"}
        </small>
        <dl>
          <div>
            <dt>{fr ? "Sources" : "Sources"}</dt>
            <dd>4</dd>
          </div>
          <div>
            <dt>{fr ? "Confiance" : "Confidence"}</dt>
            <dd>92 %</dd>
          </div>
        </dl>
      </aside>
      <div className="demo-chat">
        <div className="demo-message is-user">
          {fr
            ? "Prépare le suivi de la réunion pour le projet DÉMO-2604."
            : "Prepare the meeting follow-up for project DEMO-2604."}
        </div>
        <article className="demo-ai-output">
          <span>{outputs[activeTab][0]}</span>
          <p>{outputs[activeTab][1]}</p>
          <footer>
            <small>
              {fr
                ? "Généré à partir de notes synthétiques"
                : "Generated from synthetic notes"}
            </small>
            <button type="button">{fr ? "Copier" : "Copy"}</button>
          </footer>
        </article>
      </div>
    </div>
  );
}

function AssistDemo({
  locale,
  activeTab,
}: {
  locale: Locale;
  activeTab: number;
}) {
  const fr = locale === "fr";
  const headings = [
    fr ? "Parc surveillé" : "Monitored fleet",
    fr ? "Alertes à traiter" : "Alerts to resolve",
    fr ? "Assistance consentie" : "Consent-based support",
  ];

  return (
    <div className="demo-assist">
      <div className="demo-device-summary">
        <span>{headings[activeTab]}</span>
        <strong>
          {activeTab === 0 ? "47 / 50" : activeTab === 1 ? "03" : "01"}
        </strong>
        <small>
          {fr ? "mise à jour en temps réel" : "updated in real time"}
        </small>
      </div>
      <div className="demo-device-list">
        {[
          [
            "POSTE-014",
            "Sherbrooke",
            "68 %",
            "42 %",
            fr ? "En ligne" : "Online",
          ],
          [
            "POSTE-027",
            "Longueuil",
            "84 %",
            "71 %",
            fr ? "Attention" : "Warning",
          ],
          ["POSTE-031", "Québec", "34 %", "58 %", fr ? "En ligne" : "Online"],
        ].map((device, index) => (
          <article key={device[0]}>
            <i className={index === 1 ? "is-warning" : ""} />
            <div>
              <strong>{device[0]}</strong>
              <small>{device[1]}</small>
            </div>
            <span>CPU {device[2]}</span>
            <span>RAM {device[3]}</span>
            <b>{device[4]}</b>
          </article>
        ))}
      </div>
      <aside className={activeTab === 2 ? "is-consent" : ""}>
        <span>{fr ? "Poste sélectionné" : "Selected device"}</span>
        <h3>POSTE-027</h3>
        <dl>
          <div>
            <dt>OS</dt>
            <dd>Windows 11</dd>
          </div>
          <div>
            <dt>{fr ? "Dernier signal" : "Last signal"}</dt>
            <dd>14 s</dd>
          </div>
          <div>
            <dt>{fr ? "Alertes" : "Alerts"}</dt>
            <dd>1</dd>
          </div>
        </dl>
        <button type="button">
          {activeTab === 2
            ? fr
              ? "Demander le consentement"
              : "Request consent"
            : fr
              ? "Voir le diagnostic"
              : "View diagnostics"}
        </button>
        {activeTab === 2 ? (
          <p>
            {fr
              ? "Aucun contrôle sans acceptation visible."
              : "No control without visible approval."}
          </p>
        ) : null}
      </aside>
    </div>
  );
}

function PipeDemo({
  locale,
  activeTab,
}: {
  locale: Locale;
  activeTab: number;
}) {
  const fr = locale === "fr";
  const bars = [28, 34, 31, 42, 49, 58, 73, 66, 51, 45, 39, 32, 29, 36, 43, 38];

  return (
    <div className="demo-pipe">
      <div className="demo-pipe-scan">
        <span>{fr ? "Profil détecté" : "Detected profile"}</span>
        <div className="demo-pipe-ring">
          <i />
          <b>360°</b>
        </div>
        <dl>
          <div>
            <dt>{fr ? "Ovalisation" : "Ovality"}</dt>
            <dd>{activeTab === 1 ? "4,18 %" : "3,24 %"}</dd>
          </div>
          <div>
            <dt>{fr ? "Confiance" : "Confidence"}</dt>
            <dd>96 %</dd>
          </div>
        </dl>
      </div>
      <div className="demo-pipe-chart">
        <header>
          <div>
            <span>{fr ? "Conduite DÉMO-P08" : "Pipe DEMO-P08"}</span>
            <h3>
              {fr ? "Déformation longitudinale" : "Longitudinal deformation"}
            </h3>
          </div>
          <strong className={activeTab === 1 ? "is-warning" : ""}>
            {activeTab === 2
              ? fr
                ? "4 livrables"
                : "4 deliverables"
              : fr
                ? "Conforme"
                : "Compliant"}
          </strong>
        </header>
        <div
          className="demo-bar-chart"
          aria-label={fr ? "Graphique d’ovalisation" : "Ovality chart"}
        >
          {bars.map((height, index) => (
            <i
              key={`${height}-${index}`}
              style={{ "--bar": `${height}%` } as React.CSSProperties}
              className={height > 65 ? "is-peak" : ""}
            />
          ))}
          <span>5 %</span>
        </div>
        <footer>
          <span>0 m</span>
          <span>36,5 m</span>
          <span>73 m</span>
        </footer>
      </div>
    </div>
  );
}

function NeuroDemo({
  locale,
  activeTab,
}: {
  locale: Locale;
  activeTab: number;
}) {
  const fr = locale === "fr";
  const values =
    activeTab === 0
      ? [68, 46, 78]
      : activeTab === 1
        ? [82, 54, 61]
        : [74, 63, 88];
  return (
    <div className="demo-neuro">
      <div className="demo-brain">
        <span />
        <i />
        <b>{activeTab + 1}</b>
      </div>
      <div className="demo-neuro-data">
        <span>{fr ? "Scénario synthétique" : "Synthetic scenario"}</span>
        <h3>
          {fr
            ? "Trajectoire neurodégénérative"
            : "Neurodegenerative trajectory"}
        </h3>
        {["Amyloïde", "Tau", fr ? "Cognition" : "Cognition"].map(
          (label, index) => (
            <div key={label}>
              <span>{label}</span>
              <i
                style={
                  { "--value": `${values[index]}%` } as React.CSSProperties
                }
              />
              <strong>{values[index]}</strong>
            </div>
          ),
        )}
        <p>
          {fr
            ? "Visualisation éducative — aucune donnée patient."
            : "Educational visualization — no patient data."}
        </p>
      </div>
    </div>
  );
}

function BorealDemo({
  locale,
  activeTab,
}: {
  locale: Locale;
  activeTab: number;
}) {
  const fr = locale === "fr";
  const nodes = [
    fr
      ? ["Opérations", "Planification", "Équipes", "Rapports"]
      : ["Operations", "Planning", "Teams", "Reports"],
    fr
      ? ["Véhicules", "Équipement", "Documents", "Inventaire"]
      : ["Vehicles", "Equipment", "Documents", "Inventory"],
    fr
      ? ["Déclencheur", "Validation", "Action", "Journal"]
      : ["Trigger", "Validation", "Action", "Audit"],
  ][activeTab];

  return (
    <div className="demo-boreal">
      <aside>
        <span>BORÉAL / 01</span>
        <h3>
          {fr
            ? "Un seul système. Une vue claire."
            : "One system. One clear view."}
        </h3>
        <p>
          {fr
            ? "Concept d’architecture pour réunir les opérations sans créer un monolithe."
            : "Architecture concept unifying operations without creating a monolith."}
        </p>
      </aside>
      <div className="demo-node-map">
        {nodes.map((node, index) => (
          <article
            key={node}
            className={index === activeTab ? "is-active" : ""}
          >
            <span>0{index + 1}</span>
            <strong>{node}</strong>
            <small>{index === 3 ? "API" : fr ? "Service" : "Service"}</small>
          </article>
        ))}
        <div className="demo-node-core">
          <span>TR</span>
          <strong>{fr ? "Noyau métier" : "Domain core"}</strong>
        </div>
      </div>
    </div>
  );
}
