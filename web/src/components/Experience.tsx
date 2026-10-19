"use client";

import { AnimatePresence, LayoutGroup, MotionConfig, animate, useReducedMotion, type AnimationPlaybackControls } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { ContactPanel } from "./ContactPanel";
import { Header } from "./Header";
import { Intro } from "./Intro";
import { Nav, type NavTarget } from "./Nav";
import { AboutPanel, ApproachPanel } from "./Panels";
import { Slider } from "./Slider";
import { SLIDES, type Subject } from "@/lib/content";

const NAV_REVEAL_DELAY_MS = 500; // PRD 6.3
const SCROLL_DURATION = 0.85;
const EASE = [0.22, 1, 0.36, 1] as const;
const LAST_SLIDE = SLIDES.length - 1;

/** Vertical snap sections: 0 = slider, 1 = about, 2 = approach, 3 = contact. */
const SECTION = { slider: 0, about: 1, approach: 2, contact: 3 } as const;

type Axis = "scrollLeft" | "scrollTop";

export function Experience() {
  const reduced = useReducedMotion() ?? false;

  const [phase, setPhase] = useState<"intro" | "done">("intro");
  const [navRevealed, setNavRevealed] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [holds, setHolds] = useState({ hover: false, focus: false });
  const [pageVisible, setPageVisible] = useState(true);
  const [subject, setSubject] = useState<Subject>("consultation");

  const vRef = useRef<HTMLElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const sliderSectionRef = useRef<HTMLElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const anims = useRef<Partial<Record<Axis, AnimationPlaybackControls>>>({});

  // Latest values for event handlers registered once.
  const state = useRef({ activeSlide, activeSection, phase });
  state.current = { activeSlide, activeSection, phase };

  /* ---------- Intro -> hero ---------- */

  const finishIntro = useCallback(() => setPhase("done"), []);

  useEffect(() => {
    if (phase !== "done") return;
    const id = window.setTimeout(() => setNavRevealed(true), NAV_REVEAL_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  /* ---------- Scroll primitives (PRD 8.4: CSS snap + Framer Motion between snap points) ---------- */

  const scrollTo = useCallback(
    (el: HTMLElement | null, axis: Axis, target: number, onDone?: () => void) => {
      if (!el) return;
      anims.current[axis]?.stop();
      if (reduced || Math.abs(el[axis] - target) < 1) {
        el[axis] = target;
        onDone?.();
        return;
      }
      // Pause native snapping while we drive the position, otherwise each frame gets re-snapped.
      el.classList.add("snap-paused");
      anims.current[axis] = animate(el[axis], target, {
        duration: SCROLL_DURATION,
        ease: EASE,
        onUpdate: (v) => {
          el[axis] = v;
        },
        onComplete: () => {
          el.classList.remove("snap-paused");
          onDone?.();
        },
        onStop: () => el.classList.remove("snap-paused"),
      });
    },
    [reduced],
  );

  const goToSection = useCallback(
    (index: number, onDone?: () => void) => {
      const el = sectionRefs.current[index];
      if (!el) return;
      setActiveSection(index);
      scrollTo(vRef.current, "scrollTop", el.offsetTop, onDone);
    },
    [scrollTo],
  );

  const goToSlide = useCallback(
    (index: number) => {
      const track = hRef.current;
      if (!track) return;
      const i = Math.max(0, Math.min(LAST_SLIDE, index));
      setActiveSlide(i);
      scrollTo(track, "scrollLeft", i * track.clientWidth);
      if (state.current.activeSection !== SECTION.slider) goToSection(SECTION.slider);
    },
    [scrollTo, goToSection],
  );

  /* ---------- Track the snapped position from native scrolling (touch, trackpad, keyboard) ---------- */

  useEffect(() => {
    const track = hRef.current;
    const v = vRef.current;
    if (!track || !v) return;

    const onH = () => {
      if (anims.current.scrollLeft?.state === "running") return;
      const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
      setActiveSlide(Math.max(0, Math.min(LAST_SLIDE, i)));
    };
    const onV = () => {
      if (anims.current.scrollTop?.state === "running") return;
      const top = v.scrollTop;
      let best = 0;
      let bestDist = Infinity;
      sectionRefs.current.forEach((s, i) => {
        if (!s) return;
        const d = Math.abs(s.offsetTop - top);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveSection(best);
    };

    track.addEventListener("scroll", onH, { passive: true });
    v.addEventListener("scroll", onV, { passive: true });
    return () => {
      track.removeEventListener("scroll", onH);
      v.removeEventListener("scroll", onV);
    };
  }, []);

  // Keep the current slide aligned when the viewport is resized.
  useEffect(() => {
    const onResize = () => {
      const track = hRef.current;
      if (track) track.scrollLeft = state.current.activeSlide * track.clientWidth;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------- Wheel handler (PRD 8.3, 8.4) ----------
   * While the slider is active, vertical wheel input anywhere on the window steps through slides.
   * Past the last slide, scrolling down continues to the About section.
   * Horizontal trackpad gestures are left to native scroll-snap.
   */
  useEffect(() => {
    let lockStart = 0;
    let lastEvent = 0;

    const onWheel = (e: WheelEvent) => {
      const { phase: p, activeSlide: slide, activeSection: section } = state.current;
      if (p === "intro") {
        e.preventDefault();
        return;
      }

      if (section === SECTION.slider) {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // native horizontal swipe
        e.preventDefault();

        const now = performance.now();
        // Stay locked while a step animates and while trackpad inertia keeps firing events.
        if (now - lockStart < 700 || now - lastEvent < 180) {
          lastEvent = now;
          return;
        }
        lastEvent = now;
        if (Math.abs(e.deltaY) < 4) return;
        lockStart = now;

        if (e.deltaY > 0) {
          if (slide < LAST_SLIDE) goToSlide(slide + 1);
          else goToSection(SECTION.about);
        } else if (slide > 0) {
          goToSlide(slide - 1);
        }
      } else if (section === SECTION.about) {
        // If at the top of About and scrolling up, return to the last showcase slide.
        const v = vRef.current;
        if (v && v.scrollTop <= 10 && e.deltaY < -10) {
          e.preventDefault();
          const now = performance.now();
          if (now - lockStart < 700) return;
          lockStart = now;
          goToSlide(LAST_SLIDE);
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [goToSlide, goToSection]);

  /* ---------- Keyboard (PRD 11) ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { phase: p, activeSlide: slide, activeSection: section } = state.current;
      if (p === "intro" || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;

      if (section === SECTION.slider && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
        e.preventDefault();
        goToSlide(slide + (e.key === "ArrowRight" ? 1 : -1));
      } else if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goToSection(Math.min(SECTION.contact, section + 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goToSection(Math.max(SECTION.slider, section - 1));
      } else if (e.key === "Home") {
        e.preventDefault();
        goToSlide(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goToSection(SECTION.contact);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToSlide, goToSection]);

  /* ---------- Autoplay (PRD 8.1) ---------- */
  useEffect(() => {
    const onVis = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const running =
    phase === "done" && playing && !reduced && !holds.hover && !holds.focus && pageVisible && activeSection === SECTION.slider;

  const onAdvance = useCallback(() => {
    const slide = state.current.activeSlide;
    goToSlide(slide >= LAST_SLIDE ? 0 : slide + 1);
  }, [goToSlide]);

  const onHoldChange = useCallback((key: "hover" | "focus", held: boolean) => {
    setHolds((h) => (h[key] === held ? h : { ...h, [key]: held }));
  }, []);

  /* ---------- Navigation + CTA ---------- */

  const navActive: NavTarget =
    activeSection === SECTION.slider
      ? activeSlide === 0
        ? "portfolio"
        : "services"
      : activeSection === SECTION.contact
        ? "contact"
        : "about";

  const onNavSelect = useCallback(
    (target: NavTarget) => {
      if (target === "portfolio") goToSlide(0);
      else if (target === "services") goToSlide(1);
      else if (target === "about") goToSection(SECTION.about);
      else goToSection(SECTION.contact);
    },
    [goToSlide, goToSection],
  );

  // PRD 10.1 / Q25: scroll to Contact and pre-select "consultation".
  const onCta = useCallback(() => {
    setSubject("consultation");
    goToSection(SECTION.contact, () => nameRef.current?.focus({ preventScroll: true }));
  }, [goToSection]);

  const setSectionRef = (i: number) => (el: HTMLElement | null) => {
    sectionRefs.current[i] = el;
  };

  const panelClass = "snap-panel flex min-h-dvh items-center px-5 pb-28 pt-28 sm:px-10 sm:pb-32 lg:px-16";

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <AnimatePresence>{phase === "intro" && <Intro key="intro" reduced={reduced} onComplete={finishIntro} />}</AnimatePresence>

        {phase === "done" && (
          <Header
            onHome={() => goToSlide(0)}
            onCta={onCta}
            inContact={activeSection === SECTION.contact}
          />
        )}

        <main
          ref={vRef}
          id="main"
          className={`snap-y-container ${phase === "intro" ? "overflow-hidden" : ""}`}
          inert={phase === "intro"}
        >
          <h1 className="sr-only">Morpiks Solutions: multi-solution company in Bogor, Indonesia. Evolve Beyond Limits.</h1>

          <section
            id="portfolio"
            ref={(el) => {
              sliderSectionRef.current = el;
              sectionRefs.current[SECTION.slider] = el;
            }}
            className="snap-panel relative h-dvh"
          >
            <Slider
              trackRef={hRef}
              active={activeSlide}
              playing={playing}
              running={running}
              reduced={reduced}
              onGoTo={goToSlide}
              onAdvance={onAdvance}
              onTogglePlay={() => setPlaying((p) => !p)}
              onHoldChange={onHoldChange}
            />
          </section>

          <section id="about" ref={setSectionRef(SECTION.about)} className={panelClass}>
            <AboutPanel />
          </section>

          <section id="approach" ref={setSectionRef(SECTION.approach)} className={panelClass}>
            <ApproachPanel />
          </section>

          <section id="contact" ref={setSectionRef(SECTION.contact)} className={panelClass}>
            <ContactPanel
              ref={nameRef}
              active={activeSection === SECTION.contact}
              subject={subject}
              onSubjectChange={setSubject}
              onCta={onCta}
            />
          </section>
        </main>

        <Nav visible={phase === "done"} revealed={navRevealed} active={navActive} onSelect={onNavSelect} />
      </LayoutGroup>
    </MotionConfig>
  );
}
