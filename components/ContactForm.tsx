"use client";

import { useState, type FormEvent } from "react";
import Button from "@/components/Button";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = { name: "", email: "", subject: "", message: "" };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Укажите имя";
  if (!values.email.trim()) errors.email = "Укажите email";
  else if (!EMAIL_RE.test(values.email)) errors.email = "Некорректный email";
  if (!values.message.trim()) errors.message = "Напишите сообщение";
  else if (values.message.trim().length < 10)
    errors.message = "Сообщение должно быть не короче 10 символов";
  return errors;
}

const inputClasses =
  "w-full rounded-lg border border-line bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  function handleChange(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Убираем ошибку поля сразу при исправлении
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Не удалось отправить сообщение");
      }
      setStatus("success");
      setValues(initialValues);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Ошибка отправки");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-accent/30 bg-accent/5 px-6 py-12 text-center">
        <span className="text-4xl" aria-hidden>
          ✅
        </span>
        <div>
          <p className="text-lg font-semibold">Сообщение отправлено!</p>
          <p className="mt-1 text-sm text-muted">
            Спасибо! Отвечу на указанный email в ближайшее время.
          </p>
        </div>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Написать ещё
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
            Имя <span className="text-accent">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Как к вам обращаться"
            className={`${inputClasses} ${errors.name ? "border-red-500/60" : ""}`}
          />
          {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="you@example.com"
            className={`${inputClasses} ${errors.email ? "border-red-500/60" : ""}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm text-muted">
          Тема
        </label>
        <input
          id="subject"
          type="text"
          value={values.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          placeholder="Например: предложение о стажировке"
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
          Сообщение <span className="text-accent">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Расскажите о задаче или проекте..."
          className={`${inputClasses} resize-y ${errors.message ? "border-red-500/60" : ""}`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
      </div>

      {status === "error" && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {serverError}
        </p>
      )}

      <Button type="submit" disabled={status === "sending"} className="self-start">
        {status === "sending" ? "Отправка..." : "Отправить сообщение"}
      </Button>
    </form>
  );
}
