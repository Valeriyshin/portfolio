import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/project";

const categoryLabels: Record<Project["category"], string> = {
  frontend: "Frontend",
  fullstack: "Fullstack",
  backend: "Backend",
  design: "Design",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
    >
      <div className="relative aspect-video overflow-hidden bg-background">
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={`Скриншот проекта ${project.title}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface to-background text-4xl font-bold text-line">
            {project.title.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-accent backdrop-blur">
          {categoryLabels[project.category]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">
          {project.short_description}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.stack.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-line px-2 py-0.5 text-xs text-muted"
            >
              {tech}
            </span>
          ))}
          {project.stack.length > 4 && (
            <span className="px-1 py-0.5 text-xs text-muted">
              +{project.stack.length - 4}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
