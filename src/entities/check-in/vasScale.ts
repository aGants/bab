import type { CheckInIntensity } from './types'

/** These words describe how ready/light the body feels, not pain — the intensity
 * slider still applies (how strong/light), but the pain scale itself doesn't,
 * so they always score 0 ("nothing at all, pain-free") regardless of the value
 * picked. The level's wording lives in src/i18n. */
const NON_PAIN_WORD_IDS = new Set(['strong', 'light'])

export const vasScoreFor = (wordId: string, intensity: CheckInIntensity): CheckInIntensity =>
  NON_PAIN_WORD_IDS.has(wordId) ? 0 : intensity
