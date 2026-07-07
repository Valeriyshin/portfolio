"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { Project, ProjectInput } from "@/types/project";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import ProjectForm from "./ProjectForm";
import AdminNav from "./AdminNav";

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error ?? `Ошибка запроса: ${res.status}`;
}

export default function AdminPage() {
  const { data: projects, loading, error, refetch } =
    useFetch<Project[]>("/api/projects?all=1");

  // null — форма скрыта, "new" — создание, Project — редактирование
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [actionError, setActionError] = useState("");

  async function handleCreate(input: ProjectInput) {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleUpdate(id: string, input: Partial<ProjectInput>) {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleDelete(project: Project) {
    if (!window.confirm(`Удалить проект «${project.title}»? Это действие необратимо.`)) {
      return;
    }
    setActionError("");
    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (!res.ok) {
      setActionError(await parseError(res));
      return;
    }
    refetch();
  }

  async function togglePublished(project: Project) {
    setActionError("");
    try {
      await handleUpdate(project.id, { published: !project.published });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Ошибка обновления");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <AdminNav />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Проекты</h1>
          <p className="mt-1 text-sm text-muted">
            Управление проектами портфолио
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>+ Добавить проект</Button>
      </div>

      {editing !== null && (
        <div className="mb-8">
          <ProjectForm
            project={editing === "new" ? null : editing}
            onSubmit={(input) =>
              editing === "new" ? handleCreate(input) : handleUpdate(editing.id, input)
            }
            onCancel={() => setEditing(null)}
          />
        </div>
      )}

      {actionError && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {actionError}
        </p>
      )}

      {loading ? (
        <Loader label="Загружаю проекты..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !projects || projects.length === 0 ? (
        <EmptyState
          title="Проектов пока нет"
          description="Добавьте первый проект — он появится на сайте."
          action={<Button onClick={() => setEditing("new")}>Добавить проект</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="truncate font-semibold">{project.title}</h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${
                      project.published
                        ? "bg-accent/10 text-accent"
                        : "bg-line/50 text-muted"
                    }`}
                  >
                    {project.published ? "Опубликован" : "Черновик"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted">
                  /projects/{project.slug} · {project.category}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button variant="outline" onClick={() => setEditing(project)}>
                  Редактировать
                </Button>
                <Button variant="ghost" onClick={() => togglePublished(project)}>
                  {project.published ? "Скрыть" : "Опубликовать"}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(project)}>
                  Удалить
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
