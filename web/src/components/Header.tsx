"use client";

import { motion } from "framer-motion";
import { ChameleonLogo } from "./ChameleonLogo";
import { Wordmark } from "./Wordmark";
import { useLanguage } from "./LanguageProvider";
import { UI } from "@/lib/content";

interface HeaderProps {
  onHome: () => void;
  onCta: () => void;
  inContact?: boolean;
}

/** PRD 6.2: logo + wordmark settle top-left. Hero CTA top-right (PRD 10.1). */
export function Header({ onHome, onCta, inContact = false }: HeaderProps) {
  const { t } = useLanguage();
  const wordmarkTransition = { layout: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <header className="header-surface fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 transition-colors sm:px-10 sm:py-4">
      <div className="flex items-center gap-2.5 rounded-full bg-mist/40 px-3 py-1.5 backdrop-blur-sm sm:gap-3.5 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div id="header-logo" className="relative w-8 shrink-0 sm:w-11">
          {/* Permanent Brand Logo: ALWAYS visible in top-left, receives intro shards */}
          <ChameleonLogo shardLayoutPrefix="brand-chameleon" className="w-full" interactive={true} />

          {/* Contact Stream Emitter: When !inContact, rests at Header. When inContact, unmounts from Header and mounts in ContactPanel! */}
          {!inContact && (
            <div className="absolute inset-0 pointer-events-none opacity-0">
              <ChameleonLogo shardLayoutPrefix="contact-stream" className="w-full" interactive={false} />
            </div>
          )}
        </div>
        <motion.button
          layoutId="brand-wordmark"
          transition={wordmarkTransition}
          type="button"
          id="header-home"
          onClick={onHome}
          className="rounded-lg px-1 py-0.5 text-left transition-colors hover:opacity-80 focus-visible:bg-mist"
          aria-label="Morpiks Solutions, back to start"
        >
          <Wordmark />
        </motion.button>
      </div>

      <motion.button
        type="button"
        id="header-cta"
        onClick={onCta}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="shrink-0 rounded-full bg-obsidian px-3.5 py-1.5 text-xs font-medium whitespace-nowrap text-offwhite transition-colors hover:bg-graphite focus-visible:bg-steel sm:px-5 sm:py-2.5 sm:text-sm"
      >
        {t(UI.cta)}
      </motion.button>
    </header>
  );
}
