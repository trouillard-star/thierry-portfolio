import type { MetadataRoute } from "next";
import { projects } from "@/src/data/projects";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://main.d1g34b4b4uw0wu.amplifyapp.com";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/en",
    "/cv",
    "/en/resume",
    "/preuves-competences",
    "/en/evidence",
  ];
  const projectRoutes = projects.flatMap((project) => [
    `/projets/${project.slug}`,
    `/en/projects/${project.slug}`,
  ]);

  return [...staticRoutes, ...projectRoutes].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date("2026-07-24"),
    changeFrequency: route === "" || route === "/en" ? "monthly" : "yearly",
    priority: route === "" || route === "/en" ? 1 : 0.7,
  }));
}
