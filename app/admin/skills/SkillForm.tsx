"use client";

import { useState, type FormEvent } from "react";
import type { Skill, SkillCategory, SkillInput } from "@/types/content";
import { getSkillLevelLabel } from "@/lib/skillLevel";
import Button from "@/components/Button";

const categories: SkillCategory[] = ["Frontend", "Backend", "Design", "Tools", "Soft Skills"];

interface SkillFormProps {
  skill: Skill | null;
  onSubmit: (input: SkillInput) => Promise<void>;
  onCancel: () => void;
}

const inputClasses =
  "w-full rounded-lg border border-line bg-background px-3.5 py-2 text-sm focus:border-accent focus:outline-none";

export default function SkillForm({ skill, onSubmit, onCancel }: SkillFormProps) {
  const [name, setName] = useState(skill?.name ?? "");
  const [category, setCategory] = useState<SkillCategory>(skill?.category ?? "Frontend");
  const [level, setLevel] = useState(skill?.level ?? 50);
  const [sortOrder, setSortOrder] = useState(skill?.sort_order ?? 0);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Укажите название навыка");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), category, level, sort_order: Number(sortOrder) || 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить навык");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-accent/30 bg-surface p-6">
      <h2 className="mb-5 text-lg font-semibold">
        {skill ? `Редактирование: ${skill.name}` : "Новый навык"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-muted">Название *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
            placeholder="Например: Redux"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Категория</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SkillCategory)}
            className={inputClasses}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 flex items-center justify-between text-sm text-muted">
            <span>Уровень владения</span>
            <span className="font-medium text-accent">
              {getSkillLevelLabel(level)} · {level}%
            </span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full accent-[--accent]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-muted">
            <span>Изучаю</span>
            <span>Базовый уровень</span>
            <span>Уверенно</span>
            <span>Профессионально</span>
          </div>
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
          {saving ? "Сохранение..." : skill ? "Сохранить" : "Добавить навык"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
