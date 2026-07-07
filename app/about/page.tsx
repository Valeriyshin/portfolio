import type { Metadata } from "next";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import { getSiteContent } from "@/services/contentService";

export const metadata: Metadata = {
  title: "Обо мне",
  description:
    "Кто я, чем занимаюсь и куда развиваюсь: путь в fullstack-разработке, образование и цели.",
};

export default async function AboutPage() {
  const content = await getSiteContent();
  const introParagraphs = content.about_intro.split("\n\n").filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Обо мне</h1>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
          {introParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </Reveal>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {content.about_facts.map((fact, index) => (
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
          {content.about_strengths.map((item, index) => (
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
