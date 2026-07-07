import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getContacts, getSiteContent } from "@/services/contentService";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Свяжитесь со мной: форма обратной связи, GitHub, Telegram и email.",
};

export default async function ContactsPage() {
  const [contacts, content] = await Promise.all([getContacts(), getSiteContent()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="text-3xl font-bold sm:text-4xl">Контакты</h1>
        <p className="mt-3 max-w-2xl text-muted">{content.contacts_intro}</p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
        <Reveal delay={100}>
          <ContactForm />
        </Reveal>

        <Reveal delay={200}>
          <aside className="space-y-3">
            {contacts.map((contact) => (
              <Link
                key={contact.id}
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
