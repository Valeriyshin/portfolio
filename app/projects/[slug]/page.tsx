import type { Metadata } from "next";
import { getProjectBySlug } from "@/services/projectsService";
import ProjectDetails from "./ProjectDetails";

type Props = { params: Promise<{ slug: string }> };

// SEO: метаданные страницы формируются из данных проекта на сервере
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return { title: "Проект не найден" };
  }
  return {
    title: project.title,
    description: project.short_description,
  };
}

export default function ProjectPage() {
  return <ProjectDetails />;
}
