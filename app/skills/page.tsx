import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SkillBadge from "@/components/SkillBadge";
import { skillCategories } from "@/data/skills";

export const metadata: Metadata = {
  title: "Навыки",
  description:
    "Технологии и инструменты: Frontend, Backend, Design, Tools и Soft Skills с честной оценкой уровня.",
};

export default function SkillsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Навыки и стек</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Честная оценка: «изучаю» — начал недавно, «практиковал в проекте» —
          использовал в реальной работе, могу объяснить и показать код.
        </p>
      </Reveal>

      <div className="mt-12 space-y-12">
        {skillCategories.map((category, categoryIndex) => (
          <Reveal key={category.title} delay={categoryIndex * 80}>
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-semibold">{category.title}</h2>
                <p className="mt-1 text-sm text-muted">{category.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.skills.map((skill) => (
                  <SkillBadge key={skill.name} skill={skill} />
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
