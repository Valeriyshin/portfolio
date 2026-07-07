"use client";

import { useState, type FormEvent } from "react";
import type { Contact, ContactInput } from "@/types/content";
import Button from "@/components/Button";

interface ContactAdminFormProps {
  contact: Contact | null;
  onSubmit: (input: ContactInput) => Promise<void>;
  onCancel: () => void;
}

const inputClasses =
  "w-full rounded-lg border border-line bg-background px-3.5 py-2 text-sm focus:border-accent focus:outline-none";

export default function ContactAdminForm({ contact, onSubmit, onCancel }: ContactAdminFormProps) {
  const [label, setLabel] = useState(contact?.label ?? "");
  const [value, setValue] = useState(contact?.value ?? "");
  const [href, setHref] = useState(contact?.href ?? "");
  const [sortOrder, setSortOrder] = useState(contact?.sort_order ?? 0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!label.trim() || !href.trim()) {
      setError("Название и ссылка обязательны");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        label: label.trim(),
        value: value.trim() || label.trim(),
        href: href.trim(),
        sort_order: Number(sortOrder) || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить контакт");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-accent/30 bg-surface p-6">
      <h2 className="mb-5 text-lg font-semibold">
        {contact ? `Редактирование: ${contact.label}` : "Новый контакт"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-muted">Название *</label>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={inputClasses}
            placeholder="Например: WhatsApp"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Отображаемое значение</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={inputClasses}
            placeholder="Например: +7 999 123-45-67"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Ссылка *</label>
          <input
            value={href}
            onChange={(e) => setHref(e.target.value)}
            className={inputClasses}
            placeholder="https://... или mailto:... или tel:..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Порядок сортировки</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={inputClasses}
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : contact ? "Сохранить" : "Добавить контакт"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
