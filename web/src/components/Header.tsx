"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChameleonLogo } from "./ChameleonLogo";
import { Wordmark } from "./Wordmark";
import { useLanguage } from "./LanguageProvider";
import { UI } from "@/lib/content";

interface HeaderProps {
  onHome: () => void;
  onCta: () => void;
  /** Brand logo is shown here (false while the contact view owns it or a flight is in progress). */
  brandVisible?: boolean;
  /** Switch without fading (flight hand-off). When false, the visibility change fades. */
  instant?: boolean;
  /** Header wordmark words are shown. False while the intro words are still travelling to them. */
  wordsRevealed?: boolean;
  /** Logo slot is open (takes width). Closed only after the logo has landed in the contact view. */
  slotOpen?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Logo slot width: 32px on mobile, 44px on sm+ (matches w-8 / sm:w-11). */
const LOGO_WIDTH_MOBILE = 32;
const LOGO_WIDTH_SM = 44;
const SM_BREAKPOINT = 640; // Tailwind sm

/** Current expanded logo width in px, read from the viewport (kept in sync on resize). */
function useLogoWidth(): number {
  const [width, setWidth] = useState(LOGO_WIDTH_MOBILE);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth >= SM_BREAKPOINT ? LOGO_WIDTH_SM : LOGO_WIDTH_MOBILE);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

/**
 * PRD 6.2: logo + wordmark settle top-left. Hero CTA top-right (PRD 10.1).
 * Intro shards fly into the brand logo via shared layoutIds. In contact view the brand logo
 * fades out in place (its slot is kept so the wordmark does not shift); the contact panel owns the logo there.
 */
export function Header({
  onHome,
  onCta,
  brandVisible = true,
  instant = false,
  wordsRevealed = true,
  slotOpen = true,
}: HeaderProps) {
  const { t } = useLanguage();
  const logoWidth = useLogoWidth();

  return (
    <header className="header-surface fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 transition-colors sm:px-10 sm:py-4">
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/*
         * Logo slot: collapses to zero width while the contact view owns the logo, so the wordmark slides left
         * to close the gap, and re-expands when the logo flies back. Width is animated via the layout system
         * (not per-frame style writes), so the wordmark follows smoothly.
         */}
        <motion.div
          className="relative shrink-0 overflow-hidden"
          initial={false}
          animate={{ width: slotOpen ? logoWidth : 0 }}
          transition={{ width: { duration: 0.6, ease: EASE } }}
        >
          <motion.div
            id="header-logo"
            className="relative"
            style={{ width: logoWidth, pointerEvents: brandVisible ? undefined : "none" }}
            initial={false}
            animate={{ opacity: brandVisible ? 1 : 0 }}
            transition={{ duration: instant ? 0 : 0.45, ease: EASE }}
            aria-hidden={!brandVisible || undefined}
          >
            <ChameleonLogo shardLayoutPrefix="brand-chameleon" className="w-full" interactive={brandVisible} />
          </motion.div>
        </motion.div>
        <motion.button
          initial={false}
          type="button"
          id="header-home"
          onClick={onHome}
          className="rounded-lg px-1 py-0.5 text-left transition-colors hover:opacity-80 focus-visible:bg-mist"
          aria-label="Morpiks Solutions, back to start"
        >
          {/* Words stay hidden until the intro words have landed on them (see Intro). */}
          <Wordmark wordsHidden={!wordsRevealed} />
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
