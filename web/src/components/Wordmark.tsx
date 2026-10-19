"use client";

import { useLanguage } from "./LanguageProvider";
import { TAGLINE } from "@/lib/content";

/** PRD 3.4: MORPIKS (800) + SOLUTIONS (300), tagline in Montserrat 400. */
export function Wordmark({ size = "sm", showTagline = true }: { size?: "sm" | "lg"; showTagline?: boolean }) {
  const { t } = useLanguage();
  const large = size === "lg";

  return (
    <div className="font-brand leading-none text-obsidian">
      <p className={large ? "text-2xl tracking-[0.18em] sm:text-3xl" : "text-[13px] tracking-[0.16em] sm:text-[15px]"}>
        <span className="font-extrabold">MORPIKS</span>{" "}
        <span className="font-light">SOLUTIONS</span>
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
