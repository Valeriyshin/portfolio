import type { Metadata } from "next";
import { getPublishedMarketingCases } from "@/services/marketingService";
import MarketingCaseCard from "@/components/MarketingCaseCard";
import MarketingClientCard from "@/components/MarketingClientCard";
import EmptyState from "@/components/EmptyState";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Маркетинг",
  description:
    "Кейсы digital-маркетолога: настройка и ведение рекламных кампаний Meta Ads, Google Ads, TikTok Ads для реального бизнеса.",
};

export default async function MarketingPage() {
  const cases = await getPublishedMarketingCases();
  const fullCases = cases.filter((item) => item.case_type === "full");
  const lightCases = cases.filter((item) => item.case_type === "light");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Маркетинг</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Digital-маркетолог в BAZIS-A: настройка и ведение рекламных кампаний
          Meta Ads, Google Ads и TikTok Ads. Ниже — кейсы с реальными цифрами и
          клиенты, с которыми довелось работать.
        </p>
      </Reveal>

      {fullCases.length === 0 && lightCases.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="Кейсы пока не добавлены"
            description="Скоро здесь появятся кейсы с результатами рекламных кампаний."
          />
        </div>
      ) : (
        <>
          {fullCases.length > 0 && (
            <section className="mt-10">
              <div className="grid gap-6 sm:grid-cols-2">
                {fullCases.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 2) * 100} className="h-full">
                    <MarketingCaseCard item={item} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {lightCases.length > 0 && (
            <section className="mt-14">
              <Reveal>
                <h2 className="mb-5 text-xl font-semibold">С кем ещё работал</h2>
              </Reveal>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {lightCases.map((item, index) => (
                  <Reveal key={item.id} delay={(index % 3) * 80} className="h-full">
                    <MarketingClientCard item={item} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
