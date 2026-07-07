"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/Button";

const tabs = [
  { href: "/admin", label: "Проекты" },
  { href: "/admin/skills", label: "Навыки" },
  { href: "/admin/contacts", label: "Контакты" },
  { href: "/admin/content", label: "Тексты сайта" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
      <nav className="flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === tab.href
                ? "bg-surface text-accent"
                : "text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      <Button variant="ghost" onClick={handleLogout}>
        Выйти
      </Button>
    </div>
  );
}
