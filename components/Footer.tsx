import Link from "next/link";

const socials = [
  { label: "GitHub", href: "https://github.com/Valeriyshin" },
  { label: "Email", href: "mailto:valeriy.shin.s@gmail.com" },
  { label: "Telegram", href: "https://t.me/valeriyshin" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Валерий Шин · Frontend-разработчик
        </p>
        <nav className="flex gap-5">
          {socials.map((social) => (
            <Link
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {social.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
