import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "Валерий Шин — Frontend-разработчик",
    template: "%s — Валерий Шин",
  },
  description:
    "Портфолио frontend-разработчика: проекты на React и Next.js, навыки, кейсы и контакты.",
  keywords: ["frontend", "React", "Next.js", "TypeScript", "портфолио", "разработчик"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
