import type { Metadata } from "next";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Обо мне",
  description:
    "Кто я, чем занимаюсь и куда развиваюсь: путь в frontend-разработке, образование и цели.",
};

const facts = [
  {
    title: "Направление",
    text: "Frontend-разработка с прицелом на fullstack: интерфейсы на React/Next.js плюс серверная часть на Supabase.",
  },
  {
    title: "Цель",
    text: "Первая коммерческая работа или стажировка в команде, где можно расти рядом с опытными разработчиками.",
  },
  {
    title: "Сейчас",
    text: "Развиваю реальный продукт — платформу языковой школы (лендинг + CRM), параллельно углубляюсь в TypeScript.",
  },
];

const strengths = [
  "Довожу проекты до рабочего состояния, а не до «почти готово»",
  "Разбираюсь в чужом коде и документации самостоятельно",
  "Внимателен к деталям интерфейса: отступы, состояния, адаптив",
  "Умею общаться с заказчиком и переводить задачи в код",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Обо мне</h1>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            Меня зовут <span className="text-foreground">Валерий Шин</span>. Я
            frontend-разработчик: строю интерфейсы на React и Next.js и собираю
            вокруг них всё необходимое — данные, авторизацию, API.
          </p>
          <p>
            В разработку пришёл через практику: вместо учебных туториалов почти
            сразу начал делать реальный продукт — платформу для языковой школы,
            которая заменила школе платную CRM. Это научило главному: код должен
            решать задачу пользователя, а не просто «работать у меня локально».
          </p>
        </div>
      </Reveal>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {facts.map((fact, index) => (
          <Reveal key={fact.title} delay={index * 120}>
            <div className="h-full rounded-xl border border-line bg-surface p-5">
              <h2 className="font-semibold text-accent">{fact.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{fact.text}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mt-12">
        <Reveal>
          <h2 className="text-2xl font-bold">Сильные стороны</h2>
        </Reveal>
        <ul className="mt-5 space-y-3">
          {strengths.map((item, index) => (
            <Reveal key={item} delay={index * 100}>
              <li className="flex items-start gap-3 text-muted">
                <span className="mt-1 text-accent" aria-hidden>
                  ✦
                </span>
                {item}
              </li>
            </Reveal>
          ))}
        </ul>
      </section>

      <Reveal delay={100}>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button href="/projects">Мои проекты</Button>
          <Button href="/contacts" variant="outline">
            Написать мне
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
