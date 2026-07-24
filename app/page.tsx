import type { Metadata } from "next";
import { PortfolioHome } from "@/src/components/PortfolioHome";

export const metadata: Metadata = {
  title: "Thierry Rouillard — Développement, TI et automatisation",
  description:
    "Portfolio de Thierry Rouillard : développement logiciel, soutien TI, automatisation, architecture de systèmes, sécurité et intelligence artificielle appliquée.",
  alternates: {
    canonical: "/",
    languages: {
      "fr-CA": "/",
      "en-CA": "/en",
    },
  },
};

export default function Home() {
  return <PortfolioHome locale="fr" />;
}
