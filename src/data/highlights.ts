import type { LocalizedText } from "./profile";

export type Highlight = {
  value: string;
  label: LocalizedText;
};

export type MethodStep = {
  title: LocalizedText;
  detail: LocalizedText;
};

export type QuickWin = {
  title: LocalizedText;
  removed: LocalizedText;
  tags: string[];
};

/** Site-wide impact band. Every figure is countable from the case studies below. */
export const impactHighlights: Highlight[] = [
  {
    value: "7",
    label: {
      fr: "projets documentés, du concept à l’usage quotidien",
      en: "documented projects, from concept to daily use",
    },
  },
  {
    value: "2",
    label: {
      fr: "systèmes internes utilisés chaque semaine par les équipes",
      en: "internal systems used every week by the teams",
    },
  },
  {
    value: "6",
    label: {
      fr: "modules livrés dans le CRM d’opérations",
      en: "modules delivered inside the operations CRM",
    },
  },
  {
    value: "0",
    label: {
      fr: "donnée client exposée dans ce portfolio public",
      en: "client data exposed in this public portfolio",
    },
  },
];

export const methodSteps: MethodStep[] = [
  {
    title: { fr: "Comprendre le terrain", en: "Understand the ground truth" },
    detail: {
      fr: "M’asseoir avec les personnes qui font le travail, suivre un mandat de bout en bout et nommer le problème réel avant de proposer un outil.",
      en: "Sit with the people doing the work, follow a mandate end to end, and name the real problem before proposing a tool.",
    },
  },
  {
    title: { fr: "Modéliser avant de coder", en: "Model before coding" },
    detail: {
      fr: "Poser le modèle de données, les frontières de confiance et les règles de conflit sur papier. Les corriger plus tard coûte beaucoup plus cher.",
      en: "Lay out the data model, trust boundaries, and conflict rules on paper. Fixing them later costs far more.",
    },
  },
  {
    title: { fr: "Livrer par morceaux", en: "Ship in slices" },
    detail: {
      fr: "Un module utilisable à la fois, validé avec l’équipe concernée avant de passer au suivant, plutôt qu’un grand système livré d’un coup.",
      en: "One usable module at a time, validated with the team that needs it before moving on, instead of one big system delivered at once.",
    },
  },
  {
    title: { fr: "Tester ce qui peut échouer", en: "Test what can fail" },
    detail: {
      fr: "Écrire les tests de refus au même titre que les tests de succès, et vérifier la reprise après incident, pas seulement le chemin idéal.",
      en: "Write denial tests alongside success tests, and verify recovery after failure, not just the happy path.",
    },
  },
  {
    title: { fr: "Documenter et transmettre", en: "Document and hand over" },
    detail: {
      fr: "Consigner l’architecture, les décisions et leurs limites pour que le travail reste compréhensible et repris par quelqu’un d’autre.",
      en: "Record the architecture, the decisions, and their limits so the work stays understandable and can be picked up by someone else.",
    },
  },
];

export const methodNote = {
  fr: "J’utilise des outils d’IA au quotidien comme accélérateur, jamais comme autorité : chaque sortie est relue, testée et versionnée comme n’importe quel autre code. Ce portfolio en est un exemple — il est bâti, testé, audité et déployé automatiquement à chaque changement.",
  en: "I use AI tooling daily as an accelerator, never as an authority: every output is reviewed, tested, and versioned like any other code. This portfolio is one example—it is built, tested, audited, and deployed automatically on every change.",
};

export const quickWins: QuickWin[] = [
  {
    title: {
      fr: "Générateur de gabarits Excel et PDF",
      en: "Excel and PDF template generator",
    },
    removed: {
      fr: "Supprime la remise en forme manuelle : les feuilles sortent directement aux normes visuelles de l’entreprise.",
      en: "Removes manual reformatting: sheets come out matching the company's visual standards directly.",
    },
    tags: ["Excel", "PDF", "Gabarits"],
  },
  {
    title: {
      fr: "FFmpeg compilé pour l’assemblage 360°",
      en: "FFmpeg compiled for 360° stitching",
    },
    removed: {
      fr: "Rend exploitable un format vidéo propriétaire qu’aucun outil standard ne savait assembler.",
      en: "Makes a proprietary video format usable when no standard tool could stitch it.",
    },
    tags: ["FFmpeg", "Vidéo 360°", "Compilation"],
  },
  {
    title: {
      fr: "Renommage des médias par numéro de regard",
      en: "Media renaming by manhole number",
    },
    removed: {
      fr: "Élimine le renommage manuel de centaines de vidéos avant l’analyse d’un mandat.",
      en: "Eliminates manually renaming hundreds of videos before a mandate is analyzed.",
    },
    tags: ["Python", "Traitement par lots"],
  },
  {
    title: {
      fr: "Signatures courriel uniformisées",
      en: "Standardized email signatures",
    },
    removed: {
      fr: "Remplace les signatures montées à la main par un générateur HTML cohérent pour toute l’entreprise.",
      en: "Replaces hand-built signatures with one consistent HTML generator for the whole company.",
    },
    tags: ["HTML", "Outillage interne"],
  },
  {
    title: {
      fr: "Suivi de complétion depuis SharePoint",
      en: "Completion tracking from SharePoint",
    },
    removed: {
      fr: "Remplace le pointage manuel des dossiers par un état de complétion consultable directement.",
      en: "Replaces manual folder checking with a completion state you can consult directly.",
    },
    tags: ["Microsoft 365", "SharePoint", "Automatisation"],
  },
  {
    title: {
      fr: "Graphiques de profilométrie relisibles",
      en: "More legible profilometry graphs",
    },
    removed: {
      fr: "Améliore la lisibilité des graphiques livrés au client sans toucher aux données mesurées.",
      en: "Improves the legibility of client-facing graphs without altering the measured data.",
    },
    tags: ["Python", "Visualisation"],
  },
];
