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
    default: "Валерий Шин — Fullstack-разработчик",
    template: "%s — Валерий Шин",
  },
  description:
    "Портфолио fullstack-разработчика: проекты на React, Next.js и Supabase, навыки, кейсы и контакты.",
  keywords: ["fullstack", "frontend", "React", "Next.js", "Supabase", "TypeScript", "портфолио", "разработчик"],
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
