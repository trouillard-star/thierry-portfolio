import type { Metadata } from "next";
import { ResumePage } from "@/src/components/ResumePage";

export const metadata: Metadata = {
  title: "Résumé",
  description:
    "Web résumé for Thierry Rouillard—software development, IT support, automation, and systems.",
  alternates: {
    canonical: "/en/resume",
    languages: { "fr-CA": "/cv", "en-CA": "/en/resume" },
  },
};

export default function EnglishResume() {
  return <ResumePage locale="en" />;
}
