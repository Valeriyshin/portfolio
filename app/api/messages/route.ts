import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ContactMessage } from "@/types/project";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** GET /api/messages — список заявок (только админ) */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Не авторизован" }, { status: 401 });

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** POST /api/messages — сообщение из формы обратной связи */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as ContactMessage;

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
  }
  if (!EMAIL_RE.test(body.email ?? "")) {
    return NextResponse.json({ error: "Некорректный email" }, { status: 400 });
  }
  if (!body.message || body.message.trim().length < 10) {
    return NextResponse.json(
      { error: "Сообщение должно быть не короче 10 символов" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    name: body.name.trim(),
    email: body.email.trim(),
    subject: body.subject?.trim() ?? "",
    message: body.message.trim(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
