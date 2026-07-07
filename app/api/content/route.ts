import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SiteContentInput } from "@/types/content";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_content").select("*").eq("id", 1).single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** PUT /api/content — обновить тексты сайта (только админ, синглтон-строка) */
export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const body = (await request.json()) as Partial<SiteContentInput>;
  const { data, error } = await supabase
    .from("site_content")
    .update(body)
    .eq("id", 1)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
