export type MarketingCaseType = "full" | "light";

export interface MarketingMetric {
  label: string;
  value: string;
}

export interface MarketingCase {
  id: string;
  slug: string;
  client_name: string;
  title: string;
  niche: string;
  channels: string[];
  short_description: string;
  description: string;
  period: string;
  role: string;
  budget_spend: string;
  metrics: MarketingMetric[];
  tools: string[];
  result: string;
  improvements: string;
  case_type: MarketingCaseType;
  website_url: string | null;
  image_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
}

export type MarketingCaseInput = Omit<MarketingCase, "id" | "created_at">;
