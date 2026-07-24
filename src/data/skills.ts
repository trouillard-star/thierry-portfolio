import type { LocalizedText } from "./profile";

export type SkillGroup = {
  title: LocalizedText;
  summary: LocalizedText;
  skills: string[];
  evidenceSlugs: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: { fr: "Développement logiciel", en: "Software development" },
    summary: {
      fr: "Conception modulaire, logique métier, intégration et maintenance.",
      en: "Modular design, business logic, integration, and maintenance.",
    },
    skills: ["C#", ".NET", "JavaScript", "TypeScript", "Python", "Git"],
    evidenceSlugs: [
      "operations-crm",
      "secure-client-portal",
      "pipe360-profiler",
    ],
  },
  {
    title: { fr: "Frontend", en: "Frontend" },
    summary: {
      fr: "Interfaces accessibles, responsives et orientées vers les tâches.",
      en: "Accessible, responsive, task-oriented interfaces.",
    },
    skills: ["HTML", "CSS", "JavaScript modules", "Three.js concepts"],
    evidenceSlugs: [
      "operations-crm",
      "secure-client-portal",
      "pipe360-profiler",
    ],
  },
  {
    title: { fr: "Backend et API", en: "Backend and APIs" },
    summary: {
      fr: "API REST, authentification, synchronisation et traitements asynchrones.",
      en: "REST APIs, authentication, synchronization, and asynchronous processing.",
    },
    skills: [".NET API", "Node.js", "REST", "Authentication", "Feature flags"],
    evidenceSlugs: ["operations-crm", "secure-client-portal", "remote-assist"],
  },
  {
    title: { fr: "Bases de données", en: "Databases" },
    summary: {
      fr: "Modélisation pragmatique, requêtes et évolution contrôlée des données.",
      en: "Pragmatic modelling, queries, and controlled data evolution.",
    },
    skills: ["PostgreSQL", "SQLite", "Data modelling", "Migrations"],
    evidenceSlugs: ["operations-crm", "mario-ai", "boreal"],
  },
  {
    title: {
      fr: "Infrastructure et réseau",
      en: "Infrastructure and networking",
    },
    summary: {
      fr: "Systèmes Windows, accès distants et partage de fichiers documenté.",
      en: "Windows systems, remote access, and documented file sharing.",
    },
    skills: [
      "Windows",
      "PowerShell",
      "WireGuard",
      "SMB",
      "AWS",
      "Microsoft 365",
    ],
    evidenceSlugs: ["remote-assist", "boreal"],
  },
  {
    title: { fr: "Soutien TI", en: "IT support" },
    summary: {
      fr: "Diagnostic méthodique, assistance utilisateur et suivi des incidents.",
      en: "Methodical diagnostics, user assistance, and incident follow-up.",
    },
    skills: [
      "Troubleshooting",
      "Remote support",
      "Documentation",
      "Root-cause analysis",
    ],
    evidenceSlugs: ["remote-assist", "boreal"],
  },
  {
    title: { fr: "Automatisation", en: "Automation" },
    summary: {
      fr: "Réduction des tâches répétitives et fiabilisation des flux.",
      en: "Reducing repetitive work and making workflows more reliable.",
    },
    skills: ["PowerShell", "Python", "Media pipelines", "Reporting automation"],
    evidenceSlugs: ["mario-ai", "pipe360-profiler", "operations-crm"],
  },
  {
    title: { fr: "Sécurité", en: "Security" },
    summary: {
      fr: "Moindre privilège, consentement, traçabilité et validation défensive.",
      en: "Least privilege, consent, auditability, and defensive validation.",
    },
    skills: [
      "TLS",
      "Access control",
      "Audit trails",
      "Secure downloads",
      "Rate limits",
    ],
    evidenceSlugs: ["secure-client-portal", "remote-assist", "boreal"],
  },
  {
    title: { fr: "Intelligence artificielle", en: "Artificial intelligence" },
    summary: {
      fr: "Préparation de données, revue humaine et exploration de similarité visuelle.",
      en: "Dataset preparation, human review, and visual-similarity exploration.",
    },
    skills: [
      "Dataset preparation",
      "Computer vision",
      "OpenCV",
      "Review queues",
    ],
    evidenceSlugs: ["mario-ai", "pipe360-profiler"],
  },
  {
    title: {
      fr: "Documentation et tests",
      en: "Documentation and testing",
    },
    summary: {
      fr: "Décisions d’architecture, procédures vérifiables et tests automatisés.",
      en: "Architecture decisions, verifiable procedures, and automated tests.",
    },
    skills: [
      "ADRs",
      "Automated tests",
      "Security reviews",
      "Technical writing",
    ],
    evidenceSlugs: ["secure-client-portal", "pipe360-profiler"],
  },
];
