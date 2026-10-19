"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { ABOUT, APPROACH } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
};

export const revealTransition = (delay = 0) => ({ duration: 0.8, delay, ease: EASE });

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-graphite">{children}</p>;
}

/** PRD 8.2: company info. Content from Portfolio.md sections 2, 3, 7. */
export function AboutPanel() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-12 lg:gap-14">
      <motion.div className="lg:col-span-6" {...reveal} transition={revealTransition()}>
        <Eyebrow>{t(ABOUT.eyebrow)}</Eyebrow>
        <h2 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {t(ABOUT.heading)}
        </h2>
        <p className="mt-6 text-base leading-relaxed text-graphite sm:text-lg">{t(ABOUT.body)}</p>
        <p className="mt-4 text-base leading-relaxed text-obsidian sm:text-lg">{t(ABOUT.chameleon)}</p>
      </motion.div>

      <div className="lg:col-span-6">
        <motion.h3 className="text-sm font-semibold text-obsidian" {...reveal} transition={revealTransition(0.1)}>
          {t(ABOUT.philosophyTitle)}
        </motion.h3>
        <ul className="mt-4 grid gap-3">
          {ABOUT.philosophy.map((p, i) => (
            <motion.li
              key={p.key}
              className="group rounded-3xl bg-mist/40 p-5 transition-colors duration-300 hover:bg-obsidian sm:p-6"
              {...reveal}
              transition={revealTransition(0.15 + i * 0.08)}
            >
              <p className="font-brand text-lg font-extrabold tracking-[0.14em] text-obsidian transition-colors duration-300 group-hover:text-offwhite">
                {p.key}
              </p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-graphite transition-colors duration-300 group-hover:text-mist">
                {t(p.text)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div className="lg:col-span-12" {...reveal} transition={revealTransition(0.2)}>
        <h3 className="text-sm font-semibold text-obsidian">{t(ABOUT.serveTitle)}</h3>
        <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT.segments.map((s) => (
            <li key={s.title.en}>
              <p className="text-[15px] font-semibold text-obsidian">{t(s.title)}</p>
              <p className="mt-1 text-sm leading-relaxed text-graphite">{t(s.text)}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

/** Portfolio.md sections 4, 6: Why Morpiks + How we work. */
export function ApproachPanel() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto w-full max-w-7xl">
      <motion.div {...reveal} transition={revealTransition()}>
        <Eyebrow>{t(APPROACH.eyebrow)}</Eyebrow>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {t(APPROACH.heading)}
        </h2>
      </motion.div>

      <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
        {APPROACH.reasons.map((r, i) => (
          <motion.li key={r.title.en} {...reveal} transition={revealTransition(0.1 + i * 0.07)}>
            <p className="text-[13px] font-medium tabular-nums text-graphite">0{i + 1}</p>
            <p className="mt-2 text-lg font-semibold text-obsidian">{t(r.title)}</p>
            <p className="mt-2 text-[15px] leading-relaxed text-graphite">{t(r.text)}</p>
          </motion.li>
        ))}
      </ul>

      <motion.div className="mt-12" {...reveal} transition={revealTransition(0.25)}>
        <h3 className="text-sm font-semibold text-obsidian">{t(APPROACH.howTitle)}</h3>
        <ol className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {APPROACH.steps.map((s, i) => (
            <li
              key={s.title.en}
              className="group rounded-3xl bg-mist/40 p-5 transition-colors duration-300 hover:bg-obsidian"
            >
              <p className="flex items-baseline gap-2">
                <span className="text-[13px] font-medium tabular-nums text-graphite transition-colors group-hover:text-mist">
                  {i + 1}.
                </span>
                <span className="text-lg font-semibold text-obsidian transition-colors group-hover:text-offwhite">
                  {t(s.title)}
                </span>
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite transition-colors group-hover:text-mist">
                {t(s.text)}
              </p>
            </li>
          ))}
        </ol>
      </motion.div>
    </div>
  );
}
