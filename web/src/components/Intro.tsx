"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChameleonLogo, createScramble, type ShardScramble } from "./ChameleonLogo";
import { Wordmark } from "./Wordmark";
import { useLanguage } from "./LanguageProvider";
import { UI } from "@/lib/content";

export const INTRO_BAR_MS = 2500; // loading bar fills over 2.5s
export const INTRO_TOTAL_MS = 2750; // hold fully assembled until 2.75s, then departure begins

const EASE = [0.22, 1, 0.36, 1] as const;
const WORD_EXIT_MS = 850;
const WORD_STAGGER_MS = 120; // SOLUTIONS starts after MORPIKS so the two words read as moving in sequence

/** Intro word ids (source) and header word ids (target). */
const INTRO_WORDS = { brand: "intro-word-brand", solutions: "intro-word-solutions" } as const;
const HEADER_WORDS = { brand: "header-word-brand", solutions: "header-word-solutions" } as const;

interface WordExit {
  x: number;
  y: number;
  scale: number;
}

/** Offset and scale from a source word's box to its header target (both measured in the viewport). */
function measureWordExit(sourceId: string, targetId: string): WordExit | null {
  const target = document.getElementById(targetId)?.getBoundingClientRect();
  const source = document.getElementById(sourceId)?.getBoundingClientRect();
  if (!target || !source || source.width === 0) return null;
  return {
    x: target.left - source.left,
    y: target.top - source.top,
    scale: target.width / source.width,
  };
}

interface IntroProps {
  reduced: boolean;
  onComplete: () => void;
  /** Fires when the intro words have landed on their header slots (header words take over). */
  onWordsLanded?: () => void;
}

export function Intro({ reduced, onComplete, onWordsLanded }: IntroProps) {
  const { t } = useLanguage();
  const [scramble, setScramble] = useState<Record<string, ShardScramble> | null>(null);
  const [ready, setReady] = useState(false);
  const [exits, setExits] = useState<{ brand: WordExit; solutions: WordExit } | null>(null);

  useEffect(() => {
    if (!reduced) setScramble(createScramble());
    setReady(true);

    // Measure each word's header target first, commit it, then start the exit on the next frame so the
    // exit prop is already set when AnimatePresence unmounts the intro.
    const finish = () => {
      if (reduced) {
        onComplete();
        return;
      }
      const brand = measureWordExit(INTRO_WORDS.brand, HEADER_WORDS.brand);
      const solutions = measureWordExit(INTRO_WORDS.solutions, HEADER_WORDS.solutions);
      setExits(brand && solutions ? { brand, solutions } : null);
      requestAnimationFrame(onComplete);
    };

    // Reduced motion has no word travel, so the header words are shown with the overlay exit.
    const finishAt = reduced ? 800 : INTRO_TOTAL_MS;
    const completeId = window.setTimeout(finish, finishAt);

    // Header words take over exactly when the intro words land, so the handoff has no empty frame.
    const landedId = reduced
      ? window.setTimeout(() => onWordsLanded?.(), finishAt)
      : window.setTimeout(() => onWordsLanded?.(), INTRO_TOTAL_MS + WORD_STAGGER_MS + WORD_EXIT_MS);

    return () => {
      window.clearTimeout(completeId);
      window.clearTimeout(landedId);
    };
  }, [reduced, onComplete, onWordsLanded]);

  /** Each word glides to its header slot and scales from the intro size to the header size. */
  // Intro words land at WORD_STAGGER_MS + WORD_EXIT_MS; onWordsLanded fires then so the header words take over.
  // The intro word fades out as it lands, so it never sits on top of the header copy (no double image / shadow).
  const wordExit = (exit: WordExit | undefined, delayMs: number) =>
    exit
      ? {
          x: exit.x,
          y: exit.y,
          scale: exit.scale,
          opacity: 0,
          transition: {
            x: { duration: WORD_EXIT_MS / 1000, delay: delayMs / 1000, ease: EASE },
            y: { duration: WORD_EXIT_MS / 1000, delay: delayMs / 1000, ease: EASE },
            scale: { duration: WORD_EXIT_MS / 1000, delay: delayMs / 1000, ease: EASE },
            opacity: { duration: 0.2, delay: (delayMs + WORD_EXIT_MS - 200) / 1000, ease: "linear" },
          },
        }
      : { opacity: 0, transition: { duration: 0.4, ease: EASE } };

  return (
    <motion.div
      id="intro-overlay"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      aria-busy="true"
    >
      {/* Background layer: smoothly fades out over 1.4s when intro finishes, revealing content beneath while shards fly */}
      <motion.div
        className="absolute inset-0 bg-offwhite"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1.4, ease: EASE } }}
      />

      {/* Centered logo stage: holds assembled in center, then shards fly continuously to top-left */}
      {/* Fades with the overlay on exit so the centred logo never disappears in a single frame. */}
      <motion.div
        className="relative z-10 w-[min(56vw,280px)]"
        exit={{ opacity: 0, transition: { duration: 0.6, ease: EASE } }}
      >
        {ready && (
          <ChameleonLogo
            scramble={scramble}
            interactive={false}
            shardLayoutPrefix="brand-chameleon"
            className="w-full"
          />
        )}
      </motion.div>

      {/* Loading bar: fills over 2.5s, fades out quickly when intro completes */}
      <motion.div
        className="relative z-10 mt-10 h-[2px] w-[min(56vw,280px)] overflow-hidden rounded-full bg-mist"
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        role="progressbar"
        aria-label={t(UI.loading)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full w-full origin-left bg-obsidian"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: ready ? 1 : 0 }}
          transition={{ duration: INTRO_BAR_MS / 1000, ease: "linear" }}
        />
      </motion.div>

      {/* Wordmark: each word travels from its centred intro position to its own header slot, staggered. */}
      <div className="relative z-10 mt-8 text-center">
        <Wordmark
          size="lg"
          wordIds={INTRO_WORDS}
          wordExit={{ brand: wordExit(exits?.brand, 0), solutions: wordExit(exits?.solutions, WORD_STAGGER_MS) }}
        />
      </div>
    </motion.div>
  );
}
