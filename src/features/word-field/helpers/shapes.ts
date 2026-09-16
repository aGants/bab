import * as blobs2 from 'blobs/v2'
import type { CategoryId } from '../bodyWordsData'

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

// Every generator below keeps its point/command count FIXED between the calm and
// full variant of a shape — only how far each point strays from a circle changes.
// That means the two `d` strings share the same path structure, so the browser can
// smoothly animate `d` between them (a real shape morph, not a crossfade).

/** Soft organic blob (muscle signals). expressive=false settles close to a circle;
 * expressive=true lets the word's own intensity roughen it. */
export const muscleBlob = (id: string, intensity: number, expressive: boolean): string => {
  return blobs2.svgPath({
    seed: id,
    extraPoints: 5 + intensity,
    randomness: expressive ? 2 + intensity * 2 : 0.8,
    size: 100,
  })
}

/** Hand-rolled jagged burst (pain types) — real geometry, not just an organic blob,
 * because smooth curves can't read as "sharp". Calm keeps the same spike count but
 * pulls the inner radius up near the outer one, so it reads as a barely-scalloped
 * circle until it's expanded into a full star. */
export const painBurst = (id: string, intensity: number, expressive: boolean): string => {
  const rand = mulberry32(hashSeed(id))
  const points = 9 + intensity * 4
  const cx = 50
  const cy = 50
  // kept under 50 even at max jitter (1.35x) so spikes reach the cell edge without crossing it
  const outerBase = 37
  const innerBase = expressive ? 18 + (2 - intensity) * 5 : outerBase * 0.95
  const jitterRange = expressive ? 0.35 : 0.04
  const coords: [number, number][] = []
  for (let i = 0; i < points * 2; i++) {
    const isOuter = i % 2 === 0
    const angle = (Math.PI * i) / points
    const jitter = (rand() - 0.5) * jitterRange
    const radius = (isOuter ? outerBase : innerBase) * (1 + jitter)
    coords.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius])
  }
  const [first, ...rest] = coords
  return `M ${first[0]} ${first[1]} ` + rest.map(([x, y]) => `L ${x} ${y}`).join(' ') + ' Z'
}

/** Two nested blobs (cycle & hormones) — a shape actually swelling/pressing from within. */
export const cycleLayers = (
  id: string,
  intensity: number,
  expressive: boolean,
): { outer: string; inner: string } => {
  const outer = blobs2.svgPath({
    seed: `${id}-outer`,
    extraPoints: 6,
    randomness: expressive ? 3 : 0.8,
    size: 100,
  })
  const inner = blobs2.svgPath({
    seed: `${id}-inner`,
    extraPoints: 5,
    randomness: expressive ? 2 : 0.6,
    // more intense = the inner pressure fills more of the outer shape once expanded
    size: expressive ? 60 + intensity * 6 : 45,
  })
  return { outer, inner }
}

/** Base blob for energy & fuel words — gets distorted with an SVG filter (see EnergyFilterDefs). */
export const energyBlob = (id: string, intensity: number, expressive: boolean): string => {
  return blobs2.svgPath({
    seed: id,
    extraPoints: 6,
    randomness: expressive ? 2 + intensity : 0.8,
    size: 100,
  })
}

export interface ShapeResult {
  kind: 'blob' | 'burst' | 'layers' | 'filtered'
  path: string
  inner?: string
}

export const shapeFor = (
  category: CategoryId,
  id: string,
  intensity: number,
  expressive: boolean,
): ShapeResult => {
  switch (category) {
    case 'muscle':
      return { kind: 'blob', path: muscleBlob(id, intensity, expressive) }
    case 'pain':
      return { kind: 'burst', path: painBurst(id, intensity, expressive) }
    case 'cycle': {
      const { outer, inner } = cycleLayers(id, intensity, expressive)
      return { kind: 'layers', path: outer, inner }
    }
    case 'energy':
      return { kind: 'filtered', path: energyBlob(id, intensity, expressive) }
  }
}

/** Words whose sensation is a rhythmic squeeze — tension building, holding, then
 * releasing — get a looping pulse instead of the default gentle drift. */
const PULSE_WORDS = new Set(['tight', 'crampy', 'gripping', 'bloated', 'swollen', 'headachy'])

export const motifFor = (id: string): 'pulse' | 'drift' => {
  return PULSE_WORDS.has(id) ? 'pulse' : 'drift'
}
