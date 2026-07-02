import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь со мной: форма обратной связи, GitHub, Telegram и email.",
};

const contacts = [
  {
    label: "GitHub",
    value: "github.com/Valeriyshin",
    href: "https://github.com/Valeriyshin",
  },
  {
    label: "Email",
    value: "valeriy.shin.s@gmail.com",
    href: "mailto:valeriy.shin.s@gmail.com",
  },
  {
    label: "Telegram",
    value: "@valeriyshin",
    href: "https://t.me/valeriyshin",
  },
];

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Контакты</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Открыт к предложениям о стажировке, первой работе и интересным
          проектам. Напишите через форму или в любой из каналов.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <Reveal delay={100}>
          <ContactForm />
        </Reveal>

        <Reveal delay={200}>
          <aside className="space-y-3">
            {contacts.map((contact) => (
              <Link
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-line bg-surface p-5 transition-colors hover:border-accent/50"
              >
                <p className="text-xs uppercase tracking-wider text-muted">
                  {contact.label}
                </p>
                <p className="mt-1 text-sm font-medium transition-colors group-hover:text-accent">
                  {contact.value}
                </p>
              </Link>
            ))}
          </aside>
        </Reveal>
      </div>
    </div>
  );
}
