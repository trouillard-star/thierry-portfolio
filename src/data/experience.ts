import type { LocalizedText } from "./profile";

export type Responsibility = {
  title: LocalizedText;
  detail: LocalizedText;
};

export const experience = {
  heading: {
    fr: "Responsabilités actuelles — contexte opérationnel et technique",
    en: "Current responsibilities—operational and technical context",
  },
  note: {
    fr: "Le titre d’emploi officiel n’est pas reformulé ici. Cette section décrit les responsabilités techniques réellement exercées, sans prétendre à un poste différent.",
    en: "The official job title is not reframed here. This section describes the technical responsibilities performed without implying a different position.",
  },
  responsibilities: [
    {
      title: { fr: "Analyse logicielle", en: "Software analysis" },
      detail: {
        fr: "Clarifier les besoins, modéliser les flux et traduire les contraintes opérationnelles en décisions techniques.",
        en: "Clarify needs, model workflows, and turn operational constraints into technical decisions.",
      },
    },
    {
      title: { fr: "Outils internes", en: "Internal tools" },
      detail: {
        fr: "Développer et améliorer des applications qui soutiennent la planification, le suivi et la publication d’information.",
        en: "Build and improve applications that support planning, tracking, and information publishing.",
      },
    },
    {
      title: { fr: "Soutien et diagnostic", en: "Support and diagnostics" },
      detail: {
        fr: "Résoudre des problèmes logiciels, matériels, d’accès et de réseau avec une démarche reproductible.",
        en: "Resolve software, hardware, access, and network issues with a repeatable approach.",
      },
    },
    {
      title: { fr: "Automatisation de rapports", en: "Reporting automation" },
      detail: {
        fr: "Réduire les manipulations manuelles dans les traitements de médias, de mesures et de livrables.",
        en: "Reduce manual handling in media, measurement, and deliverable workflows.",
      },
    },
    {
      title: {
        fr: "Réseau et intégration",
        en: "Network and integration support",
      },
      detail: {
        fr: "Appuyer les accès sécurisés, le partage de fichiers et l’intégration entre outils existants.",
        en: "Support secure access, file sharing, and integration across existing tools.",
      },
    },
    {
      title: { fr: "Documentation", en: "Documentation" },
      detail: {
        fr: "Documenter l’architecture, les procédures, les risques et les décisions pour rendre le travail transférable.",
        en: "Document architecture, procedures, risks, and decisions so the work remains transferable.",
      },
    },
  ] satisfies Responsibility[],
} as const;
