import type { Metadata } from "next";
import { ResumePage } from "@/src/components/ResumePage";

export const metadata: Metadata = {
  title: "Curriculum vitæ",
  description:
    "Curriculum vitæ web de Thierry Rouillard — développement logiciel, soutien TI, automatisation et systèmes.",
  alternates: {
    canonical: "/cv",
    languages: { "fr-CA": "/cv", "en-CA": "/en/resume" },
  },
};

export default function Resume() {
  return <ResumePage locale="fr" />;
}
