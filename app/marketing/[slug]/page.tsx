import type { Metadata } from "next";
import { getMarketingCaseBySlug } from "@/services/marketingService";
import MarketingCaseDetails from "./MarketingCaseDetails";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMarketingCaseBySlug(slug).catch(() => null);

  if (!item) {
    return { title: "Кейс не найден" };
  }
  return {
    title: `${item.client_name} — ${item.title}`,
    description: item.short_description,
  };
}

export default function MarketingCasePage() {
  return <MarketingCaseDetails />;
}
