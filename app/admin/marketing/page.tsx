"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { MarketingCase, MarketingCaseInput } from "@/types/marketing";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import AdminNav from "../AdminNav";
import MarketingCaseForm from "./MarketingCaseForm";

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error ?? `Ошибка запроса: ${res.status}`;
}

export default function AdminMarketingPage() {
  const { data: cases, loading, error, refetch } =
    useFetch<MarketingCase[]>("/api/marketing-cases?all=1");

  const [editing, setEditing] = useState<MarketingCase | "new" | null>(null);
  const [actionError, setActionError] = useState("");

  async function handleCreate(input: MarketingCaseInput) {
    const res = await fetch("/api/marketing-cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleUpdate(id: string, input: Partial<MarketingCaseInput>) {
    const res = await fetch(`/api/marketing-cases/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleDelete(item: MarketingCase) {
    if (!window.confirm(`Удалить кейс «${item.client_name} — ${item.title}»?`)) return;
    setActionError("");
    const res = await fetch(`/api/marketing-cases/${item.id}`, { method: "DELETE" });
    if (!res.ok) {
      setActionError(await parseError(res));
      return;
    }
    refetch();
  }

  async function togglePublished(item: MarketingCase) {
    setActionError("");
    try {
      await handleUpdate(item.id, { published: !item.published });
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Ошибка обновления");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <AdminNav />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Маркетинг-кейсы</h1>
          <p className="mt-1 text-sm text-muted">
            Кейсы для страницы /marketing: клиенты, метрики, каналы
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>+ Добавить кейс</Button>
      </div>

      {editing !== null && (
        <div className="mb-8">
          <MarketingCaseForm
            item={editing === "new" ? null : editing}
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
        <Loader label="Загружаю кейсы..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !cases || cases.length === 0 ? (
        <EmptyState
          title="Кейсов пока нет"
          description="Добавьте первый маркетинг-кейс — он появится на /marketing."
          action={<Button onClick={() => setEditing("new")}>Добавить кейс</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {cases.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h2 className="truncate font-semibold">
                    {item.client_name} — {item.title}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${
                      item.published ? "bg-accent/10 text-accent" : "bg-line/50 text-muted"
                    }`}
                  >
                    {item.published ? "Опубликован" : "Черновик"}
                  </span>
                  <span className="shrink-0 rounded-full bg-background px-2.5 py-0.5 text-xs text-muted">
                    {item.case_type === "full" ? "Полный" : "Лёгкий"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-muted">/marketing/{item.slug}</p>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button variant="outline" onClick={() => setEditing(item)}>
                  Редактировать
                </Button>
                <Button variant="ghost" onClick={() => togglePublished(item)}>
                  {item.published ? "Скрыть" : "Опубликовать"}
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item)}>
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
