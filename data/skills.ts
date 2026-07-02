export type SkillLevel = "изучаю" | "базово" | "уверенно" | "практиковал в проекте";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: Skill[];
}

/** Числовое значение уровня для прогресс-баров */
export const LEVEL_VALUE: Record<SkillLevel, number> = {
  "изучаю": 30,
  "базово": 50,
  "уверенно": 75,
  "практиковал в проекте": 90,
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Frontend",
    description: "Основной стек, на котором строю интерфейсы",
    skills: [
      { name: "HTML / CSS", level: "уверенно" },
      { name: "JavaScript", level: "уверенно" },
      { name: "TypeScript", level: "практиковал в проекте" },
      { name: "React", level: "практиковал в проекте" },
      { name: "Next.js (App Router)", level: "практиковал в проекте" },
      { name: "Tailwind CSS", level: "практиковал в проекте" },
    ],
  },
  {
    title: "Backend",
    description: "То, что использую для серверной части",
    skills: [
      { name: "Supabase (Postgres, RLS)", level: "практиковал в проекте" },
      { name: "REST API / Route Handlers", level: "уверенно" },
      { name: "SQL", level: "базово" },
      { name: "Node.js", level: "базово" },
    ],
  },
  {
    title: "Design",
    description: "Работа с макетами и вниманием к деталям",
    skills: [
      { name: "Figma", level: "базово" },
      { name: "Адаптивная вёрстка", level: "уверенно" },
      { name: "UI-паттерны и типографика", level: "базово" },
    ],
  },
  {
    title: "Tools",
    description: "Инструменты повседневной работы",
    skills: [
      { name: "Git / GitHub", level: "уверенно" },
      { name: "Vite", level: "базово" },
      { name: "npm", level: "уверенно" },
      { name: "VS Code", level: "уверенно" },
    ],
  },
  {
    title: "Soft Skills",
    description: "Как работаю в команде и над задачами",
    skills: [
      { name: "Самостоятельность в задачах", level: "уверенно" },
      { name: "Коммуникация с заказчиком", level: "практиковал в проекте" },
      { name: "Работа с обратной связью", level: "уверенно" },
      { name: "Английский (документация)", level: "базово" },
    ],
  },
];
