export const MIN_INTENSITY = 1
export const MAX_INTENSITY = 10

/** Maps intensity (1..10) to a visual size multiplier for the shape — tiny at 1,
 * filling its stage at 10 (just grazing the top and bottom edges), so "how big
 * is it" reads literally without the shape spilling over the heading or slider. */
export const scaleForIntensity = (intensity: number): number => {
  const t = (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)
  return 0.35 + t * 1.55
}
