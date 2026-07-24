import type { Metadata } from "next";
import { PortfolioHome } from "@/src/components/PortfolioHome";

export const metadata: Metadata = {
  title: "Thierry Rouillard — Development, IT, and automation",
  description:
    "Thierry Rouillard’s portfolio: software development, IT support, automation, systems architecture, security, and applied artificial intelligence.",
  alternates: {
    canonical: "/en",
    languages: {
      "fr-CA": "/",
      "en-CA": "/en",
    },
  },
  openGraph: {
    locale: "en_CA",
    alternateLocale: "fr_CA",
    title: "Thierry Rouillard — Development · IT · Automation",
    description:
      "Case studies, architecture, automation, security, and practical technical problem-solving.",
  },
  twitter: {
    title: "Thierry Rouillard — Development · IT · Automation",
    description:
      "A bilingual portfolio focused on evidence, systems, and practical problems.",
  },
};

export default function EnglishHome() {
  return <PortfolioHome locale="en" />;
}
