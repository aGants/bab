import type { CheckInIntensity } from './types'

/** These words describe how ready/light the body feels, not pain — the intensity
 * slider still applies (how strong/light), but the pain scale itself doesn't,
 * so they always score 0 ("nothing at all, pain-free") regardless of the value
 * picked. The level's wording lives in src/i18n. */
const NON_PAIN_WORD_IDS = new Set(['strong', 'light'])

/** Whether the pain (VAS) scale is meaningful for this word — false for the
 * non-pain words, where the scale explainer would only confuse. */
export const usesPainScale = (wordId: string): boolean => !NON_PAIN_WORD_IDS.has(wordId)

export const vasScoreFor = (wordId: string, intensity: CheckInIntensity): CheckInIntensity =>
  usesPainScale(wordId) ? intensity : 0
