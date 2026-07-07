"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { StoredMessage } from "@/types/project";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import AdminNav from "../AdminNav";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminMessagesPage() {
  const { data: messages, loading, error, refetch } = useFetch<StoredMessage[]>("/api/messages");
  const [actionError, setActionError] = useState("");

  async function handleDelete(message: StoredMessage) {
    if (!window.confirm(`Удалить заявку от «${message.name}»?`)) return;
    setActionError("");
    const res = await fetch(`/api/messages/${message.id}`, { method: "DELETE" });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setActionError(body?.error ?? "Не удалось удалить заявку");
      return;
    }
    refetch();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <AdminNav />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Заявки</h1>
        <p className="mt-1 text-sm text-muted">
          Сообщения из формы обратной связи на странице «Контакты». Уведомления
          на почту не настроены — заявки нужно проверять здесь.
        </p>
      </div>

      {actionError && (
        <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {actionError}
        </p>
      )}

      {loading ? (
        <Loader label="Загружаю заявки..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !messages || messages.length === 0 ? (
        <EmptyState
          title="Заявок пока нет"
          description="Как только кто-то заполнит форму на /contacts, заявка появится здесь."
        />
      ) : (
        <ul className="space-y-3">
          {messages.map((message) => (
            <li key={message.id} className="rounded-xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{message.name}</h2>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-sm text-accent hover:underline"
                    >
                      {message.email}
                    </a>
                  </div>
                  {message.subject && (
                    <p className="mt-1 text-sm text-muted">Тема: {message.subject}</p>
                  )}
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">
                    {message.message}
                  </p>
                  <p className="mt-3 text-xs text-muted">{formatDate(message.created_at)}</p>
                </div>
                <Button variant="danger" onClick={() => handleDelete(message)}>
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
