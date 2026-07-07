import type { MarketingCase } from "@/types/marketing";

/** Лёгкая карточка «с кем работал» — без метрик, для старых клиентов */
export default function MarketingClientCard({ item }: { item: MarketingCase }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="font-semibold">{item.client_name}</p>
      <p className="mt-1 text-xs text-muted">{item.niche}</p>
      <p className="mt-2 text-sm text-muted">{item.short_description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {item.channels.map((channel) => (
          <span
            key={channel}
            className="rounded-md border border-line px-2 py-0.5 text-xs text-muted"
          >
            {channel}
          </span>
        ))}
      </div>
    </div>
  );
}
