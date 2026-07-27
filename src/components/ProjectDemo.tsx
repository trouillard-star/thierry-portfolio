"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import type { Locale } from "@/src/data/profile";

type DemoCopy = {
  title: string;
  subtitle: string;
  tabs: string[];
};

type DemoProps = {
  locale: Locale;
  activeTab: number;
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
      subtitle: "Publications contrôlées · environnement de démonstration",
      tabs: ["Projets", "Livrables", "Notifications"],
    },
    en: {
      title: "Secure client workspace",
      subtitle: "Controlled publishing · demonstration environment",
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
      subtitle: "Inspection synthétique · mesures et livrables",
      tabs: ["Analyse", "Qualité", "Livrables"],
    },
    en: {
      title: "Pipe360 · Profile analysis",
      subtitle: "Synthetic inspection · measurements and deliverables",
      tabs: ["Analysis", "Quality", "Deliverables"],
    },
  },
};

function downloadText(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  }
}

function DemoFeedback({ message }: { message: string }) {
  return (
    <p className="demo-feedback" aria-live="polite">
      <i aria-hidden="true">✓</i>
      {message}
    </p>
  );
}

export function ProjectDemo({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const [session, setSession] = useState(0);
  const copy = demos[slug]?.[locale];
  const fr = locale === "fr";

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
          {fr
            ? "Mini-application interactive · données anonymisées"
            : "Interactive mini application · anonymized data"}
        </span>
        <strong>
          <i aria-hidden="true" />
          {fr ? "Prêt à essayer" : "Ready to try"}
        </strong>
      </div>

      <header className="demo-heading">
        <div>
          <span>{copy.subtitle}</span>
          <h2 id={`demo-${slug}-title`}>{copy.title}</h2>
        </div>
        <div className="demo-heading-actions">
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
          <button
            className="demo-reset"
            type="button"
            onClick={() => {
              setSession((value) => value + 1);
              setActiveTab(0);
            }}
          >
            ↻ {fr ? "Réinitialiser" : "Reset"}
          </button>
        </div>
      </header>

      <div className="demo-stage">
        {slug === "operations-crm" ? (
          <CrmDemo key={session} locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "secure-client-portal" ? (
          <PortalDemo key={session} locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "mario-ai" ? (
          <MarioDemo key={session} locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "remote-assist" ? (
          <AssistDemo key={session} locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "pipe360-profiler" ? (
          <PipeDemo key={session} locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "neuro-lens" ? (
          <NeuroDemo key={session} locale={locale} activeTab={activeTab} />
        ) : null}
        {slug === "boreal" ? (
          <BorealDemo key={session} locale={locale} activeTab={activeTab} />
        ) : null}
      </div>
    </section>
  );
}

type CrmStatus = "active" | "review" | "ready";
type CrmProject = {
  id: string;
  name: string;
  client: string;
  team: string;
  status: CrmStatus;
  progress: number;
  risk: number;
  due: string;
};

function getCrmProjects(fr: boolean): CrmProject[] {
  return [
    {
      id: "DÉMO-2604",
      name: fr ? "Inspection réseau nord" : "North network inspection",
      client: fr ? "Ville Boréale" : "Boreal City",
      team: "Terrain 03",
      status: "active",
      progress: 82,
      risk: 18,
      due: "30 juil.",
    },
    {
      id: "DÉMO-2598",
      name: fr ? "Réhabilitation secteur 4" : "Sector 4 rehabilitation",
      client: fr ? "Municipalité Est" : "East Municipality",
      team: "Terrain 07",
      status: "review",
      progress: 64,
      risk: 72,
      due: "28 juil.",
    },
    {
      id: "DÉMO-2571",
      name: fr ? "Programme annuel CCTV" : "Annual CCTV program",
      client: fr ? "Régie Centre" : "Central Authority",
      team: "Analyse 02",
      status: "ready",
      progress: 91,
      risk: 12,
      due: "2 août",
    },
    {
      id: "DÉMO-2542",
      name: fr ? "Collecteur principal ouest" : "West trunk collector",
      client: fr ? "Agglomération Sud" : "South District",
      team: "Terrain 01",
      status: "active",
      progress: 47,
      risk: 34,
      due: "8 août",
    },
  ];
}

function CrmDemo({ locale, activeTab }: DemoProps) {
  const fr = locale === "fr";
  const [projects, setProjects] = useState(() => getCrmProjects(fr));
  const [selectedId, setSelectedId] = useState("DÉMO-2604");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | CrmStatus>("all");
  const [newProject, setNewProject] = useState("");
  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([
    {
      id: 1,
      label: fr ? "Valider le rapport PDF" : "Validate PDF report",
      done: true,
    },
    {
      id: 2,
      label: fr ? "Recevoir les vidéos terrain" : "Receive field videos",
      done: true,
    },
    {
      id: 3,
      label: fr ? "Publier au portail client" : "Publish to client portal",
      done: false,
    },
  ]);
  const [activity, setActivity] = useState([
    fr ? "Rapport validé · DÉMO-2604" : "Report validated · DEMO-2604",
    fr ? "Synchronisation terrain · Équipe 03" : "Field sync · Team 03",
    fr ? "Risque anticipé · DÉMO-2598" : "Risk anticipated · DEMO-2598",
  ]);
  const [feedback, setFeedback] = useState(
    fr
      ? "Sélectionnez un projet pour agir."
      : "Select a project to take action.",
  );
  const [analysisRun, setAnalysisRun] = useState(0);

  const selected =
    projects.find((project) => project.id === selectedId) ?? projects[0];
  const visibleProjects = projects.filter((project) => {
    const matchesQuery = `${project.id} ${project.name} ${project.client}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (filter === "all" || project.status === filter);
  });
  const averageProgress = Math.round(
    projects.reduce((total, project) => total + project.progress, 0) /
      projects.length,
  );
  const highRisks = projects.filter((project) => project.risk >= 50).length;

  function statusLabel(status: CrmStatus) {
    const labels = {
      active: fr ? "En cours" : "Active",
      review: fr ? "À surveiller" : "Watch",
      ready: fr ? "Prêt à livrer" : "Ready",
    };
    return labels[status];
  }

  function updateSelected(patch: Partial<CrmProject>, note: string) {
    setProjects((items) =>
      items.map((project) =>
        project.id === selected.id ? { ...project, ...patch } : project,
      ),
    );
    setActivity((items) => [note, ...items].slice(0, 5));
    setFeedback(note);
  }

  function addProject(event: FormEvent) {
    event.preventDefault();
    if (!newProject.trim()) return;
    const id = `DÉMO-${2610 + projects.length}`;
    const project: CrmProject = {
      id,
      name: newProject.trim(),
      client: fr ? "Client démonstration" : "Demo client",
      team: fr ? "À assigner" : "Unassigned",
      status: "active",
      progress: 8,
      risk: 22,
      due: fr ? "À planifier" : "To schedule",
    };
    setProjects((items) => [project, ...items]);
    setSelectedId(id);
    setNewProject("");
    setFeedback(fr ? `${id} a été créé.` : `${id} was created.`);
  }

  function addTask(event: FormEvent) {
    event.preventDefault();
    if (!newTask.trim()) return;
    setTasks((items) => [
      ...items,
      { id: Date.now(), label: newTask.trim(), done: false },
    ]);
    setNewTask("");
    setFeedback(fr ? "Nouvelle tâche ajoutée." : "New task added.");
  }

  return (
    <div className="demo-app demo-crm-pro">
      <div className="demo-metrics">
        {[
          [
            String(projects.length),
            fr ? "Projets suivis" : "Tracked projects",
            "+1",
          ],
          [
            `${averageProgress} %`,
            fr ? "Avancement moyen" : "Average progress",
            "+4 %",
          ],
          [
            String(highRisks),
            fr ? "Risque élevé" : "High risk",
            highRisks ? "Action" : "OK",
          ],
          ["98,7 %", fr ? "Synchronisation" : "Synchronization", "SLA"],
        ].map(([value, label, trend]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{trend}</small>
          </article>
        ))}
      </div>

      {activeTab === 0 ? (
        <>
          <div className="demo-toolbar">
            <label>
              <span>{fr ? "Rechercher" : "Search"}</span>
              <input
                aria-label={fr ? "Rechercher un projet" : "Search projects"}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  fr ? "Projet, client, numéro…" : "Project, client, number…"
                }
              />
            </label>
            <label>
              <span>{fr ? "Statut" : "Status"}</span>
              <select
                value={filter}
                onChange={(event) =>
                  setFilter(event.target.value as "all" | CrmStatus)
                }
              >
                <option value="all">
                  {fr ? "Tous les statuts" : "All statuses"}
                </option>
                <option value="active">{fr ? "En cours" : "Active"}</option>
                <option value="review">{fr ? "À surveiller" : "Watch"}</option>
                <option value="ready">{fr ? "Prêt à livrer" : "Ready"}</option>
              </select>
            </label>
            <form className="demo-inline-form" onSubmit={addProject}>
              <input
                aria-label={fr ? "Nom du nouveau projet" : "New project name"}
                value={newProject}
                onChange={(event) => setNewProject(event.target.value)}
                placeholder={fr ? "Nouveau projet…" : "New project…"}
              />
              <button type="submit">+ {fr ? "Créer" : "Create"}</button>
            </form>
          </div>
          <div className="demo-workspace demo-workspace-wide">
            <article className="demo-panel">
              <header className="demo-panel-header">
                <div>
                  <span>{fr ? "Portefeuille actif" : "Active portfolio"}</span>
                  <h3>
                    {visibleProjects.length}{" "}
                    {fr ? "projets affichés" : "projects shown"}
                  </h3>
                </div>
              </header>
              <div className="demo-data-list">
                {visibleProjects.map((project) => (
                  <button
                    type="button"
                    className={`demo-data-row ${project.id === selected.id ? "is-selected" : ""}`}
                    key={project.id}
                    onClick={() => {
                      setSelectedId(project.id);
                      setFeedback(
                        fr
                          ? `${project.id} sélectionné.`
                          : `${project.id} selected.`,
                      );
                    }}
                  >
                    <span>
                      <b>{project.id}</b>
                      <small>{project.client}</small>
                    </span>
                    <strong>{project.name}</strong>
                    <i
                      style={
                        {
                          "--progress": `${project.progress}%`,
                        } as CSSProperties
                      }
                    />
                    <em className={`status-${project.status}`}>
                      {statusLabel(project.status)}
                    </em>
                  </button>
                ))}
                {visibleProjects.length === 0 ? (
                  <p className="demo-empty">
                    {fr
                      ? "Aucun projet ne correspond aux filtres."
                      : "No project matches."}
                  </p>
                ) : null}
              </div>
            </article>
            <aside className="demo-panel demo-detail-panel">
              <span>{fr ? "Projet sélectionné" : "Selected project"}</span>
              <h3>{selected.id}</h3>
              <p>{selected.name}</p>
              <dl className="demo-kv">
                <div>
                  <dt>{fr ? "Équipe" : "Team"}</dt>
                  <dd>{selected.team}</dd>
                </div>
                <div>
                  <dt>{fr ? "Échéance" : "Due"}</dt>
                  <dd>{selected.due}</dd>
                </div>
                <div>
                  <dt>{fr ? "Risque" : "Risk"}</dt>
                  <dd>{selected.risk} / 100</dd>
                </div>
              </dl>
              <button
                type="button"
                className="demo-primary"
                onClick={() =>
                  updateSelected(
                    { status: "ready", risk: Math.max(8, selected.risk - 25) },
                    fr
                      ? `${selected.id} préparé pour livraison.`
                      : `${selected.id} prepared for delivery.`,
                  )
                }
              >
                {fr ? "Préparer la livraison" : "Prepare delivery"}
              </button>
            </aside>
          </div>
        </>
      ) : null}

      {activeTab === 1 ? (
        <div className="demo-workspace">
          <article className="demo-panel demo-editor">
            <header className="demo-panel-header">
              <div>
                <span>{selected.id}</span>
                <h3>{fr ? "Pilotage du projet" : "Project control"}</h3>
              </div>
              <select
                aria-label={fr ? "Choisir un projet" : "Choose a project"}
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
              >
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.id}
                  </option>
                ))}
              </select>
            </header>
            <label className="demo-range">
              <span>
                {fr ? "Avancement" : "Progress"} <b>{selected.progress} %</b>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={selected.progress}
                onChange={(event) =>
                  updateSelected(
                    { progress: Number(event.target.value) },
                    fr ? "Avancement mis à jour." : "Progress updated.",
                  )
                }
              />
            </label>
            <div className="demo-form-grid">
              <label>
                <span>{fr ? "Statut" : "Status"}</span>
                <select
                  value={selected.status}
                  onChange={(event) =>
                    updateSelected(
                      { status: event.target.value as CrmStatus },
                      fr
                        ? "Statut du projet modifié."
                        : "Project status changed.",
                    )
                  }
                >
                  <option value="active">{fr ? "En cours" : "Active"}</option>
                  <option value="review">
                    {fr ? "À surveiller" : "Watch"}
                  </option>
                  <option value="ready">
                    {fr ? "Prêt à livrer" : "Ready"}
                  </option>
                </select>
              </label>
              <label>
                <span>{fr ? "Équipe responsable" : "Assigned team"}</span>
                <select
                  value={selected.team}
                  onChange={(event) =>
                    updateSelected(
                      { team: event.target.value },
                      fr ? "Équipe réassignée." : "Team reassigned.",
                    )
                  }
                >
                  <option>Terrain 03</option>
                  <option>Terrain 07</option>
                  <option>Analyse 02</option>
                  <option>{fr ? "À assigner" : "Unassigned"}</option>
                </select>
              </label>
            </div>
            <h4>{fr ? "Liste de contrôle" : "Project checklist"}</h4>
            <div className="demo-check-list">
              {tasks.map((task) => (
                <label key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() =>
                      setTasks((items) =>
                        items.map((item) =>
                          item.id === task.id
                            ? { ...item, done: !item.done }
                            : item,
                        ),
                      )
                    }
                  />
                  <span>{task.label}</span>
                </label>
              ))}
            </div>
            <form className="demo-inline-form" onSubmit={addTask}>
              <input
                aria-label={fr ? "Nouvelle tâche" : "New task"}
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                placeholder={fr ? "Ajouter une tâche…" : "Add a task…"}
              />
              <button type="submit">+ {fr ? "Ajouter" : "Add"}</button>
            </form>
          </article>
          <aside className="demo-panel demo-timeline">
            <span>{fr ? "Journal en direct" : "Live audit trail"}</span>
            <h3>{fr ? "Activité récente" : "Recent activity"}</h3>
            <ol>
              {activity.map((item, index) => (
                <li key={`${item}-${index}`}>
                  <i />
                  <div>
                    <strong>{item}</strong>
                    <small>
                      {index === 0
                        ? fr
                          ? "À l’instant"
                          : "Just now"
                        : `${index * 14} min`}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      ) : null}

      {activeTab === 2 ? (
        <div className="demo-workspace">
          <article className="demo-panel demo-intelligence">
            <header className="demo-panel-header">
              <div>
                <span>
                  {fr ? "Moteur de priorisation" : "Prioritization engine"}
                </span>
                <h3>
                  {fr
                    ? "Signaux calculés du portefeuille"
                    : "Computed portfolio signals"}
                </h3>
              </div>
              <button
                type="button"
                className="demo-primary"
                onClick={() => {
                  setAnalysisRun((value) => value + 1);
                  setFeedback(
                    fr
                      ? "Analyse recalculée avec les données actuelles."
                      : "Analysis refreshed with current data.",
                  );
                }}
              >
                {fr ? "Recalculer" : "Refresh analysis"}
              </button>
            </header>
            <div className="demo-score-grid">
              {projects.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                  className={project.id === selected.id ? "is-selected" : ""}
                >
                  <span>{project.id}</span>
                  <strong>{project.risk}</strong>
                  <i
                    style={{ "--score": `${project.risk}%` } as CSSProperties}
                  />
                  <small>
                    {project.risk >= 50
                      ? fr
                        ? "Intervention"
                        : "Intervention"
                      : fr
                        ? "Stable"
                        : "Stable"}
                  </small>
                </button>
              ))}
            </div>
            <div className="demo-recommendation">
              <span>
                {fr ? "Recommandation active" : "Active recommendation"}
              </span>
              <h4>
                {selected.risk >= 50
                  ? fr
                    ? "Sécuriser l’échéance et réassigner une ressource."
                    : "Secure the deadline and reassign one resource."
                  : fr
                    ? "Maintenir le suivi hebdomadaire automatisé."
                    : "Maintain automated weekly monitoring."}
              </h4>
              <p>
                {fr
                  ? `Analyse #${analysisRun + 1} · risque ${selected.risk}/100 · progression ${selected.progress} %.`
                  : `Analysis #${analysisRun + 1} · risk ${selected.risk}/100 · progress ${selected.progress}%.`}
              </p>
              <button
                type="button"
                onClick={() =>
                  updateSelected(
                    {
                      risk: Math.max(5, selected.risk - 35),
                      team: "Analyse 02",
                    },
                    fr
                      ? `Plan de mitigation appliqué à ${selected.id}.`
                      : `Mitigation plan applied to ${selected.id}.`,
                  )
                }
              >
                {fr ? "Appliquer le plan" : "Apply plan"}
              </button>
            </div>
          </article>
          <aside className="demo-panel demo-timeline">
            <span>{fr ? "Capacité équipe" : "Team capacity"}</span>
            <h3>{fr ? "Charge prévue · 7 jours" : "Forecast load · 7 days"}</h3>
            {[
              ["Terrain 03", 78],
              ["Terrain 07", 92],
              ["Analyse 02", 61],
            ].map(([team, value]) => (
              <div className="demo-capacity" key={team}>
                <span>{team}</span>
                <i style={{ "--value": `${value}%` } as CSSProperties} />
                <strong>{value} %</strong>
              </div>
            ))}
          </aside>
        </div>
      ) : null}

      <DemoFeedback message={feedback} />
    </div>
  );
}

type PortalNotification = {
  id: number;
  title: string;
  time: string;
  read: boolean;
};

function PortalDemo({ locale, activeTab }: DemoProps) {
  const fr = locale === "fr";
  const projects = [
    {
      id: "PRJ-104",
      name: fr ? "Réseau Est" : "East Network",
      progress: 75,
      phase: fr ? "Inspection" : "Inspection",
      next: fr
        ? "Rapport préliminaire · 30 juil."
        : "Preliminary report · Jul 30",
    },
    {
      id: "PRJ-098",
      name: fr ? "Secteur municipal 08" : "Municipal Sector 08",
      progress: 100,
      phase: fr ? "Livré" : "Delivered",
      next: fr ? "Archivage · 2 août" : "Archive · Aug 2",
    },
    {
      id: "PRJ-111",
      name: fr ? "Collecteur Ouest" : "West Collector",
      progress: 42,
      phase: fr ? "Terrain" : "Field",
      next: fr ? "Nouvelle visite · 4 août" : "New visit · Aug 4",
    },
  ];
  const deliverables = [
    {
      id: "DOC-301",
      project: "PRJ-104",
      name: fr ? "Rapport d’inspection final" : "Final inspection report",
      type: "PDF",
      size: "18,4 MB",
      version: "v3.2",
    },
    {
      id: "DOC-302",
      project: "PRJ-104",
      name: fr ? "Registre des observations" : "Observation register",
      type: "XLSX",
      size: "2,1 MB",
      version: "v2.0",
    },
    {
      id: "DOC-303",
      project: "PRJ-098",
      name: fr ? "Vidéo annotée" : "Annotated video",
      type: "MP4",
      size: "1,2 GB",
      version: "v1.4",
    },
    {
      id: "DOC-304",
      project: "PRJ-111",
      name: fr ? "Plan de localisation" : "Location plan",
      type: "PDF",
      size: "6,7 MB",
      version: "v1.0",
    },
  ];
  const [selectedProject, setSelectedProject] = useState(projects[0].id);
  const [selectedDocument, setSelectedDocument] = useState(deliverables[0].id);
  const [documentFilter, setDocumentFilter] = useState("ALL");
  const [shareDuration, setShareDuration] = useState("60");
  const [shareLink, setShareLink] = useState("");
  const [notifications, setNotifications] = useState<PortalNotification[]>([
    {
      id: 1,
      title: fr ? "Nouveau rapport disponible" : "New report available",
      time: fr ? "Il y a 12 min" : "12 min ago",
      read: false,
    },
    {
      id: 2,
      title: fr ? "Document mis à jour vers v3.2" : "Document updated to v3.2",
      time: fr ? "Il y a 2 h" : "2 hours ago",
      read: false,
    },
    {
      id: 3,
      title: fr
        ? "Commentaire résolu par l’équipe"
        : "Comment resolved by the team",
      time: fr ? "Hier" : "Yesterday",
      read: false,
    },
  ]);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [feedback, setFeedback] = useState(
    fr ? "Session sécurisée active." : "Secure session active.",
  );
  const currentProject =
    projects.find((project) => project.id === selectedProject) ?? projects[0];
  const currentDocument =
    deliverables.find((document) => document.id === selectedDocument) ??
    deliverables[0];
  const unread = notifications.filter(
    (notification) => !notification.read,
  ).length;
  const visibleDocuments = deliverables.filter(
    (document) => documentFilter === "ALL" || document.type === documentFilter,
  );

  function createShareLink() {
    const link = `https://demo.portail.local/s/${currentDocument.id.toLowerCase()}-${shareDuration}`;
    setShareLink(link);
    setFeedback(
      fr
        ? `Lien temporaire créé pour ${shareDuration} minutes.`
        : `Temporary link created for ${shareDuration} minutes.`,
    );
  }

  return (
    <div className="demo-app demo-portal-pro">
      <div className="demo-portal-topbar">
        <strong>CLIENT/</strong>
        <span>
          <i />{" "}
          {fr
            ? "Session chiffrée · Client Démo"
            : "Encrypted session · Demo Client"}
        </span>
        <b>
          {unread} {fr ? "non lus" : "unread"}
        </b>
      </div>

      {activeTab === 0 ? (
        <div className="demo-workspace demo-portal-workspace">
          <article className="demo-panel">
            <header className="demo-panel-header">
              <div>
                <span>
                  {fr ? "Portefeuille autorisé" : "Authorized portfolio"}
                </span>
                <h3>{fr ? "Mes projets" : "My projects"}</h3>
              </div>
              <small>
                {projects.length} {fr ? "projets" : "projects"}
              </small>
            </header>
            <div className="demo-card-grid">
              {projects.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  className={
                    project.id === selectedProject ? "is-selected" : ""
                  }
                  onClick={() => {
                    setSelectedProject(project.id);
                    setFeedback(
                      fr
                        ? `${project.name} ouvert.`
                        : `${project.name} opened.`,
                    );
                  }}
                >
                  <span>{project.id}</span>
                  <h4>{project.name}</h4>
                  <p>{project.phase}</p>
                  <i
                    style={
                      { "--progress": `${project.progress}%` } as CSSProperties
                    }
                  />
                  <strong>{project.progress} %</strong>
                </button>
              ))}
            </div>
          </article>
          <aside className="demo-panel demo-client-detail">
            <span>{fr ? "Sommaire du projet" : "Project summary"}</span>
            <h3>{currentProject.name}</h3>
            <div className="demo-big-progress">
              <strong>{currentProject.progress} %</strong>
              <i
                style={
                  {
                    "--progress": `${currentProject.progress}%`,
                  } as CSSProperties
                }
              />
            </div>
            <dl className="demo-kv">
              <div>
                <dt>{fr ? "Phase" : "Phase"}</dt>
                <dd>{currentProject.phase}</dd>
              </div>
              <div>
                <dt>{fr ? "Prochaine étape" : "Next step"}</dt>
                <dd>{currentProject.next}</dd>
              </div>
              <div>
                <dt>{fr ? "Livrables" : "Deliverables"}</dt>
                <dd>
                  {
                    deliverables.filter(
                      (document) => document.project === currentProject.id,
                    ).length
                  }
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className="demo-primary"
              onClick={() => {
                const document = deliverables.find(
                  (item) => item.project === currentProject.id,
                );
                if (document) setSelectedDocument(document.id);
                setFeedback(
                  fr
                    ? "Dernier livrable préparé dans l’onglet Livrables."
                    : "Latest deliverable prepared in Deliverables.",
                );
              }}
            >
              {fr
                ? "Préparer le dernier livrable"
                : "Prepare latest deliverable"}
            </button>
          </aside>
        </div>
      ) : null}

      {activeTab === 1 ? (
        <>
          <div className="demo-toolbar demo-toolbar-light">
            <label>
              <span>{fr ? "Type de fichier" : "File type"}</span>
              <select
                value={documentFilter}
                onChange={(event) => setDocumentFilter(event.target.value)}
              >
                <option value="ALL">{fr ? "Tous" : "All"}</option>
                <option value="PDF">PDF</option>
                <option value="XLSX">XLSX</option>
                <option value="MP4">MP4</option>
              </select>
            </label>
            <span className="demo-lock-note">
              ◉ {fr ? "Accès en lecture seule" : "Read-only access"}
            </span>
          </div>
          <div className="demo-workspace demo-portal-workspace">
            <article className="demo-panel">
              <header className="demo-panel-header">
                <div>
                  <span>{fr ? "Centre de documents" : "Document centre"}</span>
                  <h3>
                    {visibleDocuments.length}{" "}
                    {fr ? "livrables publiés" : "published deliverables"}
                  </h3>
                </div>
              </header>
              <div className="demo-document-list">
                {visibleDocuments.map((document) => (
                  <button
                    type="button"
                    key={document.id}
                    className={
                      document.id === selectedDocument ? "is-selected" : ""
                    }
                    onClick={() => setSelectedDocument(document.id)}
                  >
                    <b>{document.type}</b>
                    <span>
                      <strong>{document.name}</strong>
                      <small>
                        {document.project} · {document.size}
                      </small>
                    </span>
                    <em>{document.version}</em>
                  </button>
                ))}
              </div>
            </article>
            <aside className="demo-panel demo-document-preview">
              <span>{fr ? "Aperçu sécurisé" : "Secure preview"}</span>
              <div className="demo-document-page">
                <b>{currentDocument.type}</b>
                <i />
                <i />
                <i />
                <small>{currentDocument.id}</small>
              </div>
              <h3>{currentDocument.name}</h3>
              <p>
                {currentDocument.version} · {currentDocument.size}
              </p>
              <div className="demo-button-row">
                <button
                  type="button"
                  className="demo-primary"
                  onClick={() => {
                    downloadText(
                      `${currentDocument.id}-demo.txt`,
                      `${currentDocument.name}\n${currentDocument.project}\n${currentDocument.version}\n\n${fr ? "Fichier de démonstration anonymisé." : "Anonymized demonstration file."}`,
                    );
                    setFeedback(
                      fr
                        ? "Téléchargement de démonstration lancé."
                        : "Demo download started.",
                    );
                  }}
                >
                  ↓ {fr ? "Télécharger" : "Download"}
                </button>
                <button type="button" onClick={createShareLink}>
                  {fr ? "Créer un lien" : "Create link"}
                </button>
              </div>
              <label>
                <span>{fr ? "Expiration du lien" : "Link expiry"}</span>
                <select
                  value={shareDuration}
                  onChange={(event) => setShareDuration(event.target.value)}
                >
                  <option value="15">15 min</option>
                  <option value="60">1 h</option>
                  <option value="1440">24 h</option>
                </select>
              </label>
              {shareLink ? (
                <button
                  type="button"
                  className="demo-copy-link"
                  onClick={async () => {
                    await copyText(shareLink);
                    setFeedback(
                      fr ? "Lien temporaire copié." : "Temporary link copied.",
                    );
                  }}
                >
                  {shareLink} <b>{fr ? "Copier" : "Copy"}</b>
                </button>
              ) : null}
            </aside>
          </div>
        </>
      ) : null}

      {activeTab === 2 ? (
        <div className="demo-workspace demo-portal-workspace">
          <article className="demo-panel">
            <header className="demo-panel-header">
              <div>
                <span>
                  {fr ? "Centre de notifications" : "Notification centre"}
                </span>
                <h3>
                  {unread} {fr ? "éléments non lus" : "unread items"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNotifications((items) =>
                    items.map((item) => ({ ...item, read: true })),
                  );
                  setFeedback(
                    fr
                      ? "Toutes les notifications sont lues."
                      : "All notifications are read.",
                  );
                }}
              >
                {fr ? "Tout marquer comme lu" : "Mark all as read"}
              </button>
            </header>
            <div className="demo-notification-list">
              {notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={notification.read ? "is-read" : ""}
                  onClick={() => {
                    setNotifications((items) =>
                      items.map((item) =>
                        item.id === notification.id
                          ? { ...item, read: !item.read }
                          : item,
                      ),
                    );
                    setFeedback(
                      fr ? "État de lecture modifié." : "Read state updated.",
                    );
                  }}
                >
                  <i />
                  <span>
                    <strong>{notification.title}</strong>
                    <small>{notification.time}</small>
                  </span>
                  <em>
                    {notification.read
                      ? fr
                        ? "Lu"
                        : "Read"
                      : fr
                        ? "Nouveau"
                        : "New"}
                  </em>
                </button>
              ))}
            </div>
          </article>
          <aside className="demo-panel demo-preferences">
            <span>{fr ? "Préférences" : "Preferences"}</span>
            <h3>{fr ? "Canaux d’avis" : "Notification channels"}</h3>
            <label>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts((value) => !value)}
              />
              <span>{fr ? "Résumé par courriel" : "Email digest"}</span>
            </label>
            <label>
              <input type="checkbox" checked readOnly />
              <span>{fr ? "Alertes dans le portail" : "In-portal alerts"}</span>
            </label>
            <p>
              {emailAlerts
                ? fr
                  ? "Le résumé quotidien est activé."
                  : "Daily digest is enabled."
                : fr
                  ? "Aucun courriel ne sera envoyé."
                  : "No email will be sent."}
            </p>
          </aside>
        </div>
      ) : null}

      <DemoFeedback message={feedback} />
    </div>
  );
}

function MarioDemo({ locale, activeTab }: DemoProps) {
  const fr = locale === "fr";
  const [notes, setNotes] = useState(
    fr
      ? "Réunion DÉMO-2604 : l’équipe terrain téléverse les vidéos jeudi. Thierry valide le rapport vendredi avant 10 h. Livraison client maintenue vendredi. Prévoir un suivi lundi."
      : "DEMO-2604 meeting: field team uploads videos Thursday. Thierry validates the report Friday before 10. Client delivery remains Friday. Schedule a Monday follow-up.",
  );
  const [sources, setSources] = useState(["Réunion", "CRM", "Documents"]);
  const [analysisVersion, setAnalysisVersion] = useState(1);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      owner: "Thierry",
      label: fr ? "Valider le rapport" : "Validate report",
      due: fr ? "Vendredi 10 h" : "Friday 10 AM",
      done: false,
    },
    {
      id: 2,
      owner: fr ? "Équipe terrain" : "Field team",
      label: fr ? "Téléverser les vidéos" : "Upload videos",
      due: fr ? "Jeudi" : "Thursday",
      done: false,
    },
    {
      id: 3,
      owner: "MarioAI",
      label: fr ? "Préparer le suivi client" : "Prepare client follow-up",
      due: fr ? "Lundi" : "Monday",
      done: true,
    },
  ]);
  const [newTask, setNewTask] = useState("");
  const [decisions, setDecisions] = useState([
    {
      id: 1,
      label: fr ? "Maintenir la livraison vendredi" : "Keep Friday delivery",
      approved: true,
    },
    {
      id: 2,
      label: fr
        ? "Publier PDF et vidéos ensemble"
        : "Publish PDF and videos together",
      approved: false,
    },
    {
      id: 3,
      label: fr ? "Faire le suivi lundi matin" : "Follow up Monday morning",
      approved: false,
    },
  ]);
  const [feedback, setFeedback] = useState(
    fr ? "Contexte isolé chargé." : "Isolated context loaded.",
  );
  const confidence = Math.min(
    98,
    68 + sources.length * 7 + Math.floor(notes.length / 80),
  );
  const sourceOptions = ["Réunion", "CRM", "Documents", "Courriels"];
  const summary = fr
    ? `La livraison de DÉMO-2604 demeure prévue vendredi. ${tasks.filter((task) => !task.done).length} actions restent ouvertes; la validation du rapport est le jalon critique.`
    : `DEMO-2604 delivery remains scheduled for Friday. ${tasks.filter((task) => !task.done).length} actions remain open; report validation is the critical milestone.`;

  function runAnalysis() {
    setAnalysisVersion((value) => value + 1);
    setFeedback(
      fr
        ? `Analyse ${analysisVersion + 1} terminée à partir de ${sources.length} sources.`
        : `Analysis ${analysisVersion + 1} completed from ${sources.length} sources.`,
    );
  }

  function addTask(event: FormEvent) {
    event.preventDefault();
    if (!newTask.trim()) return;
    setTasks((items) => [
      ...items,
      {
        id: Date.now(),
        owner: fr ? "À assigner" : "Unassigned",
        label: newTask.trim(),
        due: fr ? "À planifier" : "To schedule",
        done: false,
      },
    ]);
    setNewTask("");
    setFeedback(
      fr ? "Tâche ajoutée au plan d’action." : "Task added to action plan.",
    );
  }

  const copyValue =
    activeTab === 0
      ? summary
      : activeTab === 1
        ? tasks
            .map(
              (task) =>
                `${task.done ? "✓" : "○"} ${task.owner} — ${task.label} — ${task.due}`,
            )
            .join("\n")
        : decisions
            .map(
              (decision) =>
                `${decision.approved ? "✓" : "○"} ${decision.label}`,
            )
            .join("\n");

  return (
    <div className="demo-app demo-mario-pro">
      <div className="demo-ai-status">
        <div className="demo-ai-orb">M</div>
        <div>
          <strong>MarioAI</strong>
          <small>
            {fr ? "Espace projet DÉMO-2604" : "DEMO-2604 project workspace"}
          </small>
        </div>
        <dl>
          <div>
            <dt>{fr ? "Sources" : "Sources"}</dt>
            <dd>{sources.length}</dd>
          </div>
          <div>
            <dt>{fr ? "Confiance" : "Confidence"}</dt>
            <dd>{confidence} %</dd>
          </div>
          <div>
            <dt>{fr ? "Analyse" : "Analysis"}</dt>
            <dd>#{analysisVersion}</dd>
          </div>
        </dl>
      </div>
      <div className="demo-ai-workbench">
        <aside className="demo-panel demo-source-panel">
          <span>{fr ? "Entrée contrôlée" : "Controlled input"}</span>
          <h3>{fr ? "Notes de réunion" : "Meeting notes"}</h3>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={9}
          />
          <div className="demo-source-toggles">
            {sourceOptions.map((source) => (
              <button
                type="button"
                key={source}
                aria-pressed={sources.includes(source)}
                onClick={() =>
                  setSources((items) =>
                    items.includes(source)
                      ? items.filter((item) => item !== source)
                      : [...items, source],
                  )
                }
              >
                {sources.includes(source) ? "✓ " : "+ "}
                {source}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="demo-primary"
            disabled={notes.trim().length < 20 || sources.length === 0}
            onClick={runAnalysis}
          >
            {fr ? "Analyser les notes" : "Analyze notes"}
          </button>
        </aside>
        <article className="demo-panel demo-ai-result">
          <header className="demo-panel-header">
            <div>
              <span>{fr ? "Sortie structurée" : "Structured output"}</span>
              <h3>{demos["mario-ai"][locale].tabs[activeTab]}</h3>
            </div>
            <button
              type="button"
              onClick={async () => {
                await copyText(copyValue);
                setFeedback(
                  fr
                    ? "Résultat copié dans le presse-papiers."
                    : "Result copied to clipboard.",
                );
              }}
            >
              {fr ? "Copier" : "Copy"}
            </button>
          </header>
          {activeTab === 0 ? (
            <div className="demo-summary-output">
              <p>{summary}</p>
              <div className="demo-insight-grid">
                <div>
                  <span>{fr ? "Échéance" : "Deadline"}</span>
                  <strong>{fr ? "Vendredi" : "Friday"}</strong>
                </div>
                <div>
                  <span>{fr ? "Blocage" : "Blocker"}</span>
                  <strong>{fr ? "Validation" : "Validation"}</strong>
                </div>
                <div>
                  <span>{fr ? "Priorité" : "Priority"}</span>
                  <strong>P1</strong>
                </div>
              </div>
              <small>
                {fr
                  ? `${notes.length} caractères analysés · aucune donnée envoyée`
                  : `${notes.length} characters analyzed · no data sent`}
              </small>
            </div>
          ) : null}
          {activeTab === 1 ? (
            <>
              <div className="demo-task-board">
                {tasks.map((task) => (
                  <label key={task.id} className={task.done ? "is-done" : ""}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => {
                        setTasks((items) =>
                          items.map((item) =>
                            item.id === task.id
                              ? { ...item, done: !item.done }
                              : item,
                          ),
                        );
                        setFeedback(
                          fr
                            ? "État de tâche mis à jour."
                            : "Task status updated.",
                        );
                      }}
                    />
                    <span>
                      <strong>{task.label}</strong>
                      <small>
                        {task.owner} · {task.due}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
              <form className="demo-inline-form" onSubmit={addTask}>
                <input
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                  placeholder={fr ? "Ajouter une action…" : "Add an action…"}
                />
                <button type="submit">+ {fr ? "Ajouter" : "Add"}</button>
              </form>
            </>
          ) : null}
          {activeTab === 2 ? (
            <div className="demo-decision-list">
              {decisions.map((decision) => (
                <article
                  key={decision.id}
                  className={decision.approved ? "is-approved" : ""}
                >
                  <span>{decision.approved ? "✓" : "?"}</span>
                  <div>
                    <strong>{decision.label}</strong>
                    <small>
                      {decision.approved
                        ? fr
                          ? "Confirmée"
                          : "Confirmed"
                        : fr
                          ? "Validation requise"
                          : "Approval required"}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDecisions((items) =>
                        items.map((item) =>
                          item.id === decision.id
                            ? { ...item, approved: !item.approved }
                            : item,
                        ),
                      );
                      setFeedback(
                        fr ? "Décision mise à jour." : "Decision updated.",
                      );
                    }}
                  >
                    {decision.approved
                      ? fr
                        ? "Annuler"
                        : "Undo"
                      : fr
                        ? "Approuver"
                        : "Approve"}
                  </button>
                </article>
              ))}
            </div>
          ) : null}
        </article>
      </div>
      <DemoFeedback message={feedback} />
    </div>
  );
}

type AssistConsent = "idle" | "requested" | "accepted" | "ended";

function AssistDemo({ locale, activeTab }: DemoProps) {
  const fr = locale === "fr";
  const devices = [
    {
      code: "POSTE-014",
      city: "Sherbrooke",
      cpu: 38,
      ram: 42,
      disk: 67,
      online: true,
    },
    {
      code: "POSTE-027",
      city: "Longueuil",
      cpu: 84,
      ram: 71,
      disk: 91,
      online: true,
    },
    {
      code: "POSTE-031",
      city: "Québec",
      cpu: 34,
      ram: 58,
      disk: 44,
      online: true,
    },
    {
      code: "POSTE-044",
      city: "Laval",
      cpu: 0,
      ram: 0,
      disk: 53,
      online: false,
    },
  ];
  const [query, setQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState("POSTE-027");
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      device: "POSTE-027",
      label: fr ? "Espace disque critique" : "Critical disk space",
      severity: "critical",
      resolved: false,
    },
    {
      id: 2,
      device: "POSTE-014",
      label: fr ? "Redémarrage recommandé" : "Restart recommended",
      severity: "warning",
      resolved: false,
    },
    {
      id: 3,
      device: "POSTE-044",
      label: fr ? "Agent hors ligne" : "Agent offline",
      severity: "warning",
      resolved: false,
    },
  ]);
  const [consent, setConsent] = useState<AssistConsent>("idle");
  const [seconds, setSeconds] = useState(300);
  const [quality, setQuality] = useState("standard");
  const [feedback, setFeedback] = useState(
    fr ? "Parc synchronisé." : "Fleet synchronized.",
  );
  const selected =
    devices.find((device) => device.code === selectedCode) ?? devices[0];
  const visibleDevices = devices.filter((device) =>
    `${device.code} ${device.city}`.toLowerCase().includes(query.toLowerCase()),
  );
  const unresolved = alerts.filter((alert) => !alert.resolved);

  useEffect(() => {
    if (consent !== "accepted") return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setConsent("ended");
          setFeedback(
            fr
              ? "La session a expiré automatiquement."
              : "The session expired automatically.",
          );
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [consent, fr]);

  const timerLabel = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="demo-app demo-assist-pro">
      <div className="demo-metrics">
        {[
          ["47 / 50", fr ? "Postes en ligne" : "Devices online", "94 %"],
          [
            String(unresolved.length),
            fr ? "Alertes ouvertes" : "Open alerts",
            unresolved.length ? "Action" : "OK",
          ],
          ["99,2 %", fr ? "Disponibilité" : "Availability", "30 j"],
          [
            consent === "accepted" ? "01" : "00",
            fr ? "Session active" : "Active session",
            "TLS",
          ],
        ].map(([value, label, trend]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{trend}</small>
          </article>
        ))}
      </div>

      {activeTab === 0 ? (
        <>
          <div className="demo-toolbar">
            <label>
              <span>{fr ? "Rechercher le parc" : "Search fleet"}</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={fr ? "Poste ou ville…" : "Device or city…"}
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setFeedback(
                  fr
                    ? "Inventaire actualisé · 50 agents contactés."
                    : "Inventory refreshed · 50 agents contacted.",
                )
              }
            >
              ↻ {fr ? "Actualiser l’inventaire" : "Refresh inventory"}
            </button>
          </div>
          <div className="demo-workspace">
            <article className="demo-panel">
              <header className="demo-panel-header">
                <div>
                  <span>{fr ? "Inventaire" : "Inventory"}</span>
                  <h3>
                    {visibleDevices.length}{" "}
                    {fr ? "postes affichés" : "devices shown"}
                  </h3>
                </div>
              </header>
              <div className="demo-device-list-pro">
                {visibleDevices.map((device) => (
                  <button
                    type="button"
                    key={device.code}
                    className={
                      device.code === selected.code ? "is-selected" : ""
                    }
                    onClick={() => setSelectedCode(device.code)}
                  >
                    <i
                      className={
                        device.online
                          ? device.disk > 85
                            ? "is-warning"
                            : ""
                          : "is-offline"
                      }
                    />
                    <span>
                      <strong>{device.code}</strong>
                      <small>{device.city}</small>
                    </span>
                    <em>CPU {device.cpu}%</em>
                    <em>RAM {device.ram}%</em>
                  </button>
                ))}
              </div>
            </article>
            <aside className="demo-panel demo-device-inspector">
              <span>
                {fr ? "Diagnostic lecture seule" : "Read-only diagnostics"}
              </span>
              <h3>{selected.code}</h3>
              <p>{selected.city} · Windows 11 Pro</p>
              {[
                ["CPU", selected.cpu],
                ["RAM", selected.ram],
                [fr ? "Disque" : "Disk", selected.disk],
              ].map(([label, value]) => (
                <div className="demo-capacity" key={String(label)}>
                  <span>{label}</span>
                  <i style={{ "--value": `${value}%` } as CSSProperties} />
                  <strong>{value}%</strong>
                </div>
              ))}
              <button
                type="button"
                className="demo-primary"
                onClick={() =>
                  setFeedback(
                    fr
                      ? `Diagnostic terminé pour ${selected.code} · aucune action intrusive.`
                      : `Diagnostics completed for ${selected.code} · no intrusive action.`,
                  )
                }
              >
                {fr ? "Lancer le diagnostic" : "Run diagnostics"}
              </button>
            </aside>
          </div>
        </>
      ) : null}

      {activeTab === 1 ? (
        <div className="demo-workspace">
          <article className="demo-panel">
            <header className="demo-panel-header">
              <div>
                <span>{fr ? "Centre d’alertes" : "Alert centre"}</span>
                <h3>
                  {unresolved.length}{" "}
                  {fr ? "alertes à traiter" : "alerts to resolve"}
                </h3>
              </div>
            </header>
            <div className="demo-alert-list">
              {alerts.map((alert) => (
                <article
                  key={alert.id}
                  className={alert.resolved ? "is-resolved" : ""}
                >
                  <i className={`severity-${alert.severity}`} />
                  <div>
                    <strong>{alert.label}</strong>
                    <small>
                      {alert.device} · {alert.severity}
                    </small>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAlerts((items) =>
                        items.map((item) =>
                          item.id === alert.id
                            ? { ...item, resolved: !item.resolved }
                            : item,
                        ),
                      );
                      setFeedback(
                        alert.resolved
                          ? fr
                            ? "Alerte rouverte."
                            : "Alert reopened."
                          : fr
                            ? "Alerte résolue et journalisée."
                            : "Alert resolved and logged.",
                      );
                    }}
                  >
                    {alert.resolved
                      ? fr
                        ? "Rouvrir"
                        : "Reopen"
                      : fr
                        ? "Résoudre"
                        : "Resolve"}
                  </button>
                </article>
              ))}
            </div>
          </article>
          <aside className="demo-panel demo-runbook">
            <span>{fr ? "Procédure guidée" : "Guided runbook"}</span>
            <h3>{fr ? "Espace disque critique" : "Critical disk space"}</h3>
            <ol>
              <li>✓ {fr ? "Confirmer la télémétrie" : "Confirm telemetry"}</li>
              <li>
                ✓{" "}
                {fr
                  ? "Identifier les fichiers temporaires"
                  : "Identify temporary files"}
              </li>
              <li>
                ○{" "}
                {fr
                  ? "Demander l’autorisation locale"
                  : "Request local authorization"}
              </li>
              <li>
                ○{" "}
                {fr
                  ? "Vérifier après intervention"
                  : "Verify after intervention"}
              </li>
            </ol>
            <button
              type="button"
              onClick={() =>
                setFeedback(
                  fr
                    ? "Procédure copiée dans le ticket ADE-182."
                    : "Runbook copied to ticket ADE-182.",
                )
              }
            >
              {fr ? "Ajouter au ticket" : "Add to ticket"}
            </button>
          </aside>
        </div>
      ) : null}

      {activeTab === 2 ? (
        <div className="demo-consent-workspace">
          <article className="demo-panel demo-consent-flow">
            <span>{fr ? "Assistance visuelle" : "Visual assistance"}</span>
            <h3>
              {fr
                ? "Consentement explicite et révocable"
                : "Explicit, revocable consent"}
            </h3>
            <div className="demo-consent-steps">
              {[
                [fr ? "Demande" : "Request", consent !== "idle"],
                [
                  fr ? "Acceptation locale" : "Local approval",
                  consent === "accepted" || consent === "ended",
                ],
                [
                  fr ? "Session limitée" : "Limited session",
                  consent === "accepted",
                ],
                [fr ? "Fin + journal" : "End + audit", consent === "ended"],
              ].map(([label, done], index) => (
                <div key={String(label)} className={done ? "is-complete" : ""}>
                  <b>0{index + 1}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="demo-consent-actions">
              {consent === "idle" || consent === "ended" ? (
                <button
                  type="button"
                  className="demo-primary"
                  onClick={() => {
                    setConsent("requested");
                    setSeconds(300);
                    setFeedback(
                      fr
                        ? "Demande envoyée au poste local."
                        : "Request sent to local device.",
                    );
                  }}
                >
                  {fr ? "Demander le consentement" : "Request consent"}
                </button>
              ) : null}
              {consent === "requested" ? (
                <>
                  <p>
                    {fr
                      ? "Le poste affiche maintenant une demande visible à l’utilisateur."
                      : "The device now displays a visible request to the user."}
                  </p>
                  <button
                    type="button"
                    className="demo-primary"
                    onClick={() => {
                      setConsent("accepted");
                      setFeedback(
                        fr
                          ? "Consentement accepté · session lecture seule ouverte."
                          : "Consent accepted · read-only session opened.",
                      );
                    }}
                  >
                    {fr
                      ? "Simuler l’acceptation locale"
                      : "Simulate local approval"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setConsent("idle");
                      setFeedback(
                        fr
                          ? "Demande refusée, aucun accès créé."
                          : "Request denied, no access created.",
                      );
                    }}
                  >
                    {fr ? "Simuler le refus" : "Simulate denial"}
                  </button>
                </>
              ) : null}
              {consent === "accepted" ? (
                <>
                  <div className="demo-session-live">
                    <i />
                    <strong>{fr ? "LECTURE SEULE" : "READ ONLY"}</strong>
                    <b>{timerLabel}</b>
                  </div>
                  <label>
                    <span>{fr ? "Qualité du flux" : "Stream quality"}</span>
                    <select
                      value={quality}
                      onChange={(event) => setQuality(event.target.value)}
                    >
                      <option value="economy">
                        {fr ? "Économie" : "Economy"}
                      </option>
                      <option value="standard">Standard</option>
                      <option value="high">{fr ? "Haute" : "High"}</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    className="demo-danger"
                    onClick={() => {
                      setConsent("ended");
                      setFeedback(
                        fr
                          ? "Session terminée et inscrite au journal."
                          : "Session ended and written to audit log.",
                      );
                    }}
                  >
                    {fr ? "Terminer immédiatement" : "End immediately"}
                  </button>
                </>
              ) : null}
              {consent === "ended" ? (
                <p>
                  ✓{" "}
                  {fr
                    ? "Journal : durée, technicien, poste et motif conservés."
                    : "Audit: duration, technician, device, and reason retained."}
                </p>
              ) : null}
            </div>
          </article>
          <aside className="demo-panel demo-session-preview">
            <span>{selected.code}</span>
            <div className={consent === "accepted" ? "is-live" : ""}>
              <b>ADE</b>
              <i />
              <i />
              <i />
              <strong>
                {consent === "accepted"
                  ? fr
                    ? "Écran partagé"
                    : "Screen shared"
                  : fr
                    ? "Aucun flux actif"
                    : "No active stream"}
              </strong>
            </div>
            <small>
              {fr
                ? `Qualité ${quality} · contrôle clavier/souris désactivé`
                : `${quality} quality · keyboard/mouse control disabled`}
            </small>
          </aside>
        </div>
      ) : null}
      <DemoFeedback message={feedback} />
    </div>
  );
}

type PipeStation = {
  id: string;
  distance: number;
  ovality: number;
  confidence: number;
};

function PipeDemo({ locale, activeTab }: DemoProps) {
  const fr = locale === "fr";
  const stations: PipeStation[] = [
    { id: "S-000", distance: 0, ovality: 2.1, confidence: 98 },
    { id: "S-012", distance: 12.5, ovality: 2.8, confidence: 97 },
    { id: "S-024", distance: 24.7, ovality: 3.5, confidence: 96 },
    { id: "S-036", distance: 36.5, ovality: 5.4, confidence: 94 },
    { id: "S-048", distance: 48.2, ovality: 4.2, confidence: 95 },
    { id: "S-061", distance: 61, ovality: 3.1, confidence: 97 },
    { id: "S-073", distance: 73, ovality: 2.6, confidence: 98 },
  ];
  const [stationIndex, setStationIndex] = useState(3);
  const [cursor, setCursor] = useState(9);
  const [threshold, setThreshold] = useState(5);
  const [annotations, setAnnotations] = useState([
    {
      id: 1,
      station: "S-036",
      label: fr
        ? "Déformation locale à confirmer"
        : "Local deformation to confirm",
    },
  ]);
  const [annotation, setAnnotation] = useState("");
  const [reviewed, setReviewed] = useState<string[]>(["S-000", "S-012"]);
  const [formats, setFormats] = useState({
    csv: true,
    png: true,
    report: true,
  });
  const [feedback, setFeedback] = useState(
    fr ? "Inspection synthétique chargée." : "Synthetic inspection loaded.",
  );
  const station = stations[stationIndex];
  const bars = Array.from({ length: 24 }, (_, index) => {
    const wave = Math.sin((index + stationIndex) * 0.72) * 17;
    return Math.round(
      35 + wave + station.ovality * 5 + (index === cursor ? 16 : 0),
    );
  });
  const flagged = stations.filter((item) => item.ovality > threshold);

  function addAnnotation(event: FormEvent) {
    event.preventDefault();
    if (!annotation.trim()) return;
    setAnnotations((items) => [
      ...items,
      { id: Date.now(), station: station.id, label: annotation.trim() },
    ]);
    setAnnotation("");
    setFeedback(
      fr
        ? `Annotation ajoutée à ${station.id}.`
        : `Annotation added to ${station.id}.`,
    );
  }

  function exportBundle() {
    const selectedFormats = Object.entries(formats)
      .filter(([, enabled]) => enabled)
      .map(([format]) => format.toUpperCase());
    const rows = [
      "station,distance_m,ovality_pct,confidence_pct",
      ...stations.map(
        (item) =>
          `${item.id},${item.distance},${item.ovality},${item.confidence}`,
      ),
    ];
    downloadText(
      "pipe360-demo-export.csv",
      `${rows.join("\n")}\n\nformats=${selectedFormats.join("|")}`,
      "text/csv",
    );
    setFeedback(
      fr
        ? `Export généré : ${selectedFormats.join(", ")}.`
        : `Export generated: ${selectedFormats.join(", ")}.`,
    );
  }

  return (
    <div className="demo-app demo-pipe-pro">
      <div className="demo-pipe-toolbar">
        <label>
          <span>{fr ? "Station active" : "Active station"}</span>
          <select
            value={stationIndex}
            onChange={(event) => setStationIndex(Number(event.target.value))}
          >
            {stations.map((item, index) => (
              <option value={index} key={item.id}>
                {item.id} · {item.distance} m
              </option>
            ))}
          </select>
        </label>
        <label className="demo-range">
          <span>
            {fr ? "Parcourir la conduite" : "Browse the pipe"}{" "}
            <b>{station.distance} m</b>
          </span>
          <input
            type="range"
            min="0"
            max={stations.length - 1}
            value={stationIndex}
            onChange={(event) => setStationIndex(Number(event.target.value))}
          />
        </label>
        <span
          className={
            station.ovality > threshold ? "demo-badge is-warning" : "demo-badge"
          }
        >
          {station.ovality > threshold
            ? fr
              ? "Révision requise"
              : "Review required"
            : fr
              ? "Conforme"
              : "Compliant"}
        </span>
      </div>

      {activeTab === 0 ? (
        <div className="demo-workspace demo-pipe-workspace">
          <aside className="demo-panel demo-pipe-scan-pro">
            <span>
              {fr ? "Profil radial détecté" : "Detected radial profile"}
            </span>
            <div
              className="demo-pipe-ring"
              style={
                { "--pipe-scale": 1 - station.ovality / 100 } as CSSProperties
              }
            >
              <i style={{ transform: `rotate(${cursor * 15}deg)` }} />
              <b>360°</b>
            </div>
            <dl className="demo-kv">
              <div>
                <dt>{fr ? "Ovalisation" : "Ovality"}</dt>
                <dd>{station.ovality.toFixed(2)} %</dd>
              </div>
              <div>
                <dt>{fr ? "Confiance" : "Confidence"}</dt>
                <dd>{station.confidence} %</dd>
              </div>
              <div>
                <dt>{fr ? "Diamètre nominal" : "Nominal diameter"}</dt>
                <dd>900 mm</dd>
              </div>
            </dl>
          </aside>
          <article className="demo-panel demo-pipe-chart-pro">
            <header className="demo-panel-header">
              <div>
                <span>{fr ? "Conduite DÉMO-P08" : "Pipe DEMO-P08"}</span>
                <h3>
                  {fr
                    ? "Déformation longitudinale"
                    : "Longitudinal deformation"}
                </h3>
              </div>
              <strong>{bars[cursor]} mm</strong>
            </header>
            <div className="demo-bar-chart demo-bar-chart-buttons">
              {bars.map((height, index) => (
                <button
                  type="button"
                  key={`${height}-${index}`}
                  aria-label={`${fr ? "Mesure" : "Measurement"} ${index + 1}: ${height} mm`}
                  className={`${height > 70 ? "is-peak" : ""} ${cursor === index ? "is-selected" : ""}`}
                  style={
                    { "--bar": `${Math.min(94, height)}%` } as CSSProperties
                  }
                  onClick={() => setCursor(index)}
                />
              ))}
              <span>{threshold.toFixed(1)} %</span>
            </div>
            <footer>
              <span>0 m</span>
              <span>{station.distance} m</span>
              <span>73 m</span>
            </footer>
            <form className="demo-inline-form" onSubmit={addAnnotation}>
              <input
                value={annotation}
                onChange={(event) => setAnnotation(event.target.value)}
                placeholder={
                  fr ? "Annoter cette station…" : "Annotate this station…"
                }
              />
              <button type="submit">+ {fr ? "Annoter" : "Annotate"}</button>
            </form>
            <div className="demo-annotation-list">
              {annotations
                .filter((item) => item.station === station.id)
                .map((item) => (
                  <span key={item.id}>● {item.label}</span>
                ))}
            </div>
          </article>
        </div>
      ) : null}

      {activeTab === 1 ? (
        <div className="demo-workspace">
          <article className="demo-panel">
            <header className="demo-panel-header">
              <div>
                <span>{fr ? "Contrôle qualité" : "Quality control"}</span>
                <h3>
                  {flagged.length}{" "}
                  {fr
                    ? "stations au-dessus du seuil"
                    : "stations over threshold"}
                </h3>
              </div>
            </header>
            <label className="demo-range">
              <span>
                {fr ? "Seuil d’ovalisation" : "Ovality threshold"}{" "}
                <b>{threshold.toFixed(1)} %</b>
              </span>
              <input
                type="range"
                min="2"
                max="8"
                step="0.1"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
              />
            </label>
            <div className="demo-quality-table">
              {stations.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setStationIndex(stations.indexOf(item))}
                  className={item.id === station.id ? "is-selected" : ""}
                >
                  <span>
                    <strong>{item.id}</strong>
                    <small>{item.distance} m</small>
                  </span>
                  <b>{item.ovality.toFixed(1)} %</b>
                  <em className={item.ovality > threshold ? "is-warning" : ""}>
                    {item.ovality > threshold
                      ? fr
                        ? "À revoir"
                        : "Review"
                      : fr
                        ? "Conforme"
                        : "Pass"}
                  </em>
                  <i>{reviewed.includes(item.id) ? "✓" : "○"}</i>
                </button>
              ))}
            </div>
          </article>
          <aside className="demo-panel demo-review-panel">
            <span>{fr ? "Révision de station" : "Station review"}</span>
            <h3>{station.id}</h3>
            <p>
              {fr
                ? "Comparer le profil, la confiance et le seuil avant validation."
                : "Compare profile, confidence, and threshold before approval."}
            </p>
            <button
              type="button"
              className="demo-primary"
              onClick={() => {
                setReviewed((items) =>
                  items.includes(station.id)
                    ? items.filter((id) => id !== station.id)
                    : [...items, station.id],
                );
                setFeedback(
                  fr ? "État de révision enregistré." : "Review state saved.",
                );
              }}
            >
              {reviewed.includes(station.id)
                ? fr
                  ? "Retirer la validation"
                  : "Remove approval"
                : fr
                  ? "Marquer comme révisé"
                  : "Mark reviewed"}
            </button>
          </aside>
        </div>
      ) : null}

      {activeTab === 2 ? (
        <div className="demo-workspace">
          <article className="demo-panel demo-export-panel">
            <span>
              {fr ? "Générateur de livrables" : "Deliverable generator"}
            </span>
            <h3>
              {fr
                ? "Composer le dossier de révision"
                : "Build the review package"}
            </h3>
            <div className="demo-export-options">
              {Object.entries(formats).map(([format, enabled]) => (
                <label key={format}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() =>
                      setFormats((items) => ({ ...items, [format]: !enabled }))
                    }
                  />
                  <span>
                    <strong>
                      {format === "report" ? "PDF" : format.toUpperCase()}
                    </strong>
                    <small>
                      {format === "csv"
                        ? fr
                          ? "Mesures brutes"
                          : "Raw measurements"
                        : format === "png"
                          ? fr
                            ? "Profils annotés"
                            : "Annotated profiles"
                          : fr
                            ? "Rapport de synthèse"
                            : "Summary report"}
                    </small>
                  </span>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="demo-primary"
              disabled={!Object.values(formats).some(Boolean)}
              onClick={exportBundle}
            >
              ↓ {fr ? "Générer et télécharger" : "Generate and download"}
            </button>
          </article>
          <aside className="demo-panel demo-export-summary">
            <span>{fr ? "Manifeste" : "Manifest"}</span>
            <h3>DÉMO-P08</h3>
            <dl className="demo-kv">
              <div>
                <dt>{fr ? "Stations" : "Stations"}</dt>
                <dd>{stations.length}</dd>
              </div>
              <div>
                <dt>{fr ? "Révisées" : "Reviewed"}</dt>
                <dd>{reviewed.length}</dd>
              </div>
              <div>
                <dt>{fr ? "Annotations" : "Annotations"}</dt>
                <dd>{annotations.length}</dd>
              </div>
              <div>
                <dt>SHA</dt>
                <dd>7F2A…91C4</dd>
              </div>
            </dl>
          </aside>
        </div>
      ) : null}
      <DemoFeedback message={feedback} />
    </div>
  );
}

function NeuroDemo({ locale, activeTab }: DemoProps) {
  const fr = locale === "fr";
  const profiles = [
    { name: fr ? "Progression lente" : "Slow progression", base: [34, 26, 88] },
    {
      name: fr ? "Progression modérée" : "Moderate progression",
      base: [52, 41, 76],
    },
    {
      name: fr ? "Progression accélérée" : "Accelerated progression",
      base: [68, 58, 63],
    },
  ];
  const [profileIndex, setProfileIndex] = useState(1);
  const [year, setYear] = useState(3);
  const [regions, setRegions] = useState(["Hippocampe", "Cortex"]);
  const [cohort, setCohort] = useState(240);
  const [iterations, setIterations] = useState(1000);
  const [studyRun, setStudyRun] = useState(0);
  const [feedback, setFeedback] = useState(
    fr ? "Scénario éducatif chargé." : "Educational scenario loaded.",
  );
  const profile = profiles[profileIndex];
  const values = [
    Math.min(99, profile.base[0] + year * 5),
    Math.min(99, profile.base[1] + year * 4),
    Math.max(18, profile.base[2] - year * 4),
  ];
  const regionOptions = ["Hippocampe", "Cortex", "Thalamus", "Cervelet"];

  function toggleRegion(region: string) {
    setRegions((items) =>
      items.includes(region)
        ? items.filter((item) => item !== region)
        : [...items, region],
    );
  }

  function runStudy(event: FormEvent) {
    event.preventDefault();
    setStudyRun((value) => value + 1);
    setFeedback(
      fr
        ? `Simulation #${studyRun + 1} terminée.`
        : `Simulation #${studyRun + 1} completed.`,
    );
  }

  return (
    <div className="demo-app demo-neuro-pro">
      <div className="demo-neuro-controls">
        <label>
          <span>{fr ? "Profil synthétique" : "Synthetic profile"}</span>
          <select
            value={profileIndex}
            onChange={(event) => setProfileIndex(Number(event.target.value))}
          >
            {profiles.map((item, index) => (
              <option value={index} key={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="demo-range">
          <span>
            {fr ? "Année simulée" : "Simulated year"} <b>{year}</b>
          </span>
          <input
            type="range"
            min="0"
            max="8"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            downloadText(
              "neurolens-synthetic.csv",
              `year,amyloid,tau,cognition\n${year},${values.join(",")}`,
              "text/csv",
            );
            setFeedback(
              fr
                ? "Données synthétiques exportées."
                : "Synthetic data exported.",
            );
          }}
        >
          ↓ CSV
        </button>
      </div>

      {activeTab < 2 ? (
        <div className="demo-workspace demo-neuro-workspace">
          <article className="demo-panel demo-neuro-visual">
            <span>
              {activeTab === 0
                ? fr
                  ? "Carte de biomarqueurs"
                  : "Biomarker map"
                : fr
                  ? "Connectivité fonctionnelle"
                  : "Functional connectivity"}
            </span>
            <div
              className={`demo-brain ${activeTab === 1 ? "is-network" : ""}`}
            >
              <span />
              <i />
              <b>{year}</b>
              {regionOptions.map((region, index) => (
                <button
                  type="button"
                  key={region}
                  className={`region-${index + 1} ${regions.includes(region) ? "is-active" : ""}`}
                  aria-label={region}
                  aria-pressed={regions.includes(region)}
                  onClick={() => toggleRegion(region)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="demo-region-toggles">
              {regionOptions.map((region) => (
                <button
                  type="button"
                  key={region}
                  aria-pressed={regions.includes(region)}
                  onClick={() => toggleRegion(region)}
                >
                  {regions.includes(region) ? "✓ " : "+ "}
                  {region}
                </button>
              ))}
            </div>
          </article>
          <aside className="demo-panel demo-neuro-data">
            <span>{fr ? "Trajectoire calculée" : "Computed trajectory"}</span>
            <h3>{profile.name}</h3>
            {["Amyloïde", "Tau", fr ? "Cognition" : "Cognition"].map(
              (label, index) => (
                <div key={label}>
                  <span>{label}</span>
                  <i
                    style={{ "--value": `${values[index]}%` } as CSSProperties}
                  />
                  <strong>{values[index]}</strong>
                </div>
              ),
            )}
            {activeTab === 1 ? (
              <div className="demo-network-metrics">
                <article>
                  <span>{fr ? "Densité" : "Density"}</span>
                  <strong>{(0.42 + regions.length * 0.06).toFixed(2)}</strong>
                </article>
                <article>
                  <span>{fr ? "Modules" : "Modules"}</span>
                  <strong>{regions.length + 2}</strong>
                </article>
                <article>
                  <span>{fr ? "Connexions" : "Connections"}</span>
                  <strong>{regions.length * 18}</strong>
                </article>
              </div>
            ) : null}
            <p>
              {fr
                ? "Visualisation éducative — aucune donnée patient et aucun diagnostic."
                : "Educational visualization — no patient data and no diagnosis."}
            </p>
          </aside>
        </div>
      ) : null}

      {activeTab === 2 ? (
        <div className="demo-workspace">
          <form className="demo-panel demo-study-builder" onSubmit={runStudy}>
            <span>{fr ? "Planificateur d’étude" : "Study planner"}</span>
            <h3>
              {fr
                ? "Configurer une cohorte synthétique"
                : "Configure a synthetic cohort"}
            </h3>
            <label className="demo-range">
              <span>
                {fr ? "Participants" : "Participants"} <b>{cohort}</b>
              </span>
              <input
                type="range"
                min="60"
                max="600"
                step="20"
                value={cohort}
                onChange={(event) => setCohort(Number(event.target.value))}
              />
            </label>
            <label>
              <span>
                {fr ? "Itérations Monte-Carlo" : "Monte Carlo iterations"}
              </span>
              <select
                value={iterations}
                onChange={(event) => setIterations(Number(event.target.value))}
              >
                <option value="500">500</option>
                <option value="1000">1 000</option>
                <option value="5000">5 000</option>
              </select>
            </label>
            <div className="demo-check-list">
              <label>
                <input type="checkbox" checked readOnly />
                <span>
                  {fr ? "Groupe témoin synthétique" : "Synthetic control group"}
                </span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={regions.length > 2}
                  onChange={() => toggleRegion("Thalamus")}
                />
                <span>
                  {fr ? "Analyse multi-régions" : "Multi-region analysis"}
                </span>
              </label>
            </div>
            <button type="submit" className="demo-primary">
              {fr ? "Lancer la simulation" : "Run simulation"}
            </button>
          </form>
          <aside className="demo-panel demo-study-results">
            <span>{fr ? "Puissance estimée" : "Estimated power"}</span>
            <strong>
              {studyRun ? Math.min(96, 72 + Math.floor(cohort / 25)) : "—"}
              {studyRun ? " %" : ""}
            </strong>
            <dl className="demo-kv">
              <div>
                <dt>{fr ? "Cohorte" : "Cohort"}</dt>
                <dd>{cohort}</dd>
              </div>
              <div>
                <dt>{fr ? "Itérations" : "Iterations"}</dt>
                <dd>{iterations.toLocaleString(locale)}</dd>
              </div>
              <div>
                <dt>{fr ? "Scénario" : "Scenario"}</dt>
                <dd>{profile.name}</dd>
              </div>
            </dl>
            <p>
              {studyRun
                ? fr
                  ? "Résultat simulé prêt à comparer. Usage éducatif seulement."
                  : "Simulated result ready to compare. Educational use only."
                : fr
                  ? "Lancez la simulation pour produire un résultat."
                  : "Run the simulation to produce a result."}
            </p>
          </aside>
        </div>
      ) : null}
      <DemoFeedback message={feedback} />
    </div>
  );
}

type BorealWorkStatus = "planned" | "active" | "done";

function BorealDemo({ locale, activeTab }: DemoProps) {
  const fr = locale === "fr";
  const [orders, setOrders] = useState([
    {
      id: "BT-2041",
      title: fr ? "Inspection collecteur nord" : "North collector inspection",
      team: "Équipe 03",
      status: "active" as BorealWorkStatus,
    },
    {
      id: "BT-2042",
      title: fr ? "Entretien véhicule V-18" : "Vehicle V-18 maintenance",
      team: "Atelier 01",
      status: "planned" as BorealWorkStatus,
    },
    {
      id: "BT-2038",
      title: fr ? "Rapport secteur Est" : "East sector report",
      team: "Analyse 02",
      status: "done" as BorealWorkStatus,
    },
  ]);
  const [assets, setAssets] = useState([
    {
      id: "CAM-360-04",
      type: fr ? "Caméra" : "Camera",
      site: "Sherbrooke",
      health: 94,
      maintenance: false,
    },
    {
      id: "VEH-018",
      type: fr ? "Véhicule" : "Vehicle",
      site: "Longueuil",
      health: 68,
      maintenance: true,
    },
    {
      id: "KIT-007",
      type: fr ? "Profilomètre" : "Profiler",
      site: "Québec",
      health: 87,
      maintenance: false,
    },
    {
      id: "TAB-031",
      type: fr ? "Tablette" : "Tablet",
      site: "Laval",
      health: 76,
      maintenance: false,
    },
  ]);
  const [assetQuery, setAssetQuery] = useState("");
  const [trigger, setTrigger] = useState("risk");
  const [action, setAction] = useState("ticket");
  const [approval, setApproval] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [runs, setRuns] = useState<string[]>([]);
  const [feedback, setFeedback] = useState(
    fr ? "Noyau opérationnel synchronisé." : "Operations core synchronized.",
  );
  const visibleAssets = assets.filter((asset) =>
    `${asset.id} ${asset.type} ${asset.site}`
      .toLowerCase()
      .includes(assetQuery.toLowerCase()),
  );

  function advanceOrder(id: string) {
    setOrders((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const next: Record<BorealWorkStatus, BorealWorkStatus> = {
          planned: "active",
          active: "done",
          done: "planned",
        };
        return { ...item, status: next[item.status] };
      }),
    );
    setFeedback(
      fr
        ? `${id} déplacé à l’étape suivante.`
        : `${id} moved to the next stage.`,
    );
  }

  function runAutomation() {
    const event = `${new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })} · ${trigger} → ${action} · ${approval ? (fr ? "approbation" : "approval") : "auto"}`;
    setRuns((items) => [event, ...items].slice(0, 4));
    setFeedback(
      fr
        ? "Test d’automatisation exécuté et journalisé."
        : "Automation test executed and logged.",
    );
  }

  return (
    <div className="demo-app demo-boreal-pro">
      <div className="demo-boreal-brand">
        <span>BORÉAL / OPS</span>
        <strong>
          {fr ? "Un système. Une vue claire." : "One system. One clear view."}
        </strong>
        <b>
          <i />{" "}
          {enabled
            ? fr
              ? "1 règle active"
              : "1 active rule"
            : fr
              ? "Mode simulation"
              : "Simulation mode"}
        </b>
      </div>

      {activeTab === 0 ? (
        <>
          <div className="demo-metrics">
            {[
              [
                String(
                  orders.filter((order) => order.status === "active").length,
                ),
                fr ? "Travaux actifs" : "Active jobs",
                "Live",
              ],
              [
                String(
                  orders.filter((order) => order.status === "planned").length,
                ),
                fr ? "À planifier" : "To plan",
                "7 j",
              ],
              [
                `${Math.round(assets.reduce((sum, asset) => sum + asset.health, 0) / assets.length)} %`,
                fr ? "Santé des actifs" : "Asset health",
                "+2 %",
              ],
              ["12 min", fr ? "Délai de synchronisation" : "Sync delay", "SLA"],
            ].map(([value, label, trend]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{trend}</small>
              </article>
            ))}
          </div>
          <div className="demo-workspace">
            <article className="demo-panel">
              <header className="demo-panel-header">
                <div>
                  <span>{fr ? "File de travail" : "Work queue"}</span>
                  <h3>
                    {fr ? "Ordres opérationnels" : "Operational work orders"}
                  </h3>
                </div>
              </header>
              <div className="demo-order-board">
                {(["planned", "active", "done"] as BorealWorkStatus[]).map(
                  (status) => (
                    <section key={status}>
                      <h4>
                        {status === "planned"
                          ? fr
                            ? "Planifié"
                            : "Planned"
                          : status === "active"
                            ? fr
                              ? "En cours"
                              : "Active"
                            : fr
                              ? "Terminé"
                              : "Done"}
                      </h4>
                      {orders
                        .filter((order) => order.status === status)
                        .map((order) => (
                          <article key={order.id}>
                            <span>{order.id}</span>
                            <strong>{order.title}</strong>
                            <small>{order.team}</small>
                            <button
                              type="button"
                              onClick={() => advanceOrder(order.id)}
                            >
                              {fr ? "Étape suivante" : "Next stage"} →
                            </button>
                          </article>
                        ))}
                    </section>
                  ),
                )}
              </div>
            </article>
            <aside className="demo-panel demo-ops-feed">
              <span>{fr ? "Signal terrain" : "Field signal"}</span>
              <h3>{fr ? "Événements récents" : "Recent events"}</h3>
              <ol>
                <li>
                  <i />
                  {fr ? "CAM-360-04 synchronisée" : "CAM-360-04 synchronized"}
                </li>
                <li>
                  <i />
                  {fr ? "Rapport BT-2038 approuvé" : "Report BT-2038 approved"}
                </li>
                <li>
                  <i />
                  {fr ? "VEH-018 en entretien" : "VEH-018 in maintenance"}
                </li>
              </ol>
              <button
                type="button"
                onClick={() =>
                  setFeedback(
                    fr
                      ? "Flux actualisé avec les derniers signaux terrain."
                      : "Feed refreshed with latest field signals.",
                  )
                }
              >
                ↻ {fr ? "Actualiser" : "Refresh"}
              </button>
            </aside>
          </div>
        </>
      ) : null}

      {activeTab === 1 ? (
        <>
          <div className="demo-toolbar">
            <label>
              <span>{fr ? "Rechercher les actifs" : "Search assets"}</span>
              <input
                value={assetQuery}
                onChange={(event) => setAssetQuery(event.target.value)}
                placeholder={
                  fr ? "Numéro, type ou site…" : "Number, type, or site…"
                }
              />
            </label>
          </div>
          <div className="demo-workspace">
            <article className="demo-panel">
              <header className="demo-panel-header">
                <div>
                  <span>{fr ? "Registre unifié" : "Unified register"}</span>
                  <h3>
                    {visibleAssets.length}{" "}
                    {fr ? "actifs visibles" : "visible assets"}
                  </h3>
                </div>
              </header>
              <div className="demo-asset-grid">
                {visibleAssets.map((asset) => (
                  <article
                    key={asset.id}
                    className={asset.maintenance ? "is-maintenance" : ""}
                  >
                    <span>{asset.type}</span>
                    <h4>{asset.id}</h4>
                    <p>{asset.site}</p>
                    <div className="demo-capacity">
                      <span>{fr ? "Santé" : "Health"}</span>
                      <i
                        style={
                          { "--value": `${asset.health}%` } as CSSProperties
                        }
                      />
                      <strong>{asset.health}%</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAssets((items) =>
                          items.map((item) =>
                            item.id === asset.id
                              ? { ...item, maintenance: !item.maintenance }
                              : item,
                          ),
                        );
                        setFeedback(
                          fr
                            ? "Plan d’entretien mis à jour."
                            : "Maintenance plan updated.",
                        );
                      }}
                    >
                      {asset.maintenance
                        ? fr
                          ? "Retirer de l’entretien"
                          : "Remove maintenance"
                        : fr
                          ? "Planifier l’entretien"
                          : "Schedule maintenance"}
                    </button>
                  </article>
                ))}
              </div>
            </article>
            <aside className="demo-panel demo-asset-summary">
              <span>{fr ? "Résumé des actifs" : "Asset summary"}</span>
              <h3>
                {assets.filter((asset) => asset.maintenance).length}{" "}
                {fr ? "en entretien" : "in maintenance"}
              </h3>
              <p>
                {fr
                  ? "Les changements sont reflétés immédiatement dans le registre et la planification."
                  : "Changes are reflected immediately in the register and planning."}
              </p>
            </aside>
          </div>
        </>
      ) : null}

      {activeTab === 2 ? (
        <div className="demo-workspace">
          <article className="demo-panel demo-automation-builder">
            <span>{fr ? "Constructeur de règle" : "Rule builder"}</span>
            <h3>
              {fr ? "Automatiser avec garde-fous" : "Automate with guardrails"}
            </h3>
            <div className="demo-rule-flow">
              <label>
                <b>01</b>
                <span>{fr ? "Déclencheur" : "Trigger"}</span>
                <select
                  value={trigger}
                  onChange={(event) => setTrigger(event.target.value)}
                >
                  <option value="risk">
                    {fr ? "Risque projet > 70" : "Project risk > 70"}
                  </option>
                  <option value="offline">
                    {fr ? "Agent hors ligne 30 min" : "Agent offline 30 min"}
                  </option>
                  <option value="delivery">
                    {fr ? "Livrable approuvé" : "Deliverable approved"}
                  </option>
                </select>
              </label>
              <i>→</i>
              <label>
                <b>02</b>
                <span>{fr ? "Action" : "Action"}</span>
                <select
                  value={action}
                  onChange={(event) => setAction(event.target.value)}
                >
                  <option value="ticket">
                    {fr ? "Créer un ticket" : "Create ticket"}
                  </option>
                  <option value="notify">
                    {fr ? "Notifier le responsable" : "Notify owner"}
                  </option>
                  <option value="publish">
                    {fr ? "Préparer la publication" : "Prepare publication"}
                  </option>
                </select>
              </label>
              <i>→</i>
              <label>
                <b>03</b>
                <span>{fr ? "Contrôle" : "Control"}</span>
                <select
                  value={approval ? "approval" : "auto"}
                  onChange={(event) =>
                    setApproval(event.target.value === "approval")
                  }
                >
                  <option value="approval">
                    {fr ? "Approbation humaine" : "Human approval"}
                  </option>
                  <option value="auto">
                    {fr ? "Exécution automatique" : "Automatic execution"}
                  </option>
                </select>
              </label>
            </div>
            <div className="demo-button-row">
              <button
                type="button"
                className="demo-primary"
                onClick={runAutomation}
              >
                {fr ? "Tester la règle" : "Test rule"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnabled((value) => !value);
                  setFeedback(
                    !enabled
                      ? fr
                        ? "Règle activée en mode démonstration."
                        : "Rule enabled in demo mode."
                      : fr
                        ? "Règle désactivée."
                        : "Rule disabled.",
                  );
                }}
              >
                {enabled
                  ? fr
                    ? "Désactiver"
                    : "Disable"
                  : fr
                    ? "Activer"
                    : "Enable"}
              </button>
            </div>
          </article>
          <aside className="demo-panel demo-automation-log">
            <span>{fr ? "Journal d’exécution" : "Execution log"}</span>
            <h3>
              {runs.length
                ? `${runs.length} ${fr ? "tests" : "tests"}`
                : fr
                  ? "Aucun test"
                  : "No test yet"}
            </h3>
            <ol>
              {runs.map((run, index) => (
                <li key={`${run}-${index}`}>
                  <i />
                  {run}
                </li>
              ))}
            </ol>
            <small>
              {fr
                ? "Chaque exécution conserve le déclencheur, l’action et le niveau d’approbation."
                : "Every run retains its trigger, action, and approval level."}
            </small>
          </aside>
        </div>
      ) : null}
      <DemoFeedback message={feedback} />
    </div>
  );
}
