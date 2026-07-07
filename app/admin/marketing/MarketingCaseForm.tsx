"use client";

import { useState, type FormEvent } from "react";
import type { MarketingCase, MarketingCaseInput, MarketingCaseType } from "@/types/marketing";
import Button from "@/components/Button";

interface MarketingCaseFormProps {
  item: MarketingCase | null;
  onSubmit: (input: MarketingCaseInput) => Promise<void>;
  onCancel: () => void;
}

const inputClasses =
  "w-full rounded-lg border border-line bg-background px-3.5 py-2 text-sm focus:border-accent focus:outline-none";

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

function toArray(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/** «Лидов в месяц | 120» по одной строке — во внутреннее jsonb-представление */
function metricsToText(metrics: MarketingCaseInput["metrics"]): string {
  return metrics.map((metric) => `${metric.label} | ${metric.value}`).join("\n");
}

function textToMetrics(text: string): MarketingCaseInput["metrics"] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split("|");
      return { label: label.trim(), value: rest.join("|").trim() };
    });
}

export default function MarketingCaseForm({ item, onSubmit, onCancel }: MarketingCaseFormProps) {
  const [values, setValues] = useState({
    slug: item?.slug ?? "",
    client_name: item?.client_name ?? "",
    title: item?.title ?? "",
    niche: item?.niche ?? "",
    channels: item?.channels.join(", ") ?? "",
    short_description: item?.short_description ?? "",
    description: item?.description ?? "",
    period: item?.period ?? "",
    role: item?.role ?? "Digital-маркетолог",
    budget_spend: item?.budget_spend ?? "",
    metrics: item ? metricsToText(item.metrics) : "",
    tools: item?.tools.join(", ") ?? "",
    result: item?.result ?? "",
    improvements: item?.improvements ?? "",
    case_type: item?.case_type ?? ("full" as MarketingCaseType),
    website_url: item?.website_url ?? "",
    image_url: item?.image_url ?? "",
    published: item?.published ?? true,
    sort_order: item?.sort_order ?? 0,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!values.client_name.trim() || !values.title.trim()) {
      setError("Укажите клиента и название кейса");
      return;
    }
    const slug = values.slug.trim() || slugify(`${values.client_name}-${values.title}`);

    setSaving(true);
    try {
      await onSubmit({
        slug,
        client_name: values.client_name.trim(),
        title: values.title.trim(),
        niche: values.niche.trim(),
        channels: toArray(values.channels),
        short_description: values.short_description.trim(),
        description: values.description.trim(),
        period: values.period.trim(),
        role: values.role.trim(),
        budget_spend: values.budget_spend.trim(),
        metrics: textToMetrics(values.metrics),
        tools: toArray(values.tools),
        result: values.result.trim(),
        improvements: values.improvements.trim(),
        case_type: values.case_type,
        website_url: values.website_url.trim() || null,
        image_url: values.image_url.trim() || null,
        published: values.published,
        sort_order: Number(values.sort_order) || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить кейс");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-accent/30 bg-surface p-6">
      <h2 className="mb-5 text-lg font-semibold">
        {item ? `Редактирование: ${item.client_name}` : "Новый маркетинг-кейс"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-muted">Клиент *</label>
          <input
            value={values.client_name}
            onChange={(e) => set("client_name", e.target.value)}
            className={inputClasses}
            placeholder="Название клиента"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Тип кейса</label>
          <select
            value={values.case_type}
            onChange={(e) => set("case_type", e.target.value as MarketingCaseType)}
            className={inputClasses}
          >
            <option value="full">Полный (с метриками)</option>
            <option value="light">Лёгкий (без цифр)</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Название кейса *</label>
          <input
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={inputClasses}
            placeholder="Например: Привлечение лидов через WhatsApp"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Slug (URL)</label>
          <input
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
            className={inputClasses}
            placeholder="Автоматически из клиента и названия"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Ниша</label>
          <input
            value={values.niche}
            onChange={(e) => set("niche", e.target.value)}
            className={inputClasses}
            placeholder="Например: Языковая школа"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Краткое описание</label>
          <input
            value={values.short_description}
            onChange={(e) => set("short_description", e.target.value)}
            className={inputClasses}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Полное описание</label>
          <textarea
            rows={3}
            value={values.description}
            onChange={(e) => set("description", e.target.value)}
            className={`${inputClasses} resize-y`}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">
            Каналы (через запятую)
          </label>
          <input
            value={values.channels}
            onChange={(e) => set("channels", e.target.value)}
            className={inputClasses}
            placeholder="Meta Ads, Google Ads, TikTok Ads"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">
            Инструменты (через запятую)
          </label>
          <input
            value={values.tools}
            onChange={(e) => set("tools", e.target.value)}
            className={inputClasses}
            placeholder="Meta Ads Manager, Google Analytics"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Период</label>
          <input
            value={values.period}
            onChange={(e) => set("period", e.target.value)}
            className={inputClasses}
            placeholder="Июнь 2024 — по настоящее время"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Бюджет</label>
          <input
            value={values.budget_spend}
            onChange={(e) => set("budget_spend", e.target.value)}
            className={inputClasses}
            placeholder="≈ $5 000 или NDA"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">
            Метрики — по одной на строку: «Название | Значение»
          </label>
          <textarea
            rows={4}
            value={values.metrics}
            onChange={(e) => set("metrics", e.target.value)}
            className={`${inputClasses} resize-y font-mono text-xs`}
            placeholder={"Лидов в месяц | 120\nCPL | 350 ₽"}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-muted">Роль</label>
          <input
            value={values.role}
            onChange={(e) => set("role", e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Ссылка (сайт клиента)</label>
          <input
            type="url"
            value={values.website_url}
            onChange={(e) => set("website_url", e.target.value)}
            className={inputClasses}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm text-muted">Ссылка на скриншот</label>
          <input
            type="url"
            value={values.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            className={inputClasses}
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
          <label className="mb-1 block text-sm text-muted">Порядок сортировки</label>
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
          {saving ? "Сохранение..." : item ? "Сохранить" : "Создать кейс"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
