import { CATEGORIES, type CategoryId } from '../bodyWordsData'

/** Category's token color, darkened a touch per intensity level so sharper/heavier
 * words read as slightly deeper shades of the same design-token color. */
export const categoryColor = (categoryId: CategoryId, intensity: number): string => {
  const { color } = CATEGORIES[categoryId]
  const shade = 100 - intensity * 12
  return `color-mix(in srgb, var(--color-${color}) ${shade}%, black)`
}
