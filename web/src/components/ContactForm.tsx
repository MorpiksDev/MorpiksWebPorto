"use client";

import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useState, type FormEvent } from "react";
import { useLanguage } from "./LanguageProvider";
import { CONTACT, SUBJECTS, type Subject } from "@/lib/content";

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormProps {
  subject: Subject;
  onSubjectChange: (s: Subject) => void;
}

/** PRD 10.1: name, email, message (+ subject), client-side validation, posts to /api/contact. */
export const ContactForm = forwardRef<HTMLInputElement, ContactFormProps>(function ContactForm(
  { subject, onSubjectChange },
  nameRef,
) {
  const { t, lang } = useLanguage();
  const f = CONTACT.form;
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = (v: Record<Field, string>) => {
    const e: Partial<Record<Field, string>> = {};
    if (!v.name.trim()) e.name = t(f.required);
    if (!v.email.trim()) e.email = t(f.required);
    else if (!EMAIL_RE.test(v.email.trim())) e.email = t(f.invalidEmail);
    if (!v.message.trim()) e.message = t(f.required);
    return e;
  };

  const update = (field: Field, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = (["name", "email", "message"] as Field[]).find((k) => found[k]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setStatus("sending");
    const honeypot = (e.currentTarget.elements.namedItem("company") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, subject, lang, company: honeypot }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setValues({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full rounded-2xl bg-mist/45 px-4 py-3 text-[15px] text-obsidian placeholder:text-graphite/70 transition-colors hover:bg-mist/70 focus:bg-mist focus:outline-none";

  return (
    <form noValidate onSubmit={onSubmit} className="grid gap-4" aria-describedby="contact-status">
      {/* Honeypot: hidden from people, often filled by bots. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FieldWrap id="contact-name" label={t(f.name)} error={errors.name}>
          <input
            ref={nameRef}
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
          />
        </FieldWrap>
        <FieldWrap id="contact-email" label={t(f.email)} error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
          />
        </FieldWrap>
      </div>

      <div>
        <p id="contact-subject-label" className="mb-2 text-[13px] font-medium text-graphite">
          {t(f.subject)}
        </p>
        <div role="radiogroup" aria-labelledby="contact-subject-label" className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => {
            const checked = subject === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={checked}
                id={`contact-subject-${s}`}
                onClick={() => onSubjectChange(s)}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  checked
                    ? "bg-obsidian text-offwhite focus-visible:bg-graphite"
                    : "bg-mist/45 text-graphite hover:bg-mist/80 hover:text-obsidian focus-visible:bg-mist"
                }`}
              >
                {t(f.subjects[s])}
              </button>
            );
          })}
        </div>
      </div>

      <FieldWrap id="contact-message" label={t(f.message)} error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          placeholder={t(f.messagePlaceholder)}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </FieldWrap>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          id="contact-submit"
          disabled={status === "sending"}
          className="rounded-full bg-obsidian px-6 py-3 text-sm font-medium text-offwhite transition-colors hover:bg-graphite focus-visible:bg-steel disabled:opacity-60"
        >
          {status === "sending" ? t(f.sending) : t(f.submit)}
        </button>
        <div id="contact-status" aria-live="polite" className="min-h-5 flex-1 text-sm">
          <AnimatePresence mode="wait">
            {(status === "success" || status === "error") && (
              <motion.p
                key={status}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={status === "success" ? "text-obsidian" : "font-medium text-obsidian"}
              >
                {status === "success" ? t(f.success) : t(f.error)}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </form>
  );
});

function FieldWrap({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-graphite">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] font-medium text-obsidian">
          {error}
        </p>
      )}
    </div>
  );
}
