import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import SkillBadge from "@/components/SkillBadge";
import { getSkills } from "@/services/contentService";
import type { Skill, SkillCategory } from "@/types/content";

export const metadata: Metadata = {
  title: "Навыки",
  description:
    "Технологии и инструменты: Frontend, Backend, Design, Tools и Soft Skills с честной оценкой уровня.",
};

const categoryOrder: SkillCategory[] = ["Frontend", "Backend", "Design", "Tools", "Soft Skills"];
const categoryDescriptions: Record<SkillCategory, string> = {
  Frontend: "Основной стек, на котором строю интерфейсы",
  Backend: "То, что использую для серверной части",
  Design: "Работа с макетами и вниманием к деталям",
  Tools: "Инструменты повседневной работы",
  "Soft Skills": "Как работаю в команде и над задачами",
};

function groupByCategory(skills: Skill[]) {
  const groups = new Map<SkillCategory, Skill[]>();
  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return categoryOrder
    .map((category) => ({ category, skills: groups.get(category) ?? [] }))
    .filter((group) => group.skills.length > 0);
}

export default async function SkillsPage() {
  const skills = await getSkills();
  const groups = groupByCategory(skills);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Навыки и стек</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Честная оценка уровня владения каждой технологией.
        </p>
      </Reveal>

      <div className="mt-12 space-y-12">
        {groups.map((group, groupIndex) => (
          <Reveal key={group.category} delay={groupIndex * 80}>
            <section>
              <div className="mb-5">
                <h2 className="text-xl font-semibold">{group.category}</h2>
                <p className="mt-1 text-sm text-muted">
                  {categoryDescriptions[group.category]}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.skills.map((skill) => (
                  <SkillBadge key={skill.id} skill={skill} />
                ))}
              </div>
            </section>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
