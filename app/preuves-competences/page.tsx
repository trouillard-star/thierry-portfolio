import type { Metadata } from "next";
import { EvidencePage } from "@/src/components/EvidencePage";

export const metadata: Metadata = {
  title: "Preuves de compétences",
  description:
    "Matrice reliant les compétences de Thierry Rouillard aux études de cas, tests, audits et décisions d’architecture.",
  alternates: {
    canonical: "/preuves-competences",
    languages: {
      "fr-CA": "/preuves-competences",
      "en-CA": "/en/evidence",
    },
  },
};

export default function Evidence() {
  return <EvidencePage locale="fr" />;
}
