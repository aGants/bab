import { isHatId } from './hatCatalog'
import { createStoredChoice } from './storedChoice'

const hat = createStoredChoice('world-hat', isHatId)

/** The hat the user has saved on their character, or null. `saveHat` makes a
 * hat (or no hat) the one it wears; every place showing the character (the
 * header mascot, the World page, the summary) updates at once. */
export const useWornHat = () => ({ hatId: hat.useValue(), saveHat: hat.save })
