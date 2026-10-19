"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChameleonLogo, createScramble, type ShardScramble } from "./ChameleonLogo";
import { Wordmark } from "./Wordmark";
import { useLanguage } from "./LanguageProvider";
import { UI } from "@/lib/content";

export const INTRO_BAR_MS = 2500; // loading bar fills over 2.5s
export const INTRO_TOTAL_MS = 2750; // hold fully assembled until 2.75s, then departure begins

interface IntroProps {
  reduced: boolean;
  onComplete: () => void;
}

export function Intro({ reduced, onComplete }: IntroProps) {
  const { t } = useLanguage();
  const [scramble, setScramble] = useState<Record<string, ShardScramble> | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!reduced) setScramble(createScramble());
    setReady(true);

    if (reduced) {
      const id = window.setTimeout(onComplete, 800);
      return () => window.clearTimeout(id);
    }

    // At 2.75s, loading is complete and logo is fully assembled. Transition to header begins.
    const completeId = window.setTimeout(onComplete, INTRO_TOTAL_MS);
    return () => window.clearTimeout(completeId);
  }, [reduced, onComplete]);

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
        exit={{ opacity: 0, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } }}
      />

      {/* Centered logo stage: holds assembled in center, then shards fly continuously to top-left */}
      <div className="relative z-10 w-[min(56vw,280px)]">
        {ready && (
          <ChameleonLogo
            scramble={scramble}
            interactive={false}
            shardLayoutPrefix="brand-chameleon"
            className="w-full"
          />
        )}
      </div>

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

      {/* Wordmark: glides continuously into header position */}
      <motion.div
        className="relative z-10 mt-8 text-center"
        layoutId="brand-wordmark"
        transition={{ layout: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } }}
      >
        <Wordmark size="lg" />
      </motion.div>
    </motion.div>
  );
}
