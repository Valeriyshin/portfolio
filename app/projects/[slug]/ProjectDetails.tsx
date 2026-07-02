"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import type { Project } from "@/types/project";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

const categoryLabels: Record<Project["category"], string> = {
  frontend: "Frontend",
  fullstack: "Fullstack",
  backend: "Backend",
  design: "Design",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ProjectDetails() {
  // useParams: получаем slug из динамического маршрута /projects/[slug]
  const { slug } = useParams<{ slug: string }>();
  // Программная навигация: кнопка «назад» без Link
  const router = useRouter();

  const { data: project, loading, error, refetch } = useFetch<Project>(
    `/api/projects/${slug}`
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Loader label="Загружаю проект..." />
      </div>
    );
  }

  if (error) {
    const notFound = error.includes("не найден");
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        {notFound ? (
          <EmptyState
            title="Проект не найден"
            description="Возможно, проект был удалён или ссылка устарела."
            action={<Button href="/projects">Ко всем проектам</Button>}
          />
        ) : (
          <ErrorMessage message={error} onRetry={refetch} />
        )}
      </div>
    );
  }

  if (!project) return null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-8 cursor-pointer text-sm text-muted transition-colors hover:text-accent"
      >
        ← Назад
      </button>

      <header>
        <span className="rounded-full border border-line px-3 py-1 text-xs text-accent">
          {categoryLabels[project.category]}
        </span>
        <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{project.title}</h1>
        <p className="mt-3 text-lg text-muted">{project.short_description}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.github_url && (
            <Button href={project.github_url} variant="outline">
              GitHub ↗
            </Button>
          )}
          {project.demo_url && <Button href={project.demo_url}>Демо ↗</Button>}
        </div>
      </header>

      {project.image_url && (
        <div className="relative mt-10 aspect-video overflow-hidden rounded-xl border border-line">
          <Image
            src={project.image_url}
            alt={`Скриншот проекта ${project.title}`}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-10 grid gap-5">
        {project.description && (
          <Section title="О проекте">
            <p className="leading-relaxed text-muted">{project.description}</p>
          </Section>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {project.problem && (
            <Section title="Задача">
              <p className="text-sm leading-relaxed text-muted">{project.problem}</p>
            </Section>
          )}
          {project.role && (
            <Section title="Моя роль">
              <p className="text-sm leading-relaxed text-muted">{project.role}</p>
            </Section>
          )}
        </div>

        {project.stack.length > 0 && (
          <Section title="Стек технологий">
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-line bg-background px-3 py-1 text-sm text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Section>
        )}

        {project.features.length > 0 && (
          <Section title="Основной функционал">
            <ul className="space-y-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-accent" aria-hidden>
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </Section>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {project.result && (
            <Section title="Результат">
              <p className="text-sm leading-relaxed text-muted">{project.result}</p>
            </Section>
          )}
          {project.improvements && (
            <Section title="Что улучшил бы">
              <p className="text-sm leading-relaxed text-muted">
                {project.improvements}
              </p>
            </Section>
          )}
        </div>
      </div>

      <footer className="mt-10 border-t border-line pt-8">
        <Link href="/projects" className="text-sm text-muted hover:text-accent">
          ← Все проекты
        </Link>
      </footer>
    </article>
  );
}
