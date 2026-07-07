import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { MarketingCaseInput } from "@/types/marketing";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Params = { params: Promise<{ id: string }> };

/** GET /api/marketing-cases/[id] — один кейс по slug или uuid (публично) */
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("marketing_cases")
    .select("*")
    .eq(UUID_RE.test(id) ? "id" : "slug", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }
  return NextResponse.json(data);
}

/** PUT /api/marketing-cases/[id] — обновить кейс по uuid (только админ) */
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<MarketingCaseInput>;
  const { data, error } = await supabase
    .from("marketing_cases")
    .update(body)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Кейс не найден" }, { status: 404 });
  }
  return NextResponse.json(data);
}

/** DELETE /api/marketing-cases/[id] — удалить кейс по uuid (только админ) */
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  const { error } = await supabase.from("marketing_cases").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
