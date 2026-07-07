"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { Skill, SkillInput } from "@/types/content";
import { getSkillLevelLabel } from "@/lib/skillLevel";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import AdminNav from "../AdminNav";
import SkillForm from "./SkillForm";

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error ?? `Ошибка запроса: ${res.status}`;
}

export default function AdminSkillsPage() {
  const { data: skills, loading, error, refetch } = useFetch<Skill[]>("/api/skills");
  const [editing, setEditing] = useState<Skill | "new" | null>(null);
  const [actionError, setActionError] = useState("");

  async function handleCreate(input: SkillInput) {
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleUpdate(id: string, input: SkillInput) {
    const res = await fetch(`/api/skills/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleDelete(skill: Skill) {
    if (!window.confirm(`Удалить навык «${skill.name}»?`)) return;
    setActionError("");
    const res = await fetch(`/api/skills/${skill.id}`, { method: "DELETE" });
    if (!res.ok) {
      setActionError(await parseError(res));
      return;
    }
    refetch();
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <AdminNav />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Навыки</h1>
          <p className="mt-1 text-sm text-muted">
            Категории, уровень владения (слайдер) и порядок отображения
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>+ Добавить навык</Button>
      </div>

      {editing !== null && (
        <div className="mb-8">
          <SkillForm
            skill={editing === "new" ? null : editing}
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
        <Loader label="Загружаю навыки..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !skills || skills.length === 0 ? (
        <EmptyState
          title="Навыков пока нет"
          description="Добавьте первый навык — он появится на странице /skills."
          action={<Button onClick={() => setEditing("new")}>Добавить навык</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {skills.map((skill) => (
            <li
              key={skill.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <h2 className="truncate font-semibold">{skill.name}</h2>
                  <span className="shrink-0 rounded-full bg-background px-2.5 py-0.5 text-xs text-muted">
                    {skill.category}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-2 to-accent"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted">
                    {getSkillLevelLabel(skill.level)} · {skill.level}%
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button variant="outline" onClick={() => setEditing(skill)}>
                  Редактировать
                </Button>
                <Button variant="danger" onClick={() => handleDelete(skill)}>
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
