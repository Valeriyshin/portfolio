import Image from "next/image";
import Link from "next/link";
import type { MarketingCase } from "@/types/marketing";

export default function MarketingCaseCard({ item }: { item: MarketingCase }) {
  const topMetric = item.metrics[0];

  return (
    <Link
      href={`/marketing/${item.slug}`}
      className="group flex h-full flex-col gap-4 rounded-xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-xl hover:shadow-accent/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.client_name}
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-lg border border-line bg-background object-contain p-1"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-background text-sm font-bold text-muted">
              {item.client_name.charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted">{item.client_name}</p>
            <h3 className="mt-1 font-semibold transition-colors group-hover:text-accent">
              {item.title}
            </h3>
          </div>
        </div>
        {topMetric && (
          <div className="shrink-0 rounded-lg bg-background px-3 py-1.5 text-right">
            <p className="text-lg font-bold text-accent">{topMetric.value}</p>
            <p className="text-[11px] text-muted">{topMetric.label}</p>
          </div>
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted">{item.short_description}</p>

      <div className="mt-auto flex flex-wrap gap-1.5">
        {item.channels.map((channel) => (
          <span
            key={channel}
            className="rounded-md border border-line px-2 py-0.5 text-xs text-muted"
          >
            {channel}
          </span>
        ))}
      </div>
    </Link>
  );
}
