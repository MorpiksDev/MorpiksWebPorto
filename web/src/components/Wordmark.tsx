"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { TAGLINE } from "@/lib/content";

interface WordmarkProps {
  size?: "sm" | "lg";
  showTagline?: boolean;
  /** When set, each word is a motion span with a DOM id so the intro can measure and move it. */
  wordIds?: { brand: string; solutions: string };
  /** Per-word exit target (intro only). Words keep their layout; only transform/opacity change. */
  wordExit?: { brand: TargetAndTransition; solutions: TargetAndTransition };
  /** Words are hidden (header, while intro words are still in flight). */
  wordsHidden?: boolean;
}

/** PRD 3.4: MORPIKS (800) + SOLUTIONS (300), tagline in Montserrat 400. */
export function Wordmark({ size = "sm", showTagline = true, wordIds, wordExit, wordsHidden = false }: WordmarkProps) {
  const { t } = useLanguage();
  const large = size === "lg";
  const animated = Boolean(wordIds);

  return (
    <div className="font-brand leading-none text-obsidian">
      <p className={large ? "text-2xl tracking-[0.18em] sm:text-3xl" : "text-[13px] tracking-[0.16em] sm:text-[15px]"}>
        {animated ? (
          <motion.span
            id={wordIds?.brand}
            className="inline-block font-extrabold"
            style={{ transformOrigin: "0 0" }}
            exit={wordExit?.brand}
          >
            MORPIKS
          </motion.span>
        ) : (
          <span id="header-word-brand" className="inline-block font-extrabold" style={{ opacity: wordsHidden ? 0 : 1 }}>
            MORPIKS
          </span>
        )}{" "}
        {animated ? (
          <motion.span
            id={wordIds?.solutions}
            className="inline-block font-light"
            style={{ transformOrigin: "0 0" }}
            exit={wordExit?.solutions}
          >
            SOLUTIONS
          </motion.span>
        ) : (
          <span id="header-word-solutions" className="inline-block font-light" style={{ opacity: wordsHidden ? 0 : 1 }}>
            SOLUTIONS
          </span>
        )}
      </p>
      {showTagline && (
        <p
          className={
            large
              ? "mt-3 text-sm font-normal tracking-[0.08em] text-graphite"
              : "mt-1.5 hidden text-[11px] font-normal tracking-[0.06em] text-graphite sm:block"
          }
        >
          {t(TAGLINE)}
        </p>
      )}
    </div>
  );
}
