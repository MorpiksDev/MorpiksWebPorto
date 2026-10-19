"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import { ChameleonLogo } from "./ChameleonLogo";
import { ContactForm } from "./ContactForm";
import { useLanguage } from "./LanguageProvider";
import { Eyebrow, reveal, revealTransition } from "./Panels";
import { COMPANY, CONTACT, TAGLINE, UI, type Subject } from "@/lib/content";

interface ContactPanelProps {
  /** Contact logo is shown here (false while the header owns it or a flight is in progress). */
  logoVisible?: boolean;
  /** Switch without fading (flight hand-off). When false, the visibility change fades. */
  instant?: boolean;
  subject: Subject;
  onSubjectChange: (s: Subject) => void;
  onCta: () => void;
}

/** PRD 10: form + contact details, WhatsApp secondary CTA, footer CTA. */
export const ContactPanel = forwardRef<HTMLInputElement, ContactPanelProps>(function ContactPanel(
  { logoVisible = false, instant = false, subject, onSubjectChange, onCta },
  nameRef,
) {
  const { t } = useLanguage();
  const d = CONTACT.details;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div className="lg:col-span-5" {...reveal} transition={revealTransition()}>
          {/* Contact logo slot: the logo flight lands here; visibility is driven by Experience. */}
          <motion.div
            id="contact-logo"
            className="mb-5 w-32 sm:w-40 lg:w-48"
            style={{ aspectRatio: "352 / 370", pointerEvents: logoVisible ? undefined : "none" }}
            initial={false}
            animate={{ opacity: logoVisible ? 1 : 0 }}
            transition={{ duration: instant ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={!logoVisible || undefined}
          >
            <ChameleonLogo interactive={logoVisible} className="w-full" label="Morpiks chameleon logo" />
          </motion.div>
          <Eyebrow>{t(CONTACT.eyebrow)}</Eyebrow>
          <h2 className="mt-3 text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
            {t(CONTACT.heading)}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-graphite sm:text-base">{t(CONTACT.body)}</p>

          <dl className="mt-8 grid gap-5 text-[15px]">
            <div>
              <dt className="text-[13px] font-medium text-graphite">{t(d.email)}</dt>
              <dd className="mt-1">
                <a
                  id="contact-email-link"
                  href={`mailto:${COMPANY.email}`}
                  className="rounded-md font-medium text-obsidian underline-offset-4 hover:underline focus-visible:bg-mist"
                >
                  {COMPANY.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-graphite">{t(d.whatsapp)}</dt>
              <dd className="mt-1">
                <a
                  id="contact-whatsapp-link"
                  href={COMPANY.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md font-medium text-obsidian underline-offset-4 hover:underline focus-visible:bg-mist"
                >
                  {COMPANY.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] font-medium text-graphite">{t(d.location)}</dt>
              <dd className="mt-1 font-medium text-obsidian">{COMPANY.location}</dd>
            </div>
          </dl>

          <a
            id="contact-whatsapp-cta"
            href={COMPANY.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-mist/60 px-5 py-2.5 text-sm font-medium text-obsidian transition-colors hover:bg-mist focus-visible:bg-obsidian focus-visible:text-offwhite"
          >
            {t(CONTACT.whatsappCta)}
          </a>
        </motion.div>

        <motion.div className="relative lg:col-span-7" {...reveal} transition={revealTransition(0.12)}>
          <ContactForm ref={nameRef} subject={subject} onSubjectChange={onSubjectChange} />
        </motion.div>
      </div>

      <footer className="mt-14 flex flex-col gap-3 pt-6 text-[13px] text-graphite sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {COMPANY.name}. {t(CONTACT.footer.rights)}{" "}
          <span className="font-brand">{t(TAGLINE)}</span>
        </p>
        <button
          type="button"
          id="footer-cta"
          onClick={onCta}
          className="self-start rounded-full px-3 py-1.5 font-medium text-obsidian underline-offset-4 hover:underline focus-visible:bg-mist sm:self-auto"
        >
          {t(UI.cta)} →
        </button>
      </footer>
    </div>
  );
});
