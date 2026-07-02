"use client";

import { useState, type FormEvent } from "react";
import type { Project, ProjectCategory, ProjectInput } from "@/types/project";
import Button from "@/components/Button";

interface ProjectFormProps {
  /** Проект для редактирования; null — создание нового */
  project: Project | null;
  onSubmit: (input: ProjectInput) => Promise<void>;
  onCancel: () => void;
}

const inputClasses =
  "w-full rounded-lg border border-line bg-background px-3.5 py-2 text-sm focus:border-accent focus:outline-none";

const categories: { value: ProjectCategory; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
];

function slugify(value: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
    щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return value
    .toLowerCase()
    .split("")
    .map((char) => map[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Строка «через запятую» → массив без пустых элементов */
function toArray(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [values, setValues] = useState({
    title: project?.title ?? "",
    slug: project?.slug ?? "",
    short_description: project?.short_description ?? "",
    description: project?.description ?? "",
    problem: project?.problem ?? "",
    role: project?.role ?? "",
    stack: project?.stack.join(", ") ?? "",
    features: project?.features.join(", ") ?? "",
    result: project?.result ?? "",
    improvements: project?.improvements ?? "",
    github_url: project?.github_url ?? "",
    demo_url: project?.demo_url ?? "",
    image_url: project?.image_url ?? "",
    category: project?.category ?? ("frontend" as ProjectCategory),
    published: project?.published ?? true,
    sort_order: project?.sort_order ?? 0,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!values.title.trim()) {
      setError("Укажите название проекта");
      return;
    }
    const slug = values.slug.trim() || slugify(values.title);
    if (!slug) {
      setError("Не удалось сформировать slug — укажите вручную");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title: values.title.trim(),
        slug,
        short_description: values.short_description.trim(),
        description: values.description.trim(),
        problem: values.problem.trim(),
        role: values.role.trim(),
        stack: toArray(values.stack),
        features: toArray(values.features),
        result: values.result.trim(),
        improvements: values.improvements.trim(),
        github_url: values.github_url.trim() || null,
        demo_url: values.demo_url.trim() || null,
        image_url: values.image_url.trim() || null,
        category: values.category,
        published: values.published,
        sort_order: Number(values.sort_order) || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить проект");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-accent/30 bg-surface p-6"
    >
      <h2 className="mb-5 text-lg font-semibold">
        {project ? `Редактирование: ${project.title}` : "Новый проект"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-muted">Название *</label>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClasses}
            placeholder="Название проекта"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">
            Slug (URL, латиницей)
          </label>
          <input
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            className={inputClasses}
            placeholder="Автоматически из названия"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Краткое описание</label>
          <input
            value={values.short_description}
            onChange={(e) => set("short_description", e.target.value)}
            className={inputClasses}
            placeholder="Одно-два предложения для карточки"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Полное описание</label>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${inputClasses} resize-y`}
            placeholder="Что это за проект и для кого"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Задача / проблема</label>
          <textarea
            rows={2}
            value={values.problem}
            onChange={(e) => set("problem", e.target.value)}
            className={`${inputClasses} resize-y`}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Моя роль</label>
          <textarea
            rows={2}
            value={values.role}
            onChange={(e) => set("role", e.target.value)}
            className={`${inputClasses} resize-y`}
            placeholder="Frontend, fullstack, UX/UI..."
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">
            Стек (через запятую)
          </label>
          <input
            value={values.stack}
            onChange={(e) => set("stack", e.target.value)}
            className={inputClasses}
            placeholder="React, TypeScript, Tailwind"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">
            Функционал (через запятую)
          </label>
          <input
            value={values.features}
            onChange={(e) => set("features", e.target.value)}
            className={inputClasses}
            placeholder="Авторизация, поиск, фильтры"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Результат</label>
          <textarea
            rows={2}
            value={values.result}
            onChange={(e) => set("result", e.target.value)}
            className={`${inputClasses} resize-y`}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Что улучшил бы</label>
          <textarea
            rows={2}
            value={values.improvements}
            onChange={(e) => set("improvements", e.target.value)}
            className={`${inputClasses} resize-y`}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Ссылка на GitHub</label>
          <input
            type="url"
            value={values.github_url}
            onChange={(e) => set("github_url", e.target.value)}
            className={inputClasses}
            placeholder="https://github.com/..."
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Ссылка на демо</label>
          <input
            type="url"
            value={values.demo_url}
            onChange={(e) => set("demo_url", e.target.value)}
            className={inputClasses}
            placeholder="https://..."
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">
            Ссылка на скриншот (https)
          </label>
          <input
            type="url"
            value={values.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            className={inputClasses}
            placeholder="https://.../screenshot.png"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Категория</label>
          <select
            value={values.category}
            onChange={(e) => set("category", e.target.value as ProjectCategory)}
            className={inputClasses}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">
            Порядок сортировки
          </label>
          <input
            type="number"
            value={values.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            className={inputClasses}
          />
        </div>

        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input
            type="checkbox"
            checked={values.published}
            onChange={(e) => set("published", e.target.checked)}
            className="h-4 w-4 accent-[--accent]"
          />
          Опубликован (виден на сайте)
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Сохранение..." : project ? "Сохранить" : "Создать проект"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
