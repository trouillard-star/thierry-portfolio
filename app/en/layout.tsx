import type { Metadata } from "next";

export const metadata: Metadata = {
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

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
