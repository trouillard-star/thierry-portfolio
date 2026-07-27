import type { Metadata } from "next";
import { QuickProfile } from "@/src/components/QuickProfile";

export const metadata: Metadata = {
  title: "60-second profile",
  description:
    "A fast overview of Thierry Rouillard’s profile, flagship projects, working method, and technical capabilities.",
  alternates: {
    canonical: "/en/quick-profile",
    languages: {
      "fr-CA": "/profil-express",
      "en-CA": "/en/quick-profile",
    },
  },
};

export default function EnglishQuickProfilePage() {
  return <QuickProfile locale="en" />;
}
