import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ProjectInput } from "@/types/project";

/**
 * GET /api/projects — опубликованные проекты (публично).
 * GET /api/projects?all=1 — все проекты, включая черновики (только админ).
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const includeAll = request.nextUrl.searchParams.get("all") === "1";

  if (includeAll) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
  }

  let query = supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!includeAll) {
    query = query.eq("published", true);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

/** POST /api/projects — создать проект (только админ) */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = (await request.json()) as ProjectInput;
  if (!body.title?.trim() || !body.slug?.trim()) {
    return NextResponse.json(
      { error: "Название и slug обязательны" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}
