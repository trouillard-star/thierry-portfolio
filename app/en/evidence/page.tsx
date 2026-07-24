import type { Metadata } from "next";
import { EvidencePage } from "@/src/components/EvidencePage";

export const metadata: Metadata = {
  title: "Competency evidence",
  description:
    "A matrix connecting Thierry Rouillard’s capabilities to case studies, tests, audits, and architecture decisions.",
  alternates: {
    canonical: "/en/evidence",
    languages: {
      "fr-CA": "/preuves-competences",
      "en-CA": "/en/evidence",
    },
  },
};

export default function EnglishEvidence() {
  return <EvidencePage locale="en" />;
}
