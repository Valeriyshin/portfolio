"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useFetch } from "@/hooks/useFetch";
import type { SiteContent, SiteContentInput } from "@/types/content";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import AdminNav from "../AdminNav";

const inputClasses =
  "w-full rounded-lg border border-line bg-background px-3.5 py-2 text-sm focus:border-accent focus:outline-none";

/** {"title":"...","text":"..."} по одной паре на строку, разделитель " | " */
function factsToText(facts: SiteContent["about_facts"]): string {
  return facts.map((fact) => `${fact.title} | ${fact.text}`).join("\n");
}

function textToFacts(text: string): SiteContent["about_facts"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title.trim(), text: rest.join("|").trim() };
    });
}

export default function AdminContentPage() {
  const { data: content, loading, error, refetch } = useFetch<SiteContent>("/api/content");

  const [form, setForm] = useState<SiteContentInput | null>(null);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (content) setForm(content);
  }, [content]);

  function set<K extends keyof SiteContentInput>(key: K, value: SiteContentInput[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
    setSaved(false);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form) return;
    setSaveError("");
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Не удалось сохранить тексты");
      }
      setSaved(true);
      refetch();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <AdminNav />

      <div className="mb-8">
        <h1 className="text-2xl font-bold">Тексты сайта</h1>
        <p className="mt-1 text-sm text-muted">
          Главная страница, «Обо мне» и вступление на странице контактов
        </p>
      </div>

      {loading ? (
        <Loader label="Загружаю тексты..." />
      ) : error || !form ? (
        <ErrorMessage message={error ?? "Не удалось загрузить"} onRetry={refetch} />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Главная — hero
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-muted">
                  Надпись над заголовком
                </label>
                <input
                  value={form.hero_eyebrow}
                  onChange={(e) => set("hero_eyebrow", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">Заголовок</label>
                <textarea
                  rows={2}
                  value={form.hero_title}
                  onChange={(e) => set("hero_title", e.target.value)}
                  className={`${inputClasses} resize-y`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">
                  Часть заголовка для выделения градиентом (должна встречаться в тексте выше)
                </label>
                <input
                  value={form.hero_highlight}
                  onChange={(e) => set("hero_highlight", e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">Подзаголовок</label>
                <textarea
                  rows={3}
                  value={form.hero_subtitle}
                  onChange={(e) => set("hero_subtitle", e.target.value)}
                  className={`${inputClasses} resize-y`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Обо мне
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-muted">
                  Вступление (абзацы разделяйте пустой строкой)
                </label>
                <textarea
                  rows={6}
                  value={form.about_intro}
                  onChange={(e) => set("about_intro", e.target.value)}
                  className={`${inputClasses} resize-y`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">
                  Карточки-факты — по одной на строку: «Заголовок | Текст»
                </label>
                <textarea
                  rows={4}
                  value={factsToText(form.about_facts)}
                  onChange={(e) => set("about_facts", textToFacts(e.target.value))}
                  className={`${inputClasses} resize-y font-mono text-xs`}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted">
                  Сильные стороны — по одной на строку
                </label>
                <textarea
                  rows={4}
                  value={form.about_strengths.join("\n")}
                  onChange={(e) =>
                    set(
                      "about_strengths",
                      e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)
                    )
                  }
                  className={`${inputClasses} resize-y`}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-line bg-surface p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent">
              Контакты — вступление
            </h2>
            <textarea
              rows={3}
              value={form.contacts_intro}
              onChange={(e) => set("contacts_intro", e.target.value)}
              className={`${inputClasses} resize-y`}
            />
          </section>

          {saveError && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
              {saveError}
            </p>
          )}
          {saved && (
            <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm text-accent">
              Сохранено
            </p>
          )}

          <Button type="submit" disabled={saving}>
            {saving ? "Сохранение..." : "Сохранить тексты"}
          </Button>
        </form>
      )}
    </div>
  );
}
