import { WORDS } from './words'

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

/** Point count for shapes drawn from geometry below — dense enough that sharp
 * corners and small notches survive the resample into a radial profile. */
const TRACE_SAMPLES = 256

/** Turns an inside-test into a radial profile by marching out from (cx, cy) along
 * each ray until it leaves the shape, so a word can be drawn from plain geometry
 * (polygons, circles, capsules) instead of a hand-typed table of radii. Rays start
 * at the top and go clockwise, matching `radialPath`. */
const traceOutline = (
  inside: (x: number, y: number) => boolean,
  cx: number,
  cy: number,
  maxRadius: number,
): number[] =>
  Array.from({ length: TRACE_SAMPLES }, (_, i) => {
    const angle = (i * 2 * Math.PI) / TRACE_SAMPLES - Math.PI / 2
    const dx = Math.cos(angle)
    const dy = Math.sin(angle)
    let lo = 0
    let hi = 0.5
    while (hi < maxRadius && inside(cx + dx * hi, cy + dy * hi)) {
      lo = hi
      hi += 0.5
    }
    for (let k = 0; k < 10; k++) {
      const mid = (lo + hi) / 2
      if (inside(cx + dx * mid, cy + dy * mid)) lo = mid
      else hi = mid
    }
    return lo
  })

type Circle = readonly [x: number, y: number, r: number]
type Capsule = readonly [ax: number, ay: number, bx: number, by: number, r: number]

const inCircles =
  (circles: Circle[]) =>
  (x: number, y: number): boolean =>
    circles.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r)

const inCapsules =
  (capsules: Capsule[]) =>
  (x: number, y: number): boolean =>
    capsules.some(([ax, ay, bx, by, r]) => {
      const abx = bx - ax
      const aby = by - ay
      const t = Math.max(0, Math.min(1, ((x - ax) * abx + (y - ay) * aby) / (abx * abx + aby * aby)))
      return (x - (ax + t * abx)) ** 2 + (y - (ay + t * aby)) ** 2 <= r * r
    })

const inPolygon =
  (poly: [number, number][]) =>
  (x: number, y: number): boolean => {
    let inside = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i]
      const [xj, yj] = poly[j]
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
    return inside
  }

// Shapes below are measured off the reference artwork (pixel units, centred on the
// shape's own bounding box) — only their proportions matter, `buildVisual` rescales.

/** Two triangles meeting at a narrow waist. */
const HOURGLASS = traceOutline(
  inPolygon([
    [-87, -63],
    [87, -63],
    [26, 0],
    [87, 63],
    [-87, 63],
    [-26, 0],
  ]),
  0,
  0,
  120,
)

/** A lumpy cloud: four bumps on top, a heavy lobe bottom-left tapering off to the right. */
const CLOUD = traceOutline(
  inCircles([
    [-46, -37, 26],
    [4, -40, 24],
    [41, -39, 22],
    [65, -26, 22],
    [-66, -8, 22],
    [-68, 24, 20],
    [-42, 38, 26],
    [-10, 22, 32],
    [24, 0, 38],
    [58, -6, 22],
    [-24, -10, 38],
    [22, -22, 32],
    [-38, 12, 34],
  ]),
  0,
  0,
  120,
)

/** A cluster of overlapping circles. */
const SHAKY_CLUSTER = traceOutline(
  inCircles([
    [-6, -48, 26],
    [-57, -23, 27],
    [-30, -30, 24],
    [-59, 9, 27],
    [-26, 40, 32],
    [16, 49, 26],
    [26, 4, 26],
    [62, 30, 26],
    [-7, 7, 35],
    [10, -25, 30],
    [30, 34, 30],
    [-20, -12, 34],
  ]),
  0,
  0,
  120,
)

/** A rectangle whose short sides are scooped inward by big circular arcs. */
const TIGHT_BAND = traceOutline(
  (x, y) =>
    Math.abs(x) <= 126 &&
    Math.abs(y) <= 92 &&
    (x - 197.5) ** 2 + y * y >= 116.5 ** 2 &&
    (x + 197.5) ** 2 + y * y >= 116.5 ** 2,
  0,
  0,
  170,
)

/** A circle with a fine, even ripple all the way round. */
const ACHY_RIPPLE = Array.from(
  { length: TRACE_SAMPLES },
  (_, i) => 1 + 0.04 * Math.cos((i * 2 * Math.PI * 22) / TRACE_SAMPLES),
)

/** A 16-point star with straight-edged points, all the same length. */
const TINGLING_STAR = (() => {
  const points = 16
  const valley = 0.52
  const halfStep = Math.PI / points
  // edge from a tip (1, 0) to the next valley, intersected with each ray in between
  const [dx, dy] = [valley * Math.cos(halfStep) - 1, valley * Math.sin(halfStep)]
  return Array.from({ length: TRACE_SAMPLES }, (_, i) => {
    const perPoint = TRACE_SAMPLES / points
    const k = i % perPoint
    const phi = ((k <= perPoint / 2 ? k : perPoint - k) / perPoint) * 2 * Math.PI / points
    // ray at angle phi from the tip: t = cross(P0, d) / cross(u, d), with P0 = (1, 0)
    return dy / (Math.cos(phi) * dy - Math.sin(phi) * dx)
  })
})()

/** Four tilted pills stacked in a tapering pile, ending in a round drop. */
const DIZZY_STACK = traceOutline(
  (x, y) =>
    inCapsules([
      [-123, -56, 118, -86, 34],
      [-75, -4, 91, -24, 33],
      [-29, 46, 35, 38, 33],
    ])(x, y) || inCircles([[57, 86, 39]])(x, y),
  0,
  0,
  200,
)

/** One silhouette + color per word card, extracted directly from the BAB
 * word-card reference deck's source SVG (each word's fill color and outline
 * ray-cast from its own centroid into an evenly-spaced radius profile). */
const WORD_VISUALS: Record<string, { path: string; calmPath: string; color: string }> = {
  // Muscle signals
  strong: buildVisual(
    [50.0, 50.98, 54.12, 60.134, 64.912, 60.134, 54.12, 50.98, 50.0, 50.98, 54.12, 60.134, 64.912, 60.134, 54.12, 50.98, 50.0, 50.98, 54.12, 60.134, 64.912, 60.134, 54.12, 50.98, 50.0, 50.98, 54.12, 60.134, 64.912, 60.134, 54.12, 50.98],
    false,
    '#B7EA15',
  ),
  light: buildVisual(
    [31.888, 33.761, 37.877, 46.728, 69.106, 60.773, 54.097, 48.793, 44.557, 41.08, 38.425, 36.42, 35.142, 34.548, 34.613, 35.424, 37.11, 39.877, 44.079, 50.27, 59.336, 58.24, 53.435, 49.841, 47.027, 44.52, 42.091, 39.444, 36.799, 34.455, 32.56, 31.566],
    true,
    '#FEA7A9',
  ),
  sore: buildVisual(
    [52.427, 49.932, 41.522, 37.088, 42.522, 37.773, 40.934, 50.223, 53.202, 51.0, 42.762, 38.556, 35.288, 32.085, 42.309, 51.236, 53.853, 51.137, 42.074, 40.112, 39.077, 32.435, 42.66, 50.832, 53.019, 50.06, 40.833, 39.483, 41.973, 31.266, 41.288, 49.835],
    true,
    '#005050',
  ),
  achy: buildVisual(ACHY_RIPPLE, true, '#B7EA15'),
  tight: buildVisual(TIGHT_BAND, false, '#005050'),
  stiff: buildVisual(
    [13.538, 39.212, 50.754, 57.038, 59.548, 58.486, 54.12, 50.98, 50.0, 50.98, 54.12, 58.486, 59.548, 57.038, 50.754, 39.212, 13.538, 39.212, 50.754, 57.038, 59.548, 58.486, 54.12, 50.98, 50.0, 50.98, 54.12, 58.486, 59.548, 57.038, 50.754, 39.212],
    true,
    '#F87C64',
  ),
  unstable: buildVisual(
    [33.714, 36.31, 41.048, 49.391, 58.461, 49.388, 41.046, 36.308, 33.713, 32.634, 32.845, 34.389, 37.602, 43.312, 53.492, 57.439, 46.055, 39.166, 35.248, 33.203, 32.565, 33.202, 35.247, 39.164, 46.051, 57.437, 53.493, 43.313, 37.603, 34.39, 32.846, 32.635],
    true,
    '#EEE6FF',
  ),

  // Pain types
  crampy: buildVisual(
    [39.741, 40.52, 43.015, 47.796, 56.202, 39.529, 38.435, 42.373, 49.323, 42.791, 38.814, 38.312, 55.454, 47.343, 42.734, 40.357, 39.674, 40.547, 43.154, 48.095, 56.778, 37.848, 38.787, 42.762, 49.29, 42.344, 38.408, 39.419, 56.202, 47.796, 43.015, 40.52],
    false,
    '#FE2A3B',
  ),
  gripping: buildVisual(
    [34.17, 33.225, 32.075, 30.763, 29.389, 28.003, 26.646, 25.417, 29.104, 43.335, 52.751, 59.677, 48.947, 41.626, 37.462, 35.289, 34.162, 32.979, 31.723, 30.44, 29.211, 28.073, 27.041, 26.148, 28.499, 42.805, 53.018, 60.592, 48.634, 41.36, 37.223, 35.063],
    true,
    '#F87C64',
  ),
  sharp: buildVisual(
    [41.202, 42.009, 41.667, 36.197, 33.121, 31.648, 31.458, 32.512, 35.032, 39.627, 47.719, 35.294, 27.73, 28.835, 58.758, 47.211, 40.766, 37.124, 35.326, 34.976, 36.003, 38.622, 16.417, 16.965, 18.276, 20.668, 24.882, 32.837, 51.16, 49.553, 44.597, 42.009],
    false,
    '#FE2A3B',
  ),
  stabbing: buildVisual(
    [39.491, 43.203, 39.149, 37.094, 36.58, 37.501, 40.048, 44.815, 39.249, 29.582, 24.492, 21.604, 20.014, 19.334, 19.42, 20.29, 22.132, 25.417, 31.257, 42.711, 71.772, 43.959, 32.033, 25.982, 22.584, 20.675, 19.763, 19.652, 20.319, 21.903, 24.789, 29.874],
    false,
    '#B7EA15',
  ),
  burning: buildVisual(
    [30.268, 36.822, 49.421, 77.34, 44.536, 32.139, 57.441, 49.614, 43.801, 52.577, 49.248, 47.488, 46.967, 47.685, 49.46, 52.273, 55.837, 59.54, 62.565, 65.196, 66.751, 66.706, 64.964, 47.043, 44.761, 42.931, 41.826, 24.564, 23.6, 23.581, 24.502, 26.561],
    true,
    '#F87C64',
  ),
  tingling: buildVisual(TINGLING_STAR, false, '#B7EA15'),
  numb: buildVisual(
    [47.438, 48.001, 48.938, 49.438, 49.417, 49.71, 50.333, 49.864, 49.57, 49.658, 49.757, 49.851, 49.683, 47.88, 46.645, 48.271, 50.327, 50.423, 50.493, 50.34, 48.132, 47.007, 48.685, 50.403, 50.423, 49.812, 48.604, 49.935, 49.987, 49.869, 49.757, 48.579],
    true,
    '#005050',
  ),

  // Cycle & hormones
  bloated: buildVisual(
    [45.311, 41.059, 38.414, 41.486, 44.439, 47.062, 49.203, 50.722, 51.505, 51.533, 50.775, 49.29, 47.188, 44.58, 41.628, 38.577, 35.528, 40.636, 45.898, 49.834, 52.184, 52.848, 51.791, 49.042, 44.766, 39.223, 42.556, 46.437, 49.092, 50.327, 50.088, 48.38],
    true,
    '#FEA7A9',
  ),
  tender: buildVisual(
    [26.342, 27.645, 29.89, 33.28, 37.845, 43.441, 48.443, 49.765, 46.368, 40.794, 35.565, 31.534, 28.717, 26.906, 25.953, 25.776, 26.342, 27.645, 29.89, 33.28, 37.845, 43.441, 48.443, 49.765, 46.368, 40.794, 35.565, 31.534, 28.717, 26.906, 25.953, 25.776],
    true,
    '#F87C64',
  ),
  nauseous: buildVisual(
    [25.257, 20.249, 21.112, 29.197, 39.8, 51.605, 53.105, 47.084, 43.8, 42.471, 42.817, 44.909, 49.203, 55.972, 46.484, 35.12, 25.256, 20.25, 21.112, 29.197, 39.8, 51.605, 53.105, 47.083, 43.8, 42.471, 42.817, 44.909, 49.203, 55.972, 46.483, 35.12],
    true,
    '#005050',
  ),
  swollen: buildVisual(
    [16.679, 14.674, 13.754, 13.591, 14.144, 15.595, 18.564, 25.336, 52.287, 59.246, 53.24, 46.494, 41.167, 37.113, 34.165, 32.066, 30.688, 29.896, 29.589, 29.675, 30.057, 30.773, 31.928, 33.631, 36.074, 39.45, 44.006, 49.996, 57.464, 56.975, 32.241, 20.819],
    true,
    '#FEA7A9',
  ),
  hot: buildVisual(
    [50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893, 50.0, 49.893],
    true,
    '#FE2A3B',
  ),

  // Energy & fuel
  heavy: buildVisual(
    [34.184, 34.854, 37.001, 40.848, 40.687, 39.167, 39.208, 40.82, 44.347, 50.249, 53.083, 49.883, 39.337, 33.454, 30.107, 28.361, 27.816, 28.361, 30.107, 33.454, 39.337, 49.883, 53.083, 50.249, 44.347, 40.82, 39.208, 39.167, 40.687, 40.848, 37.001, 34.854],
    true,
    '#005050',
  ),
  dizzy: buildVisual(DIZZY_STACK, true, '#B7EA15'),
  headachy: buildVisual(HOURGLASS, false, '#FE2A3B'),
  foggy: buildVisual(CLOUD, true, '#EEE6FF'),
  shaky: buildVisual(SHAKY_CLUSTER, true, '#B7EA15'),
}

for (const word of WORDS) {
  if (!WORD_VISUALS[word.id]) throw new Error(`Missing word visual for "${word.id}"`)
}

/** calm=true: settled near a circle, just barely hinting at the word's real shape.
 * calm=false (hover/selected): the shape unfolds into its full, distinct form. */
export const wordPath = (id: string, calm: boolean): string =>
  calm ? WORD_VISUALS[id].calmPath : WORD_VISUALS[id].path
export const wordColor = (id: string): string => WORD_VISUALS[id].color

const relativeLuminance = (hex: string): number => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Shape fills are the same in both themes, so the label sitting on top of one
 * can't follow the theme's ink colour — it picks whichever of white / near-black
 * contrasts better with that specific fill. */
export const wordLabelColor = (id: string): string =>
  relativeLuminance(wordColor(id)) > 0.18 ? '#141413' : '#ffffff'

/** Fills so pale they nearly vanish against the light theme's page (the lavender of
 * foggy and unstable) — those get darkened, not brightened, when selected there. */
export const wordIsPale = (id: string): boolean => relativeLuminance(wordColor(id)) > 0.75

/** Brightness boost a selected shape is drawn with (see .is-selected in
 * BodyWordCards.css), so the label's colour maths matches what's on screen. */
const SELECTED_BRIGHTNESS = 1.18

const channelsOf = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))

/** For words with a dark label: the colour that, drawn with `mix-blend-mode:
 * difference`, comes out as the usual dark label colour over the shape
 * (|X - fill| = ink) yet stays X — a lighter shade of the fill itself — wherever
 * the label spills past the shape onto the dark page. Null for white labels, which
 * already read on both. Selected shapes are brightened, so they need their own X. */
export const wordLabelColorOffShape = (id: string, selected: boolean): string | null => {
  const ink = wordLabelColor(id)
  if (ink === '#ffffff') return null
  const inkChannels = channelsOf(ink)
  const boost = selected ? SELECTED_BRIGHTNESS : 1
  const shown = channelsOf(wordColor(id)).map((c) => Math.min(255, Math.round(c * boost)))
  const channels = shown.map((c, i) => Math.max(0, c - inkChannels[i]))
  return `rgb(${channels.join(' ')})`
}

/** Words whose sensation is a rhythmic squeeze — tension building, holding, then
 * releasing — get a looping pulse instead of the default gentle drift. */
const PULSE_WORDS = new Set(['tight', 'crampy', 'gripping', 'bloated', 'swollen', 'headachy'])

/** Words drawn as literal spiky stars — their points breathe in and out on a loop,
 * echoing the jab/prick/spark each word describes. */
const SPIKE_WORDS = new Set(['sharp', 'stabbing', 'tingling'])

/** Words describing an unsteady, trembling sensation — drift plays faster and a
 * touch wider so it reads as wobbly rather than calm. */
const JITTER_WORDS = new Set(['shaky', 'dizzy', 'unstable'])

/** Words describing something weightless — the shape keeps its calm drift and
 * also lifts a little, rising and settling back on a loop. */
const RISE_WORDS = new Set(['light'])

/** Words describing heat — the shape keeps its outline but throbs, rises like
 * warm air and glows on a loop, so it seems to burn. */
const HEAT_WORDS = new Set(['hot'])

export const motifFor = (id: string): 'pulse' | 'spike' | 'jitter' | 'rise' | 'heat' | 'drift' => {
  if (PULSE_WORDS.has(id)) return 'pulse'
  if (HEAT_WORDS.has(id)) return 'heat'
  if (SPIKE_WORDS.has(id)) return 'spike'
  if (JITTER_WORDS.has(id)) return 'jitter'
  if (RISE_WORDS.has(id)) return 'rise'
  return 'drift'
}
