"use client";

import { motion, type Transition } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import {
  EYE,
  LOGO_COLORS,
  LOGO_VIEWBOX,
  LOGO_VIEWBOX_STR,
  SHARDS,
  outwardDirection,
  shardOrigin,
  type Shard,
} from "@/lib/logo";

export interface ShardScramble {
  x: number;
  y: number;
  z: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  delay: number;
  duration: number;
}

const CUBE_ANGLES = [-270, -180, -90, 90, 180, 270];
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/**
 * PRD 6.1 / Q18: a new random cube-style scramble on every load.
 * Every shard always settles into the same final arrangement (identity transform).
 * Delay + duration stay under ~2.6s so everything has settled before the 3s bar finishes.
 */
export function createScramble(): Record<string, ShardScramble> {
  const out: Record<string, ShardScramble> = {};
  for (const s of SHARDS) {
    const dir = outwardDirection(s);
    const spread = rand(90, 220);
    out[s.id] = {
      x: dir.x * spread + rand(-60, 60),
      y: dir.y * spread + rand(-60, 60),
      z: rand(-420, 320),
      rotateX: pick(CUBE_ANGLES),
      rotateY: pick(CUBE_ANGLES),
      rotateZ: pick([-90, 0, 90]),
      delay: rand(0, 0.35),
      duration: rand(1.4, 1.8),
    };
  }
  return out;
}

/**
 * Optimized 3D scramble when transitioning into the Contact section.
 * Faster settling (~1.2s) matching the panel scroll transition.
 */
export function createContactScramble(): Record<string, ShardScramble> {
  const out: Record<string, ShardScramble> = {};
  for (const s of SHARDS) {
    const dir = outwardDirection(s);
    const spread = rand(90, 190);
    out[s.id] = {
      x: dir.x * spread + rand(-40, 40),
      y: dir.y * spread + rand(-40, 40),
      z: rand(-320, 220),
      rotateX: pick(CUBE_ANGLES),
      rotateY: pick(CUBE_ANGLES),
      rotateZ: pick([-90, 0, 90]),
      delay: rand(0, 0.28),
      duration: rand(1.1, 1.45),
    };
  }
  return out;
}

/**
 * Deliberate piece-by-piece tear-apart departure sequence:
 * Head/snout leads the flight, followed by crest, chest, body, limbs, and curling tail.
 */
export const TEAR_ORDER: Record<string, number> = {
  "head-snout": 0,
  "head-face": 1,
  "head-temple": 2,
  "head-jaw": 3,
  "crest-shard-1": 4,
  "body-chest": 5,
  "front-leg-limb": 6,
  "body-flank-upper": 7,
  "body-shoulder": 8,
  "body-spine-upper": 9,
  "body-flank-lower": 10,
  "body-spine-mid": 11,
  "body-hip": 12,
  "back-leg-limb": 13,
  "tail-shard-01": 14,
  "tail-shard-02": 15,
  "tail-shard-03": 16,
  "tail-shard-04": 17,
  "tail-shard-05": 18,
  "tail-shard-06": 19,
  "tail-shard-07": 20,
  "tail-shard-08": 21,
  "tail-shard-09": 22,
  "tail-shard-10": 23,
};

const HOVER_OFFSET_PX = 4; // PRD 3.2

interface ChameleonLogoProps {
  /** When set, shards start scrambled and animate into place. */
  scramble?: Record<string, ShardScramble> | null;
  /** Enables hover nudge and click flip (PRD 3.2). */
  interactive?: boolean;
  className?: string;
  label?: string;
  /** Prefix for individual shard layout animations between containers. */
  shardLayoutPrefix?: string;
}

export function ChameleonLogo({
  scramble,
  interactive = true,
  className,
  label = "Morpiks chameleon logo",
  shardLayoutPrefix,
}: ChameleonLogoProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [flips, setFlips] = useState<Record<string, number>>({});
  const [settled, setSettled] = useState(!scramble);

  const onFlip = useCallback((id: string) => {
    setFlips((f) => ({ ...f, [id]: (f[id] ?? 0) + 1 }));
  }, []);

  // Switch to the interactive transitions once the slowest shard has landed.
  useEffect(() => {
    if (!scramble) {
      setSettled(true);
      return;
    }
    setSettled(false);
    const end = Math.max(...Object.values(scramble).map((s) => s.delay + s.duration));
    const id = window.setTimeout(() => setSettled(true), end * 1000);
    return () => window.clearTimeout(id);
  }, [scramble]);

  return (
    <div
      role="img"
      aria-label={label}
      className={className}
      style={{ aspectRatio: `${LOGO_VIEWBOX.w} / ${LOGO_VIEWBOX.h}`, perspective: 900 }}
    >
      <div className="logo-stage h-full w-full">
        {SHARDS.map((s, idx) => (
          <ShardLayer
            key={s.id}
            shard={s}
            shardIndex={idx}
            shardLayoutPrefix={shardLayoutPrefix}
            scramble={scramble?.[s.id]}
            settled={settled}
            hovered={interactive && hovered === s.id}
            flips={flips[s.id] ?? 0}
            interactive={interactive}
            onHover={setHovered}
            onFlip={onFlip}
          />
        ))}
      </div>
    </div>
  );
}

interface ShardLayerProps {
  shard: Shard;
  shardIndex: number;
  shardLayoutPrefix?: string;
  scramble?: ShardScramble;
  settled: boolean;
  hovered: boolean;
  flips: number;
  interactive: boolean;
  onHover: (id: string | null) => void;
  onFlip: (id: string) => void;
}

function ShardLayer({
  shard,
  shardIndex,
  shardLayoutPrefix,
  scramble,
  settled,
  hovered,
  flips,
  interactive,
  onHover,
  onFlip,
}: ShardLayerProps) {
  const dir = outwardDirection(shard);
  const isFace = shard.id === "head-face";

  const introTransition: Transition | undefined = scramble
    ? { duration: scramble.duration, delay: scramble.delay, ease: [0.22, 1, 0.36, 1] }
    : undefined;

  const interactiveTransition: Transition = {
    x: { type: "spring", stiffness: 420, damping: 22 },
    y: { type: "spring", stiffness: 420, damping: 22 },
    rotateY: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    default: { duration: 0.3 },
  };

  // Staggered piece-by-piece departure: snout -> face -> temple -> crest -> body -> limbs -> tail
  const tearRank = TEAR_ORDER[shard.id] ?? shardIndex;
  const tearDelay = tearRank * 0.032;

  const layoutTransition: Transition = {
    duration: 0.85,
    delay: tearDelay,
    ease: [0.22, 1, 0.36, 1],
  };

  const handlers = interactive
    ? {
        onPointerEnter: () => onHover(shard.id),
        onPointerLeave: () => onHover(null),
        onClick: () => onFlip(shard.id),
        style: { cursor: "pointer" },
      }
    : {};

  return (
    <motion.div
      className="logo-layer"
      layoutId={shardLayoutPrefix ? `${shardLayoutPrefix}-${shard.id}` : undefined}
      transition={{ layout: layoutTransition }}
    >
      <motion.div
        className="h-full w-full"
        style={{ transformOrigin: shardOrigin(shard), transformStyle: "preserve-3d" }}
        initial={
          scramble
            ? {
                x: scramble.x,
                y: scramble.y,
                z: scramble.z,
                rotateX: scramble.rotateX,
                rotateY: scramble.rotateY,
                rotateZ: scramble.rotateZ,
                opacity: 0,
              }
            : false
        }
        animate={{
          x: hovered ? dir.x * HOVER_OFFSET_PX : 0,
          y: hovered ? dir.y * HOVER_OFFSET_PX : 0,
          z: 0,
          rotateX: 0,
          rotateY: flips * 180 * 2, // a full flip per click, accumulative so repeat clicks keep flipping
          rotateZ: 0,
          opacity: 1,
        }}
        transition={settled || !introTransition ? interactiveTransition : introTransition}
      >
        <svg viewBox={LOGO_VIEWBOX_STR} aria-hidden="true" focusable="false">
          <g {...handlers}>
            <polygon
              points={shard.points}
              style={{
                fill: hovered ? LOGO_COLORS.hover : LOGO_COLORS.base,
                transition: "fill 0.25s ease",
              }}
            />
            {isFace && (
              <g>
                <circle cx={EYE.cx} cy={EYE.cy} r={EYE.scleraR} fill={LOGO_COLORS.sclera} style={{ pointerEvents: "visiblePainted" }} />
                <circle cx={EYE.pupilCx} cy={EYE.cy} r={EYE.pupilR} fill={LOGO_COLORS.pupil} style={{ pointerEvents: "visiblePainted" }} />
              </g>
            )}
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
