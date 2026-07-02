import Button from "@/components/Button";
import Reveal from "@/components/Reveal";

const highlights = [
  { value: "React / Next.js", label: "основной стек" },
  { value: "TypeScript", label: "типизация проектов" },
  { value: "Supabase", label: "база данных и авторизация" },
];

const keySkills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "REST API",
  "Git",
];

export default function HomePage() {
  return (
    <div className="hero-glow">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="flex min-h-[70vh] flex-col justify-center py-20">
          <Reveal>
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
              Frontend-разработчик
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Привет, я Валерий.
              <br />
              Создаю интерфейсы на{" "}
              <span className="bg-gradient-to-r from-accent-2 to-accent bg-clip-text text-transparent">
                React и Next.js
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Разрабатываю рабочие продукты, а не просто вёрстку: от лендингов до
              CRM-систем с базой данных, авторизацией и админ-панелями.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/projects">Смотреть проекты</Button>
              <Button href="/contacts" variant="outline">
                Связаться со мной
              </Button>
            </div>
          </Reveal>
        </section>

        {/* Ключевые цифры/факты */}
        <section className="grid gap-4 pb-16 sm:grid-cols-3">
          {highlights.map((item, index) => (
            <Reveal key={item.value} delay={index * 120}>
              <div className="rounded-xl border border-line bg-surface/60 p-6">
                <p className="text-xl font-semibold text-accent">{item.value}</p>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Ключевые навыки */}
        <section className="pb-24">
          <Reveal>
            <h2 className="mb-6 text-2xl font-bold">Ключевые навыки</h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-2">
              {keySkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="mt-8">
              <Button href="/skills" variant="ghost">
                Все навыки →
              </Button>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
