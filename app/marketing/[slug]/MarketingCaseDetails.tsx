"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import type { MarketingCase } from "@/types/marketing";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-accent">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function MarketingCaseDetails() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: item, loading, error, refetch } = useFetch<MarketingCase>(
    `/api/marketing-cases/${slug}`
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Loader label="Загружаю кейс..." />
      </div>
    );
  }

  if (error) {
    const notFound = error.includes("не найден");
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        {notFound ? (
          <EmptyState
            title="Кейс не найден"
            description="Возможно, кейс был удалён или ссылка устарела."
            action={<Button href="/marketing">Ко всем кейсам</Button>}
          />
        ) : (
          <ErrorMessage message={error} onRetry={refetch} />
        )}
      </div>
    );
  }

  if (!item) return null;

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-8 cursor-pointer text-sm text-muted transition-colors hover:text-accent"
      >
        ← Назад
      </button>

      <header>
        <p className="text-xs uppercase tracking-wider text-accent">{item.client_name}</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{item.title}</h1>
        <p className="mt-3 text-lg text-muted">{item.short_description}</p>

        {item.website_url && (
          <div className="mt-6">
            <Button href={item.website_url} variant="outline">
              Ссылка ↗
            </Button>
          </div>
        )}
      </header>

      {item.metrics.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {item.metrics.map((metric) => (
            <div key={metric.label} className="rounded-xl border border-line bg-surface p-5">
              <p className="text-2xl font-bold text-accent">{metric.value}</p>
              <p className="mt-1 text-sm text-muted">{metric.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-5">
        {item.description && (
          <Section title="О кейсе">
            <p className="leading-relaxed text-muted">{item.description}</p>
          </Section>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {item.niche && (
            <Section title="Ниша">
              <p className="text-sm leading-relaxed text-muted">{item.niche}</p>
            </Section>
          )}
          {item.role && (
            <Section title="Моя роль">
              <p className="text-sm leading-relaxed text-muted">{item.role}</p>
            </Section>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {item.period && (
            <Section title="Период">
              <p className="text-sm leading-relaxed text-muted">{item.period}</p>
            </Section>
          )}
          {item.budget_spend && (
            <Section title="Бюджет">
              <p className="text-sm leading-relaxed text-muted">{item.budget_spend}</p>
            </Section>
          )}
        </div>

        {item.channels.length > 0 && (
          <Section title="Каналы">
            <div className="flex flex-wrap gap-2">
              {item.channels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-md border border-line bg-background px-3 py-1 text-sm text-muted"
                >
                  {channel}
                </span>
              ))}
            </div>
          </Section>
        )}

        {item.tools.length > 0 && (
          <Section title="Инструменты">
            <div className="flex flex-wrap gap-2">
              {item.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-line bg-background px-3 py-1 text-sm text-muted"
                >
                  {tool}
                </span>
              ))}
            </div>
          </Section>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {item.result && (
            <Section title="Результат">
              <p className="text-sm leading-relaxed text-muted">{item.result}</p>
            </Section>
          )}
          {item.improvements && (
            <Section title="Что улучшил бы">
              <p className="text-sm leading-relaxed text-muted">{item.improvements}</p>
            </Section>
          )}
        </div>
      </div>

      <footer className="mt-10 border-t border-line pt-8">
        <Link href="/marketing" className="text-sm text-muted hover:text-accent">
          ← Все кейсы
        </Link>
      </footer>
    </article>
  );
}
