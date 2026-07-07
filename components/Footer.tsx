import Link from "next/link";
import { getContacts } from "@/services/contentService";

export default async function Footer() {
  const contacts = await getContacts();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Валерий Шин · Fullstack-разработчик
        </p>
        <nav className="flex gap-5">
          {contacts.map((contact) => (
            <Link
              key={contact.id}
              href={contact.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {contact.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
