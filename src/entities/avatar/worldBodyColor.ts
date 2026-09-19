import { BODY_COLOR_IDS, type BodyColorId } from './types'
import { createStoredChoice } from './storedChoice'

/** What the World character's body is drawn in until the user picks another colour. */
export const DEFAULT_WORLD_BODY_COLOR_ID: BodyColorId = 'pink'

/** Tones for the World character's body. Its hands are drawn in black on the
 * body, so every tone stays light enough for them to read. */
export const WORLD_BODY_COLORS: Record<BodyColorId, string> = {
  red: '#FF383C',
  coral: '#F87C64',
  lime: '#B7EA15',
  teal: '#3DBFAE',
  pink: '#FEA7A9',
  lavender: '#C9B8F7',
}

const isBodyColorId = (value: unknown): value is BodyColorId =>
  typeof value === 'string' && (BODY_COLOR_IDS as readonly string[]).includes(value)

const bodyColor = createStoredChoice('world-body-color', isBodyColorId)

/** The colour the user has saved for their character's body — pink until they
 * pick another. `saveBodyColor` makes a colour the one it wears; every place
 * showing the character (the World page, the summary) updates at once. */
export const useWornBodyColor = () => ({
  bodyColorId: bodyColor.useValue() ?? DEFAULT_WORLD_BODY_COLOR_ID,
  saveBodyColor: bodyColor.save,
})
