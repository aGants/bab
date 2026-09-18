import { WORD_CARDS } from '../bodyWordsData'

export const hashSeed = (str: string): number => {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

/** Deterministic per-shape drift timing so shapes float instead of sitting static,
 * each on its own out-of-sync rhythm (no two cards bob in unison). */
export const floatVars = (seed: string): { '--float-dur': string; '--float-delay': string } => {
  const rand = mulberry32(hashSeed(seed))
  const duration = 5 + rand() * 3 // 5s..8s
  const delay = -rand() * duration // negative delay starts mid-cycle, already desynced
  return {
    '--float-dur': `${duration.toFixed(2)}s`,
    '--float-delay': `${delay.toFixed(2)}s`,
  }
}

// deterministic 0..1 pseudo-random sequence from a string seed
const mulberry32 = (seed: number) => {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const round = (n: number): number => Math.round(n * 100) / 100

const polarPoint = (cx: number, cy: number, r: number, angleRad: number): [number, number] => [
  cx + r * Math.cos(angleRad),
  cy + r * Math.sin(angleRad),
]

const pathFromPoints = (pts: [number, number][]): string => {
  const [first, ...rest] = pts
  const cmds = rest.map(([x, y]) => `L ${round(x)} ${round(y)}`)
  return `M ${round(first[0])} ${round(first[1])} ${cmds.join(' ')} Z`
}

/** Renders a fixed list of per-angle radius multipliers (evenly spaced around the
 * centre) into an SVG path. `smooth: false` connects them with straight lines for a
 * jagged/spiky read; `smooth: true` eases through a rounded quadratic spline for a
 * soft, fleshy read. Sharing the same point count between two multiplier arrays is
 * what lets the browser morph smoothly between them (a real shape tween, not a
 * crossfade) — see `buildVisual` below. */
const radialPath = (multipliers: number[], baseRadius: number, smooth: boolean, cx = 50, cy = 50): string => {
  const n = multipliers.length
  const pts = multipliers.map((m, i) =>
    polarPoint(cx, cy, baseRadius * m, (i * 2 * Math.PI) / n - Math.PI / 2),
  )
  if (!smooth) return pathFromPoints(pts)

  const mid = (a: [number, number], b: [number, number]): [number, number] => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
  ]
  const start = mid(pts[n - 1], pts[0])
  let d = `M ${round(start[0])} ${round(start[1])} `
  for (let i = 0; i < n; i++) {
    const p = pts[i]
    const m = mid(p, pts[(i + 1) % n])
    d += `Q ${round(p[0])} ${round(p[1])} ${round(m[0])} ${round(m[1])} `
  }
  return `${d}Z`
}

/** Regular-polygon radius profile (circumradius normalized to 1), sampled at `n`
 * evenly spaced angles rather than just at the `sides` vertices — enough samples
 * along each straight edge reconstructs it almost exactly, but crucially gives the
 * shape the same point count as its "calm" circle, so the two can morph. An optional
 * `cornerCap` flattens the vertex peaks into rounded corners (a "squircle"). */
const polygonRadii = (n: number, sides: number, rotationDeg: number, cornerCap = Infinity): number[] => {
  const rotation = (rotationDeg * Math.PI) / 180
  const sector = (2 * Math.PI) / sides
  const half = sector / 2
  return Array.from({ length: n }, (_, i) => {
    const theta = (i * 2 * Math.PI) / n
    const psi = (((theta - rotation) % sector) + sector) % sector - half
    return Math.min(Math.cos(half) / Math.cos(psi), cornerCap)
  })
}

/** Star radius profile (outer points normalized to 1, inner notches at `innerRatio`). */
const starRadii = (points: number, innerRatio: number): number[] =>
  Array.from({ length: points * 2 }, (_, i) => (i % 2 === 0 ? 1 : innerRatio))

/** How much of the full shape's roughness survives in the settled state — low, so
 * calm reads as "barely-scalloped circle", not "same shape but smaller". */
const CALM_DAMPING = 0.15

/** Every card settles at this same radius when calm, so resting cards pack as
 * tightly as the grid allows — neighbouring cells' circles just about touch. */
const CARD_RADIUS = 49

/** A word's calm state is a near-perfect circle at `CARD_RADIUS` — the same for
 * every word, so resting cards are packed edge-to-edge. Its full shape is the
 * given radii, rescaled so its own tallest point *also* sits at `CARD_RADIUS`
 * (peaks don't grow past the resting circle and spill into neighbours — only the
 * lower points carve inward to reveal the shape), sampled with the same point
 * count and line style so the browser morphs the outline instead of jump-cutting. */
const buildVisual = (
  radii: number[],
  smooth: boolean,
  color: string,
): { path: string; calmPath: string; color: string } => {
  const normalized = radii.map((r) => r / Math.max(...radii))
  const calmRadii = normalized.map((r) => 1 + (r - 1) * CALM_DAMPING)
  return {
    path: radialPath(normalized, CARD_RADIUS, smooth),
    calmPath: radialPath(calmRadii, CARD_RADIUS, smooth),
    color,
  }
}

/** One hand-authored silhouette + color per word card, matching the BAB word-card
 * reference deck — every feeling reads as its own distinct shape, not a shared
 * per-category template. */
const WORD_VISUALS: Record<string, { path: string; calmPath: string; color: string }> = {
  // Muscle signals
  strong: buildVisual(polygonRadii(48, 4, -45, 0.85), false, '#EDEAF7'),
  light: buildVisual([0.9, 1.15, 0.8, 1.05, 1.25, 0.85, 0.95, 1.1], true, '#F0A0C4'),
  sore: buildVisual([1, 0.45, 1, 0.45, 1, 0.45, 1, 0.45], true, '#3F9E90'),
  achy: buildVisual(
    Array.from({ length: 16 }, (_, i) => (i % 2 === 0 ? 1 : 0.82)),
    false,
    '#16233F',
  ),
  tight: buildVisual(polygonRadii(48, 6, -90), false, '#0C4A45'),
  stiff: buildVisual(polygonRadii(48, 5, -90), false, '#E8836A'),
  unstable: buildVisual([1.25, 0.7, 0.7, 1.2, 0.65, 0.65, 1.3, 0.75, 0.75], true, '#DAD2F2'),

  // Pain types
  crampy: buildVisual(
    [0.55, 0.75, 1.15, 1.0, 0.8, 0.65, 0.55, 0.65, 0.8, 1.0, 1.15, 0.75],
    true,
    '#D6483F',
  ),
  gripping: buildVisual([1.05, 1.1, 0.9, 0.45, 0.4, 0.5, 0.95, 1.1, 1.05, 1.0], true, '#E2622A'),
  sharp: buildVisual(starRadii(7, 17 / 46), false, '#E41E26'),
  stabbing: buildVisual(starRadii(14, 10 / 46), false, '#3FA34D'),
  burning: buildVisual([1.35, 0.75, 1.0, 1.1, 0.9, 1.15, 1.0, 0.65, 0.85, 0.6], true, '#E2542D'),
  tingling: buildVisual(starRadii(6, 13 / 38), false, '#C7D62E'),
  numb: buildVisual([0.95, 1.0, 0.9, 1.0, 0.95, 1.0, 0.9, 1.0], true, '#C4867E'),

  // Cycle & hormones
  bloated: buildVisual([1, 1, 1.03, 1, 0.98, 1, 0.55, 1, 0.97, 1], true, '#F0A8C6'),
  tender: buildVisual([0.8, 1, 0.6, 0.95, 0.7, 1.05, 0.65, 0.9, 0.75], false, '#D6455C'),
  nauseous: buildVisual([1, 0.7, 1.1, 0.65, 1, 0.7, 1.1, 0.65], true, '#5A8FD6'),
  swollen: buildVisual([1, 1.05, 1, 0.5, 1, 1.05, 1, 1.05, 1, 1], true, '#EE97BE'),
  hot: buildVisual(
    Array.from({ length: 8 }, (_, i) => (i % 2 === 0 ? 1 : 0.8)),
    true,
    '#E2382A',
  ),

  // Energy & fuel
  heavy: buildVisual([0.75, 0.85, 1.05, 1.2, 1.3, 1.2, 1.05, 0.85], true, '#2A2A32'),
  dizzy: buildVisual([0.35, 0.5, 0.7, 0.9, 1.1, 1.3, 1.2, 0.95, 0.7, 0.5], true, '#C2E84D'),
  headachy: buildVisual([1.25, 0.9, 0.5, 0.9, 1.25, 0.9, 0.5, 0.9], true, '#D93A3A'),
  foggy: buildVisual(
    [1.0, 0.8, 1.05, 0.85, 0.95, 0.95, 0.95, 0.95, 0.95, 0.85, 1.05, 0.8],
    true,
    '#F4F2EC',
  ),
  shaky: buildVisual(
    [1, 0.55, 1.15, 0.6, 0.95, 0.5, 1.2, 0.65, 1.05, 0.55, 1.1, 0.6],
    false,
    '#5FB24B',
  ),
}

for (const card of WORD_CARDS) {
  if (!WORD_VISUALS[card.id]) throw new Error(`Missing word visual for "${card.id}"`)
}

/** calm=true: settled near a circle, just barely hinting at the word's real shape.
 * calm=false (hover/selected): the shape unfolds into its full, distinct form. */
export const wordPath = (id: string, calm: boolean): string =>
  calm ? WORD_VISUALS[id].calmPath : WORD_VISUALS[id].path
export const wordColor = (id: string): string => WORD_VISUALS[id].color

/** Words whose sensation is a rhythmic squeeze — tension building, holding, then
 * releasing — get a looping pulse instead of the default gentle drift. */
const PULSE_WORDS = new Set(['tight', 'crampy', 'gripping', 'bloated', 'swollen', 'headachy'])

export const motifFor = (id: string): 'pulse' | 'drift' => {
  return PULSE_WORDS.has(id) ? 'pulse' : 'drift'
}
