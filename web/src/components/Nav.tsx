"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import { UI } from "@/lib/content";

export type NavTarget = "portfolio" | "services" | "about" | "contact";
const ITEMS: NavTarget[] = ["portfolio", "services", "about", "contact"]; // PRD 7.2 order

interface NavProps {
  /** Pill is shown (after the intro). */
  visible: boolean;
  /** Pill has expanded to show its items (500ms later, PRD 6.3). */
  revealed: boolean;
  active: NavTarget;
  onSelect: (target: NavTarget) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * PRD 7: centred, bottom, semi-floating bar. Flat: text + background only.
 * The whole block resizes with its content (layout animation), including on language change.
 */
export function Nav({ visible, revealed, active, onSelect }: NavProps) {
  const { t, lang, toggle } = useLanguage();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-40 flex justify-center px-2 sm:bottom-6 sm:px-3">
      <motion.nav
        layout
        aria-label="Primary"
        className="pointer-events-auto flex h-11 sm:h-12 items-center overflow-hidden rounded-full bg-obsidian p-1"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.6 }}
        transition={{ duration: 0.5, ease: EASE, layout: { duration: 0.45, ease: EASE } }}
        style={{ borderRadius: 999 }}
      >
        <AnimatePresence initial={false}>
          {revealed && (
            <motion.ul
              key="items"
              layout
              className="flex items-center"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            >
              {ITEMS.map((item) => {
                const isActive = active === item;
                return (
                  <motion.li
                    key={item}
                    layout
                    variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <button
                      type="button"
                      id={`nav-${item}`}
                      onClick={() => onSelect(item)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block h-9 sm:h-10 rounded-full px-2.5 sm:px-5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                        isActive ? "text-offwhite" : "text-mist hover:text-offwhite"
                      } focus-visible:bg-offwhite focus-visible:text-obsidian`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-full bg-graphite"
                          transition={{ duration: 0.45, ease: EASE }}
                        />
                      )}
                      <motion.span layout="position" className="relative">
                        {t(UI.nav[item])}
                      </motion.span>
                    </button>
                  </motion.li>
                );
              })}
              <motion.li
                layout
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, ease: EASE }}
                className="ml-0.5 sm:ml-1"
              >
                <button
                  type="button"
                  id="nav-language"
                  onClick={toggle}
                  aria-label={t(UI.nav.language)}
                  className="block h-9 sm:h-10 rounded-full bg-graphite/0 px-2 sm:px-4 text-[11px] sm:text-[12px] font-semibold tracking-wider text-steel transition-colors hover:text-offwhite focus-visible:bg-offwhite focus-visible:text-obsidian whitespace-nowrap"
                >
                  <span className={lang === "en" ? "text-offwhite" : undefined}>EN</span>
                  <span className="px-0.5 sm:px-1 text-graphite">/</span>
                  <span className={lang === "id" ? "text-offwhite" : undefined}>ID</span>
                </button>
              </motion.li>
            </motion.ul>
          )}
        </AnimatePresence>
        {!revealed && <span className="block h-9 sm:h-10 w-9 sm:w-10" aria-hidden="true" />}
      </motion.nav>
    </div>
  );
}
