"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { RefObject } from "react";
import { useLanguage } from "./LanguageProvider";
import { SLIDES, UI } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

interface SliderProps {
  trackRef: RefObject<HTMLDivElement | null>;
  active: number;
  /** User-controlled play/pause (PRD 8.1, Q11). */
  playing: boolean;
  /** Progress actually runs: playing, not hovered/focused, slider visible, no reduced motion. */
  running: boolean;
  reduced: boolean;
  onGoTo: (index: number) => void;
  onAdvance: () => void;
  onTogglePlay: () => void;
  onHoldChange: (key: "hover" | "focus", held: boolean) => void;
}

export function Slider({ trackRef, active, playing, running, reduced, onGoTo, onAdvance, onTogglePlay, onHoldChange }: SliderProps) {
  const { t, lang } = useLanguage();
  const total = SLIDES.length;

  return (
    <div
      className="relative h-full"
      role="region"
      aria-roledescription="carousel"
      aria-label={t(UI.slider.label)}
      onFocus={() => onHoldChange("focus", true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onHoldChange("focus", false);
      }}
    >
      <div ref={trackRef} id="slider-track" className="snap-x-container">
        {SLIDES.map((slide, i) => {
          const isActive = i === active;
          return (
            <article
              key={slide.id}
              id={`slide-${slide.id}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} ${t(UI.slider.of)} ${total}`}
              aria-hidden={!isActive}
              className="snap-panel h-full w-full shrink-0 px-4 pt-16 pb-32 sm:px-10 sm:pt-24 sm:pb-44 lg:px-16 lg:pt-28 lg:pb-48"
            >
              <div
                className="mx-auto flex h-full max-w-7xl flex-col justify-center gap-4 sm:gap-6 lg:grid lg:grid-cols-12 lg:items-center lg:gap-14"
                onPointerEnter={() => onHoldChange("hover", true)}
                onPointerLeave={() => onHoldChange("hover", false)}
              >
                <motion.div
                  className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-h-[30vh] sm:max-h-[360px] lg:max-h-none shrink-0 overflow-hidden rounded-[18px] sm:rounded-[28px] bg-obsidian lg:order-2 lg:col-span-7"
                  initial={false}
                  animate={{ scale: isActive ? 1 : 0.94, opacity: isActive ? 1 : 0.4 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <Image
                    src={slide.image}
                    alt={t(slide.alt)}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    priority={i === 0}
                    className="object-cover"
                  />
                </motion.div>

                <motion.div
                  className="flex shrink-0 flex-col justify-center lg:order-1 lg:col-span-5"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: isActive ? 0.12 : 0, ease: EASE }}
                >
                  <p className="text-xs sm:text-[13px] font-medium tracking-wide text-graphite">
                    <span className="tabular-nums">{pad(i + 1)}</span>
                    <span className="mx-2 text-mist">/</span>
                    {t(UI.category[slide.category])}
                  </p>
                  <h2 className="mt-1.5 sm:mt-3 text-2xl sm:text-4xl lg:text-5xl font-semibold leading-[1.1] tracking-tight text-obsidian">
                    {t(slide.title)}
                  </h2>
                  <p className="mt-2 sm:mt-4 max-w-md text-sm sm:text-base leading-relaxed text-graphite">
                    {t(slide.description)}
                  </p>
                  <ul className="mt-3 sm:mt-6 hidden flex-wrap gap-1.5 sm:gap-2 sm:flex">
                    {slide.highlights[lang].map((h) => (
                      <li key={h} className="rounded-full bg-mist/50 px-3 py-1 text-xs sm:text-[13px] font-medium text-graphite">
                        {h}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Controls: keyboard accessible, pause on hover/focus (PRD 8.1, 11) */}
      <div
        className="absolute inset-x-0 bottom-18 sm:bottom-28 px-4 sm:px-10 lg:px-16"
        onPointerEnter={() => onHoldChange("hover", true)}
        onPointerLeave={() => onHoldChange("hover", false)}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-4 sm:gap-6">
          <p className="w-14 shrink-0 text-[13px] font-medium tabular-nums text-graphite" aria-live="polite">
            {pad(active + 1)} <span className="text-steel">/ {pad(total)}</span>
          </p>

          <div className="flex flex-1 items-center gap-1.5">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                id={`slider-dot-${i + 1}`}
                onClick={() => onGoTo(i)}
                aria-label={`${t(UI.slider.goTo)} ${i + 1}: ${t(slide.title)}`}
                aria-current={i === active ? "true" : undefined}
                className="group flex-1 rounded-full py-3 focus-visible:bg-mist"
              >
                <span className="relative block h-[3px] overflow-hidden rounded-full bg-mist transition-colors group-hover:bg-steel/60">
                  {i < active && <span className="absolute inset-0 bg-obsidian" />}
                  {i === active &&
                    (playing && !reduced ? (
                      <span
                        key={`fill-${active}`}
                        className="progress-fill absolute inset-0 bg-obsidian"
                        style={{ animationPlayState: running ? "running" : "paused" }}
                        onAnimationEnd={onAdvance}
                      />
                    ) : (
                      <span className="absolute inset-0 bg-obsidian" />
                    ))}
                </span>
              </button>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-1 text-[13px] font-medium">
            <button
              type="button"
              id="slider-prev"
              onClick={() => onGoTo(Math.max(0, active - 1))}
              disabled={active === 0}
              className="hidden rounded-full px-3 py-2 text-graphite transition-colors hover:bg-mist/60 hover:text-obsidian focus-visible:bg-mist disabled:opacity-40 sm:block"
            >
              {t(UI.slider.prev)}
            </button>
            {!reduced && (
              <button
                type="button"
                id="slider-playpause"
                onClick={onTogglePlay}
                aria-pressed={!playing}
                className="w-16 rounded-full bg-mist/50 px-3 py-2 text-obsidian transition-colors hover:bg-mist focus-visible:bg-obsidian focus-visible:text-offwhite"
              >
                {playing ? t(UI.slider.pause) : t(UI.slider.play)}
              </button>
            )}
            <button
              type="button"
              id="slider-next"
              onClick={() => onGoTo(Math.min(total - 1, active + 1))}
              disabled={active === total - 1}
              className="hidden rounded-full px-3 py-2 text-graphite transition-colors hover:bg-mist/60 hover:text-obsidian focus-visible:bg-mist disabled:opacity-40 sm:block"
            >
              {t(UI.slider.next)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
