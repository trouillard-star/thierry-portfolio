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
    title: project.title.fr,
    description: project.summary.fr,
    alternates: {
      canonical: `/projets/${slug}`,
      languages: {
        "fr-CA": `/projets/${slug}`,
        "en-CA": `/en/projects/${slug}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectCaseStudy project={project} locale="fr" />;
}
