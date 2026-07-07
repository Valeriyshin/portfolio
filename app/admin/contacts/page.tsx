"use client";

import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { Contact, ContactInput } from "@/types/content";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import AdminNav from "../AdminNav";
import ContactAdminForm from "./ContactAdminForm";

async function parseError(res: Response): Promise<string> {
  const body = await res.json().catch(() => null);
  return body?.error ?? `Ошибка запроса: ${res.status}`;
}

export default function AdminContactsPage() {
  const { data: contacts, loading, error, refetch } = useFetch<Contact[]>("/api/contacts");
  const [editing, setEditing] = useState<Contact | "new" | null>(null);
  const [actionError, setActionError] = useState("");

  async function handleCreate(input: ContactInput) {
    const res = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleUpdate(id: string, input: ContactInput) {
    const res = await fetch(`/api/contacts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(await parseError(res));
    setEditing(null);
    refetch();
  }

  async function handleDelete(contact: Contact) {
    if (!window.confirm(`Удалить контакт «${contact.label}»?`)) return;
    setActionError("");
    const res = await fetch(`/api/contacts/${contact.id}`, { method: "DELETE" });
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
          <h1 className="text-2xl font-bold">Контакты</h1>
          <p className="mt-1 text-sm text-muted">
            Ссылки на странице контактов и в футере сайта
          </p>
        </div>
        <Button onClick={() => setEditing("new")}>+ Добавить контакт</Button>
      </div>

      {editing !== null && (
        <div className="mb-8">
          <ContactAdminForm
            contact={editing === "new" ? null : editing}
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
        <Loader label="Загружаю контакты..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={refetch} />
      ) : !contacts || contacts.length === 0 ? (
        <EmptyState
          title="Контактов пока нет"
          description="Добавьте первый контакт — он появится на странице /contacts и в футере."
          action={<Button onClick={() => setEditing("new")}>Добавить контакт</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-surface p-5"
            >
              <div className="min-w-0">
                <h2 className="truncate font-semibold">{contact.label}</h2>
                <p className="mt-1 truncate text-sm text-muted">
                  {contact.value} · {contact.href}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="outline" onClick={() => setEditing(contact)}>
                  Редактировать
                </Button>
                <Button variant="danger" onClick={() => handleDelete(contact)}>
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
