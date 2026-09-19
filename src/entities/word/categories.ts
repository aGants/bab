import type { CategoryId, CategoryStyle } from './types'

export const CATEGORY_STYLES: Record<CategoryId, CategoryStyle> = {
  muscle: { emoji: '💪', color: 'anchor' },
  pain: { emoji: '⚡', color: 'signals' },
  cycle: { emoji: '🌙', color: 'cycle' },
  energy: { emoji: '🔋', color: 'energy' },
}
