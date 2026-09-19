export const MIN_INTENSITY = 1
export const MAX_INTENSITY = 10

/** Maps intensity (1..10) to a visual size multiplier for the shape — tiny at 1,
 * dramatically larger at 10, so "how big is it" reads literally and viscerally.
 * Shared by the intensity step and the summary so both render the word shape at
 * the size the user actually picked, instead of each re-deriving its own scale. */
export const scaleForIntensity = (intensity: number): number => {
  const t = (intensity - MIN_INTENSITY) / (MAX_INTENSITY - MIN_INTENSITY)
  return 0.35 + t * 1.85
}
