import Image from "next/image";
import type { MarketingCase } from "@/types/marketing";

/** Лёгкая карточка «с кем работал» — без метрик, для старых клиентов */
export default function MarketingClientCard({ item }: { item: MarketingCase }) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-line bg-surface p-4">
      <div className="flex items-center gap-3">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.client_name}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg border border-line bg-background object-contain p-1"
          />
        ) : (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-background text-sm font-bold text-muted">
            {item.client_name.charAt(0).toUpperCase()}
          </span>
        )}
        <p className="font-semibold">{item.client_name}</p>
      </div>
      <p className="mt-2 text-xs text-muted">{item.niche}</p>
      <p className="mt-2 text-sm text-muted">{item.short_description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
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
