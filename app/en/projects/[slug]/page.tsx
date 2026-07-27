import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/src/components/ProjectCaseStudy";
import { getProject, projects } from "@/src/data/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title.en,
    description: project.summary.en,
    openGraph: {
      type: "article",
      locale: "en_CA",
      title: `${project.title.en} — Case study`,
      description: project.summary.en,
      url: `/en/projects/${slug}`,
      images: [
        {
          url: "/og.png",
          width: 1536,
          height: 1024,
          alt: `${project.title.en} — Thierry Rouillard case study`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title.en} — Case study`,
      description: project.summary.en,
      images: ["/og.png"],
    },
    alternates: {
      canonical: `/en/projects/${slug}`,
      languages: {
        "fr-CA": `/projets/${slug}`,
        "en-CA": `/en/projects/${slug}`,
      },
    },
  };
}

export default async function EnglishProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectCaseStudy project={project} locale="en" />;
}
