"use client";

import { useMemo, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { Project, ProjectCategory } from "@/types/project";
import ProjectCard from "@/components/ProjectCard";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

type CategoryFilter = ProjectCategory | "all";

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Все" },
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
];

export default function ProjectsClient() {
  const { data: projects, loading, error, refetch } = useFetch<Project[]>("/api/projects");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  // useMemo: пересчитываем список только при изменении данных или фильтров
  const filtered = useMemo(() => {
    if (!projects) return [];
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = category === "all" || project.category === category;
      const matchesSearch =
        query === "" ||
        project.title.toLowerCase().includes(query) ||
        project.short_description.toLowerCase().includes(query) ||
        project.stack.some((tech) => tech.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [projects, search, category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Проекты</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Каждый проект оформлен как кейс: задача, моя роль, стек и результат.
          Открывайте карточку, чтобы посмотреть детали.
        </p>
      </Reveal>

      {/* Поиск и фильтры */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию, описанию или стеку..."
          aria-label="Поиск проектов"
          className="w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-sm placeholder:text-muted/60 focus:border-accent focus:outline-none sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`cursor-pointer rounded-full px-4 py-1.5 text-sm transition-colors ${
                category === item.value
                  ? "bg-accent text-slate-950 font-medium"
                  : "border border-line text-muted hover:border-accent hover:text-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Состояния: загрузка / ошибка / пусто / данные */}
      <div className="mt-10">
        {loading ? (
          <Loader label="Загружаю проекты..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Проекты не найдены"
            description={
              projects?.length
                ? "По вашему запросу ничего нет — измените поиск или фильтр."
                : "Проекты ещё не добавлены."
            }
            action={
              projects?.length ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                  }}
                >
                  Сбросить фильтры
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) * 100} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
