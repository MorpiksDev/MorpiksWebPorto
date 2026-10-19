/**
 * Shard data extracted from Assets/chameleon-low-poly.svg.
 * 6 groups (crest, head, body, front-leg, back-leg, tail), 24 shards, eye = sclera + pupil.
 * Palette remapped per PRD 3.1: base #111111, hover #777777.
 */

export type ShardGroup = "crest" | "head" | "body" | "front-leg" | "back-leg" | "tail";

export interface Shard {
  id: string;
  name: string;
  group: ShardGroup;
  cx: number;
  cy: number;
  points: string;
}

/** Cropped to the artwork bounds (original viewBox is 0 0 547 456). */
export const LOGO_VIEWBOX = { x: 80, y: 46, w: 352, h: 370 };
export const LOGO_VIEWBOX_STR = `${LOGO_VIEWBOX.x} ${LOGO_VIEWBOX.y} ${LOGO_VIEWBOX.w} ${LOGO_VIEWBOX.h}`;

/** Visual centre of the artwork, used to compute each shard's outward direction. */
export const LOGO_CENTER = { x: 255.5, y: 230.5 };

export const LOGO_COLORS = {
  base: "#111111",
  hover: "#777777",
  sclera: "#FAFAFA",
  pupil: "#111111",
};

export const EYE = { cx: 128, cy: 139.5, scleraR: 9.8, pupilCx: 127, pupilR: 4.4 };

export const SHARDS: Shard[] = [
  { id: "crest-shard-1", name: "Crest Top Spike", group: "crest", cx: 185, cy: 87, points: "210,53 206,117 139,93" },

  { id: "head-face", name: "Face & Eye Socket", group: "head", cx: 123, cy: 139, points: "135,97 150,150 87,168" },
  { id: "head-temple", name: "Temple & Crown", group: "head", cx: 206, cy: 136, points: "220,111 253,145 159,145" },
  { id: "head-snout", name: "Snout & Nose", group: "head", cx: 108, cy: 181, points: "136,159 97,204 104,205 96,205 87,175" },
  { id: "head-jaw", name: "Lower Jaw", group: "head", cx: 142, cy: 198, points: "165,181 177,202 104,204" },

  { id: "body-spine-upper", name: "Upper Spine Ridge", group: "body", cx: 269, cy: 116, points: "303,94 272,154 229,108" },
  { id: "body-shoulder", name: "Shoulder Plate", group: "body", cx: 347, cy: 145, points: "316,96 388,142 348,200" },
  { id: "body-flank-upper", name: "Upper Flank", group: "body", cx: 289, cy: 181, points: "254,146 327,188 304,218 299,209 285,204 287,198" },
  { id: "body-chest", name: "Chest & Throat", group: "body", cx: 189, cy: 175, points: "232,176 205,204 188,204 150,151" },
  { id: "body-spine-mid", name: "Mid Spine Wedge", group: "body", cx: 396, cy: 191, points: "393,150 423,226 363,194" },
  { id: "body-flank-lower", name: "Lower Flank", group: "body", cx: 250, cy: 198, points: "237,179 285,201 269,205 215,204" },
  { id: "body-hip", name: "Hip & Pelvis", group: "body", cx: 339, cy: 221, points: "332,192 347,201 359,249 313,220" },

  { id: "front-leg-limb", name: "Front Forelimb & Foot", group: "front-leg", cx: 171, cy: 230, points: "178,204 184,211 199,211 171,250 142,250" },

  { id: "back-leg-limb", name: "Hind Limb & Foot", group: "back-leg", cx: 277, cy: 232, points: "284,208 303,219 279,249 250,249" },

  { id: "tail-shard-01", name: "Tail Base Outer", group: "tail", cx: 399, cy: 238, points: "384,214 424,235 394,266" },
  { id: "tail-shard-02", name: "Tail Base Inner", group: "tail", cx: 364, cy: 282, points: "361,251 391,270 348,316" },
  { id: "tail-shard-03", name: "Tail Upper Curve Outer", group: "tail", cx: 399, cy: 287, points: "424,245 410,306 362,315" },
  { id: "tail-shard-04", name: "Tail Mid Curve Outer", group: "tail", cx: 372, cy: 338, points: "404,316 354,370 357,325" },
  { id: "tail-shard-05", name: "Tail Mid Curve Inner", group: "tail", cx: 334, cy: 348, points: "347,318 347,372 305,354" },
  { id: "tail-shard-06", name: "Tail Lower Bend Outer", group: "tail", cx: 303, cy: 386, points: "304,362 343,379 266,408" },
  { id: "tail-shard-07", name: "Tail Lower Bend Inner", group: "tail", cx: 264, cy: 374, points: "298,357 260,404 229,370" },
  { id: "tail-shard-08", name: "Tail Coil Bottom Outer", group: "tail", cx: 221, cy: 388, points: "219,369 254,408 187,381" },
  { id: "tail-shard-09", name: "Tail Coil Ascending Inner", group: "tail", cx: 195, cy: 365, points: "192,353 213,364 181,377" },
  { id: "tail-shard-10", name: "Tail Tip Spike", group: "tail", cx: 159, cy: 343, points: "127,315 187,349 175,375" },
];

/** Unit vector from the logo centre through the shard centroid. */
export function outwardDirection(s: Pick<Shard, "cx" | "cy">) {
  const dx = s.cx - LOGO_CENTER.x;
  const dy = s.cy - LOGO_CENTER.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

/** Transform-origin (as % of the cropped viewBox) so each shard rotates around its own centroid. */
export function shardOrigin(s: Pick<Shard, "cx" | "cy">) {
  const ox = ((s.cx - LOGO_VIEWBOX.x) / LOGO_VIEWBOX.w) * 100;
  const oy = ((s.cy - LOGO_VIEWBOX.y) / LOGO_VIEWBOX.h) * 100;
  return `${ox.toFixed(2)}% ${oy.toFixed(2)}%`;
}

/** Head group only, used for the favicon (PRD 3.3). */
export const HEAD_SHARD_IDS = ["head-face", "head-temple", "head-snout", "head-jaw"];
