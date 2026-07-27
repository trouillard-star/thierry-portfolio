import type { Metadata } from "next";
import { QuickProfile } from "@/src/components/QuickProfile";

export const metadata: Metadata = {
  title: "Profil en 60 secondes",
  description:
    "Aperçu rapide du profil de Thierry Rouillard, de ses projets phares, de sa méthode et de ses compétences techniques.",
  alternates: {
    canonical: "/profil-express",
    languages: {
      "fr-CA": "/profil-express",
      "en-CA": "/en/quick-profile",
    },
  },
};

export default function QuickProfilePage() {
  return <QuickProfile locale="fr" />;
}
