"use client";

import { motion } from "framer-motion";
import { EYE, LOGO_COLORS, LOGO_VIEWBOX_STR, SHARDS, outwardDirection } from "@/lib/logo";
import { TEAR_ORDER } from "./ChameleonLogo";

export interface LogoRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Total time from the first shard leaving to the last shard landing. */
export const FLIGHT_MS = 1600;
const STAGGER_S = 0.02;
const LAST_RANK = Math.max(...Object.values(TEAR_ORDER));
const SHARD_S = FLIGHT_MS / 1000 - STAGGER_S * LAST_RANK; // every shard lands together at FLIGHT_MS
const ARC_PX = 14; // outward bulge at the midpoint so shards separate instead of moving as one block
const EASE = [0.22, 1, 0.36, 1] as const;

interface LogoFlightProps {
  /** Logo box the shards start in (viewport coordinates). */
  from: LogoRect;
  /** Logo box the shards land in. Null holds the shards at `from` (used while the page scrolls). */
  to: LogoRect | null;
}

/**
 * Fixed-position overlay that carries the 24 logo shards between the header logo and the contact logo.
 * Lives outside the scroll container, so its coordinates stay valid while the page moves.
 * Transforms only (x / y / scale), so no layout work runs per frame.
 * Covers the viewport, so pointer input is blocked for the duration of the flight.
 */
export function LogoFlight({ from, to }: LogoFlightProps) {
  const scale = to ? to.width / from.width : 1;
  const dx = to ? to.left - from.left : 0;
  const dy = to ? to.top - from.top : 0;

  return (
    <div className="fixed inset-0 z-[45]" aria-hidden="true">
      {SHARDS.map((s) => {
        const rank = TEAR_ORDER[s.id] ?? LAST_RANK; // same head-first order on entry and exit
        const dir = outwardDirection(s);
        const isFace = s.id === "head-face";

        const delay = rank * STAGGER_S;
        // Two nested layers, each with a single continuous curve (no keyframe stops, so no two-step look):
        // the outer layer adds a symmetric outward bulge; the inner layer travels straight to the target.
        return (
          <motion.div
            key={s.id}
            className="absolute"
            style={{ left: from.left, top: from.top, width: from.width, height: from.height, transformOrigin: "0 0" }}
            initial={{ x: 0, y: 0 }}
            animate={
              to
                ? { x: [0, dir.x * ARC_PX, 0], y: [0, dir.y * ARC_PX, 0] }
                : { x: 0, y: 0 }
            }
            transition={{ duration: SHARD_S, delay, ease: EASE, times: [0, 0.5, 1] }}
          >
            <motion.div
              className="h-full w-full"
              style={{ transformOrigin: "0 0" }}
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={to ? { x: dx, y: dy, scale } : { x: 0, y: 0, scale: 1 }}
              transition={{ duration: SHARD_S, delay, ease: EASE }}
            >
              <svg viewBox={LOGO_VIEWBOX_STR} className="h-full w-full overflow-visible" aria-hidden="true" focusable="false">
                <polygon points={s.points} fill={LOGO_COLORS.base} />
                {isFace && (
                  <g>
                    <circle cx={EYE.cx} cy={EYE.cy} r={EYE.scleraR} fill={LOGO_COLORS.sclera} />
                    <circle cx={EYE.pupilCx} cy={EYE.cy} r={EYE.pupilR} fill={LOGO_COLORS.pupil} />
                  </g>
                )}
              </svg>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
