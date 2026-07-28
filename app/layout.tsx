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
        url: "/og-projects.png",
        width: 1734,
        height: 907,
        alt: "Thierry Rouillard — Systèmes, TI, automatisation et projets interactifs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thierry Rouillard — Développement · TI · Automatisation",
    description:
      "Portfolio bilingue axé sur les preuves, les systèmes et les problèmes concrets.",
    images: ["/og-projects.png"],
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
  addEventListener("load", () => {
    const root = document.documentElement;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasHydratedLab = Boolean(document.querySelector(".neuro-lab"));
    const themeButton = document.querySelector("[data-theme-toggle]");
    if (themeButton instanceof HTMLButtonElement) {
      const syncThemeLabel = () => {
        const isDark = root.dataset.theme !== "light";
        const label = isDark
          ? themeButton.dataset.lightLabel
          : themeButton.dataset.darkLabel;
        if (label) {
          themeButton.setAttribute("aria-label", label);
          themeButton.title = label;
        }
      };

      if (!hasHydratedLab) syncThemeLabel();
      themeButton.addEventListener("click", () => {
        const current =
          root.dataset.theme === "light" ? "light" : "dark";
        const next = current === "dark" ? "light" : "dark";
        root.dataset.theme = next;
        try {
          localStorage.setItem("portfolio-theme", next);
        } catch (_) {}
        syncThemeLabel();
      });
    }

    document.querySelectorAll("[data-print-page]").forEach((button) => {
      button.addEventListener("click", () => window.print());
    });

    const revealSelectors = [
      ".skill-group",
      ".responsibility-list article",
      ".case-facts section",
      ".case-list-section",
      ".architecture-section",
      ".evidence-principles article",
      ".resume-timeline li",
    ];
    if (!hasHydratedLab) {
      document.querySelectorAll(revealSelectors.join(",")).forEach((element) => {
        element.setAttribute("data-reveal", "");
      });
    }

    const revealTargets = [...document.querySelectorAll("[data-reveal]")];
    revealTargets.forEach((element, index) => {
      element.style.setProperty("--reveal-order", String(index % 5));
    });

    if (!reducedMotion && "IntersectionObserver" in window) {
      root.dataset.motionReady = "true";
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
      );
      revealTargets.forEach((element) => observer.observe(element));
    } else {
      revealTargets.forEach((element) => element.classList.add("is-visible"));
    }

    let frame = 0;
    const updateAmbientMotion = (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", event.clientX + "px");
        root.style.setProperty("--pointer-y", event.clientY + "px");
        frame = 0;
      });
    };

    const updateScrollProgress = () => {
      const distance =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? window.scrollY / distance : 0;
      root.style.setProperty("--scroll-progress", String(progress));
    };

    // Native scroll timelines drive the progress bar in CSS. Falling back to a
    // scroll listener writes a custom property on :root, which invalidates
    // style for the whole document on every scroll event.
    if (!CSS.supports("animation-timeline: scroll()")) {
      updateScrollProgress();
      addEventListener("scroll", updateScrollProgress, { passive: true });
    }

    if (!reducedMotion && matchMedia("(pointer: fine)").matches) {
      addEventListener("pointermove", updateAmbientMotion, { passive: true });
      document.querySelectorAll("[data-tilt]").forEach((element) => {
        element.addEventListener("pointermove", (event) => {
          const bounds = element.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          element.style.setProperty("--tilt-x", ((0.5 - y) * 4).toFixed(2) + "deg");
          element.style.setProperty("--tilt-y", ((x - 0.5) * 5).toFixed(2) + "deg");
          element.style.setProperty("--spot-x", (x * 100).toFixed(1) + "%");
          element.style.setProperty("--spot-y", (y * 100).toFixed(1) + "%");
        });
        element.addEventListener("pointerleave", () => {
          element.style.setProperty("--tilt-x", "0deg");
          element.style.setProperty("--tilt-y", "0deg");
          element.style.setProperty("--spot-x", "50%");
          element.style.setProperty("--spot-y", "50%");
        });
      });
    }

    // Counters read their target from the rendered text, so the figure stays
    // correct and selectable when scripting is unavailable.
    const counters = [...document.querySelectorAll("[data-tally]")].filter(
      (element) => /^\\d+$/.test(element.textContent.trim()),
    );

    if (counters.length && !reducedMotion && "IntersectionObserver" in window) {
      const countObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            countObserver.unobserve(entry.target);
            const element = entry.target;
            const target = Number(element.textContent.trim());
            if (!target) return;
            const duration = 900;
            const start = performance.now();
            element.classList.add("tally");
            const step = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              element.textContent = String(Math.round(target * eased));
              if (progress < 1) requestAnimationFrame(step);
            };
            element.textContent = "0";
            requestAnimationFrame(step);
          });
        },
        { threshold: 0.6 },
      );
      counters.forEach((element) => countObserver.observe(element));
    }

    // Magnetic pull on primary actions, capped so the hit area stays honest.
    if (!reducedMotion && matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll("[data-magnetic]").forEach((element) => {
        const strength = 0.22;
        const cap = 9;
        element.addEventListener("pointermove", (event) => {
          const bounds = element.getBoundingClientRect();
          const dx = event.clientX - (bounds.left + bounds.width / 2);
          const dy = event.clientY - (bounds.top + bounds.height / 2);
          const clamp = (value) => Math.max(-cap, Math.min(cap, value * strength));
          element.style.translate = clamp(dx) + "px " + clamp(dy) + "px";
        });
        element.addEventListener("pointerleave", () => {
          element.style.translate = "";
        });
      });
    }
  }, { once: true });
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
