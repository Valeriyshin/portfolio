import { createClient } from "@/lib/supabase/server";
import type { MarketingCase } from "@/types/marketing";

export async function getPublishedMarketingCases(): Promise<MarketingCase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketing_cases")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as MarketingCase[];
}

export async function getMarketingCaseBySlug(slug: string): Promise<MarketingCase | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("marketing_cases")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as MarketingCase | null;
}
