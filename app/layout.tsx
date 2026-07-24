import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://main.d1g34b4b4uw0wu.amplifyapp.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thierry Rouillard — Portfolio",
    template: "%s · Thierry Rouillard",
  },
  description:
    "Portfolio bilingue en développement logiciel, technologies de l’information, automatisation et architecture de systèmes.",
  applicationName: "Portfolio Thierry Rouillard",
  authors: [{ name: "Thierry Rouillard" }],
  creator: "Thierry Rouillard",
  category: "technology",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    alternateLocale: "en_CA",
    siteName: "Thierry Rouillard — Portfolio",
    title: "Thierry Rouillard — Développement · TI · Automatisation",
    description:
      "Études de cas, architecture, automatisation, sécurité et résolution de problèmes techniques.",
    images: [
      {
        url: "/og.png",
        width: 1792,
        height: 920,
        alt: "Thierry Rouillard — Développement, TI et automatisation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thierry Rouillard — Développement · TI · Automatisation",
    description:
      "Portfolio bilingue axé sur les preuves, les systèmes et les problèmes concrets.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07131f" },
    { media: "(prefers-color-scheme: light)", color: "#f3efe7" },
  ],
};

const themeBootstrap = `
  try {
    const saved = localStorage.getItem("portfolio-theme");
    const system = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    document.documentElement.dataset.theme = saved || system;
  } catch (_) {}
`;

const pageInteractions = `
  (() => {
    const themeButton = document.querySelector("[data-theme-toggle]");
    if (themeButton instanceof HTMLButtonElement) {
      const syncThemeLabel = () => {
        const isDark = document.documentElement.dataset.theme !== "light";
        const label = isDark
          ? themeButton.dataset.lightLabel
          : themeButton.dataset.darkLabel;
        if (label) {
          themeButton.setAttribute("aria-label", label);
          themeButton.title = label;
        }
      };

      syncThemeLabel();
      themeButton.addEventListener("click", () => {
        const current =
          document.documentElement.dataset.theme === "light" ? "light" : "dark";
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("portfolio-theme", next);
        } catch (_) {}
        syncThemeLabel();
      });
    }

    document.querySelectorAll("[data-print-page]").forEach((button) => {
      button.addEventListener("click", () => window.print());
    });
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: pageInteractions }} />
      </body>
    </html>
  );
}
