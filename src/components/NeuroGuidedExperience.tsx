"use client";

import type { Locale } from "@/src/data/profile";

export type NeuroAudienceMode = "guided" | "laboratory";

type GuidedMetrics = {
  cognition: number;
  hippocampus: number;
  amyloid: number;
  tau: number;
};

type GuidedExperienceProps = {
  locale: Locale;
  mode: NeuroAudienceMode;
  onModeChange: (mode: NeuroAudienceMode) => void;
  year: number;
  playing: boolean;
  treatmentName: string;
  hasTreatment: boolean;
  selectedRegionName: string;
  selectedRegionFunction: string;
  activeDiseaseNames: string[];
  metrics: GuidedMetrics;
  baselineMetrics: GuidedMetrics;
};

type BrainGuideProps = {
  locale: Locale;
  year: number;
  playing: boolean;
  treatmentName: string;
  hasTreatment: boolean;
};

const getStageIndex = (year: number) => {
  if (year < 1.5) return 0;
  if (year < 3.5) return 1;
  if (year < 6.5) return 2;
  return 3;
};

export function NeuroBrainGuide({
  locale,
  year,
  playing,
  treatmentName,
  hasTreatment,
}: BrainGuideProps) {
  const stageIndex = getStageIndex(year);
  const copy = {
    fr: {
      label: playing ? "LA SIMULATION AVANCE" : "CE QUE VOUS VOYEZ",
      stages: [
        {
          title: "Point de départ",
          body: "Le cerveau sert de référence. Les couleurs montrent déjà où les protéines et les connexions sont suivies.",
        },
        {
          title: "Premiers changements",
          body: "Les signaux orange et roses augmentent dans certaines zones liées à la mémoire. Les lignes montrent la communication entre régions.",
        },
        {
          title: "Progression visible",
          body: "Le modèle simule davantage de protéines anormales et une communication moins efficace entre certains réseaux.",
        },
        {
          title: "Trajectoire à long terme",
          body: "Les différences avec le point de départ sont plus faciles à voir. Comparez maintenant un autre scénario.",
        },
      ],
      treatment: hasTreatment
        ? `${treatmentName} est appliqué à cette trajectoire synthétique.`
        : "Aucun traitement n’est appliqué à cette trajectoire de référence.",
    },
    en: {
      label: playing ? "SIMULATION IN PROGRESS" : "WHAT YOU ARE SEEING",
      stages: [
        {
          title: "Starting point",
          body: "The brain is the reference. Colors already show where proteins and connections are being tracked.",
        },
        {
          title: "Early changes",
          body: "Orange and pink signals increase in some memory-related areas. Lines show communication between regions.",
        },
        {
          title: "Visible progression",
          body: "The model simulates more abnormal proteins and less efficient communication across some networks.",
        },
        {
          title: "Long-term trajectory",
          body: "Differences from the starting point are easier to see. You can now compare another scenario.",
        },
      ],
      treatment: hasTreatment
        ? `${treatmentName} is applied to this synthetic trajectory.`
        : "No treatment is applied to this reference trajectory.",
    },
  }[locale];
  const stage = copy.stages[stageIndex];

  return (
    <div className="neuro-brain-guide" aria-live="polite">
      <div>
        <i data-playing={playing} aria-hidden="true" />
        <span>{copy.label}</span>
        <b>
          T+{year.toFixed(2)} {locale === "fr" ? "ans" : "years"}
        </b>
      </div>
      <strong>{stage.title}</strong>
      <p>{stage.body}</p>
      <small>{copy.treatment}</small>
    </div>
  );
}

export function NeuroGuidedExperience({
  locale,
  mode,
  onModeChange,
  year,
  playing,
  treatmentName,
  hasTreatment,
  selectedRegionName,
  selectedRegionFunction,
  activeDiseaseNames,
  metrics,
  baselineMetrics,
}: GuidedExperienceProps) {
  const stageIndex = getStageIndex(year);
  const cognitionDifference = metrics.cognition - baselineMetrics.cognition;
  const amyloidDifference = baselineMetrics.amyloid - metrics.amyloid;
  const copy = {
    fr: {
      eyebrow: "DEUX NIVEAUX DE LECTURE",
      title: "Choisissez comment explorer le cerveau",
      guided: "Mode guidé",
      laboratory: "Mode laboratoire",
      guidedDescription:
        "Une visite en langage simple explique les couleurs, le temps et l’effet simulé du scénario.",
      laboratoryDescription:
        "Tous les biomarqueurs, couches 3D, statistiques, ROI et outils du laboratoire.",
      status: playing
        ? "Lecture guidée en cours"
        : "Prêt pour la visite guidée",
      statusBody: playing
        ? "La ligne du temps avance automatiquement. Le commentaire du cerveau change à chaque étape."
        : "Cliquez sur « Lancer la visite guidée » pour voir la trajectoire évoluer et être expliquée.",
      stages: [
        ["0–1,5 an", "Point de départ"],
        ["1,5–3,5 ans", "Premiers changements"],
        ["3,5–6,5 ans", "Progression"],
        ["6,5–10 ans", "Long terme"],
      ],
      understand: "Comprendre l’image",
      understandBody:
        "Orange = amyloïde. Rose = tau. Turquoise = région sélectionnée. Les lignes représentent les connexions entre les zones du cerveau.",
      scenario: "Ce que change le scénario",
      scenarioReference:
        "Vous regardez la trajectoire de référence sans intervention. Elle sert de point de comparaison.",
      scenarioTreatment: `${treatmentName} conserve ici ${Math.max(0, cognitionDifference).toFixed(1)} point(s) sur l’indice cognitif et réduit le signal amyloïde de ${Math.max(0, amyloidDifference).toFixed(1)} point(s) face à la référence. Ces valeurs sont entièrement synthétiques.`,
      region: "Zone actuellement expliquée",
      diseases: "Maladies superposées",
      oneDisease: "maladie",
      manyDiseases: "maladies",
      metricsTitle: "Les quatre nombres, en clair",
      metricCards: [
        {
          label: "Mémoire et raisonnement",
          value: metrics.cognition,
          hint: "Plus ce nombre est haut, mieux les fonctions cognitives sont préservées dans le modèle.",
          direction: "PLUS HAUT = MIEUX",
        },
        {
          label: "Santé de l’hippocampe",
          value: metrics.hippocampus,
          hint: "Cette petite région joue un rôle central dans la formation de nouveaux souvenirs.",
          direction: "PLUS HAUT = MIEUX",
        },
        {
          label: "Protéine amyloïde",
          value: metrics.amyloid,
          hint: "Le modèle représente son accumulation par les signaux orange.",
          direction: "PLUS BAS = MIEUX",
        },
        {
          label: "Protéine tau",
          value: metrics.tau,
          hint: "Le modèle représente sa propagation par les signaux roses.",
          direction: "PLUS BAS = MIEUX",
        },
      ],
      notice:
        "Cette visite sert à comprendre une simulation éducative, pas à prédire l’évolution d’une personne.",
    },
    en: {
      eyebrow: "TWO LEVELS OF READING",
      title: "Choose how to explore the brain",
      guided: "Guided mode",
      laboratory: "Laboratory mode",
      guidedDescription:
        "A plain-language tour explains the colors, timeline, and simulated effect of the scenario.",
      laboratoryDescription:
        "All biomarkers, 3D layers, statistics, ROIs, and laboratory tools.",
      status: playing
        ? "Guided playback in progress"
        : "Ready for the guided tour",
      statusBody: playing
        ? "The timeline is advancing automatically. The brain commentary changes at every stage."
        : "Select “Start guided tour” to watch the trajectory evolve with a clear explanation.",
      stages: [
        ["0–1.5 years", "Starting point"],
        ["1.5–3.5 years", "Early changes"],
        ["3.5–6.5 years", "Progression"],
        ["6.5–10 years", "Long term"],
      ],
      understand: "How to read the image",
      understandBody:
        "Orange = amyloid. Pink = tau. Turquoise = selected region. Lines represent connections between brain areas.",
      scenario: "What the scenario changes",
      scenarioReference:
        "You are viewing the reference trajectory without intervention. It is the comparison point.",
      scenarioTreatment: `${treatmentName} preserves ${Math.max(0, cognitionDifference).toFixed(1)} point(s) on the cognitive index and reduces the amyloid signal by ${Math.max(0, amyloidDifference).toFixed(1)} point(s) versus the reference. These values are entirely synthetic.`,
      region: "Area currently explained",
      diseases: "Overlaid diseases",
      oneDisease: "disease",
      manyDiseases: "diseases",
      metricsTitle: "The four numbers, in plain language",
      metricCards: [
        {
          label: "Memory and reasoning",
          value: metrics.cognition,
          hint: "The higher this number, the more cognitive function is preserved in the model.",
          direction: "HIGHER = BETTER",
        },
        {
          label: "Hippocampus health",
          value: metrics.hippocampus,
          hint: "This small region plays a central role in forming new memories.",
          direction: "HIGHER = BETTER",
        },
        {
          label: "Amyloid protein",
          value: metrics.amyloid,
          hint: "The model represents its accumulation with orange signals.",
          direction: "LOWER = BETTER",
        },
        {
          label: "Tau protein",
          value: metrics.tau,
          hint: "The model represents its spread with pink signals.",
          direction: "LOWER = BETTER",
        },
      ],
      notice:
        "This tour explains an educational simulation; it does not predict any individual’s progression.",
    },
  }[locale];

  return (
    <section
      className={`neuro-guided-experience is-${mode}`}
      aria-labelledby="neuro-reading-mode-title"
    >
      <header>
        <div>
          <span>{copy.eyebrow}</span>
          <h2 id="neuro-reading-mode-title">{copy.title}</h2>
        </div>
        <div className="neuro-mode-switch" role="group" aria-label={copy.title}>
          <button
            type="button"
            aria-pressed={mode === "guided"}
            onClick={() => onModeChange("guided")}
          >
            <span aria-hidden="true">◎</span>
            <strong>{copy.guided}</strong>
            <small>{copy.guidedDescription}</small>
          </button>
          <button
            type="button"
            aria-pressed={mode === "laboratory"}
            onClick={() => onModeChange("laboratory")}
          >
            <span aria-hidden="true">⌬</span>
            <strong>{copy.laboratory}</strong>
            <small>{copy.laboratoryDescription}</small>
          </button>
        </div>
      </header>

      {mode === "guided" ? (
        <div className="neuro-guide-body">
          <div className="neuro-guide-status" aria-live="polite">
            <span className={playing ? "is-playing" : undefined}>
              <i aria-hidden="true" />
              {copy.status}
            </span>
            <strong>{copy.statusBody}</strong>
          </div>

          <ol className="neuro-guide-steps" aria-label={copy.status}>
            {copy.stages.map(([range, label], index) => (
              <li
                key={range}
                className={index === stageIndex ? "is-current" : undefined}
                aria-current={index === stageIndex ? "step" : undefined}
              >
                <span>{index + 1}</span>
                <small>{range}</small>
                <strong>{label}</strong>
              </li>
            ))}
          </ol>

          <div className="neuro-guide-explainers">
            <article>
              <span aria-hidden="true">01</span>
              <div>
                <h3>{copy.understand}</h3>
                <p>{copy.understandBody}</p>
              </div>
            </article>
            <article>
              <span aria-hidden="true">02</span>
              <div>
                <h3>{copy.scenario}</h3>
                <p>
                  {hasTreatment
                    ? copy.scenarioTreatment
                    : copy.scenarioReference}
                </p>
              </div>
            </article>
            <article>
              <span aria-hidden="true">03</span>
              <div>
                <h3>{copy.region}</h3>
                <p>
                  <strong>{selectedRegionName}.</strong>{" "}
                  {selectedRegionFunction}
                </p>
                <small>
                  {copy.diseases}: {activeDiseaseNames.join(", ")} ·{" "}
                  {activeDiseaseNames.length}{" "}
                  {activeDiseaseNames.length === 1
                    ? copy.oneDisease
                    : copy.manyDiseases}
                </small>
              </div>
            </article>
          </div>

          <div className="neuro-guide-metrics">
            <h3>{copy.metricsTitle}</h3>
            <div>
              {copy.metricCards.map((metric) => (
                <article key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{Math.round(metric.value)}</strong>
                  <em>{metric.direction}</em>
                  <p>{metric.hint}</p>
                </article>
              ))}
            </div>
          </div>

          <p className="neuro-guide-notice">
            <span aria-hidden="true">i</span>
            {copy.notice}
          </p>
        </div>
      ) : null}
    </section>
  );
}
