"use client";

import type { ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  /** Задержка появления в мс — для каскадных анимаций */
  delay?: number;
  className?: string;
}

/** Обёртка плавного появления секции при скролле */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
