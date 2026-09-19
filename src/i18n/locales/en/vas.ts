import type { CheckInIntensity } from '@/entities/check-in/types'
import type { VasLevel } from '../../types'

/** Plain-language VAS (visual analogue scale) descriptions, adapted for teenage
 * athletes — one per intensity level, shown on the check-in summary so "how big
 * is it" translates into something concrete instead of just a number. */
export const vas: Record<CheckInIntensity, VasLevel> = {
  0: {
    label: 'Nothing at all',
    description: 'Your body feels comfortable and pain-free.',
  },
  1: {
    label: 'Barely there',
    description:
      "You can feel something if you focus on it, but it's so faint you could easily forget about it.",
  },
  2: {
    label: 'Mild',
    description:
      "You notice it now and then. It doesn't change what you're doing or how you move.",
  },
  3: {
    label: 'Mild+',
    description:
      "It's there. You're aware of it, but it's not stopping you from doing anything. Manageable.",
  },
  4: {
    label: 'Moderate',
    description:
      "It's getting your attention. You find yourself adjusting how you move or thinking about it during rest periods.",
  },
  5: {
    label: 'Moderate+',
    description:
      "It's hard to ignore. You can still train but you find yourself compensating: changing technique, favouring one side, or avoiding certain movements.",
  },
  6: {
    label: 'Moderate-high',
    description:
      "It's affecting what you can do. You're slowing down, holding back, or cutting exercises short because of it.",
  },
  7: {
    label: 'Severe',
    description:
      "It's dominating your attention. It hinders you from performing normally and makes you stop or significantly modify what you're doing.",
  },
  8: {
    label: 'Very severe',
    description:
      "Difficult to do much of anything. It's hard to concentrate on anything else. Your body is sending a very loud signal to get your attention.",
  },
  9: {
    label: 'Intense',
    description: 'Almost unbearable. Your body is asking for attention and support.',
  },
  10: {
    label: 'Worst possible',
    description: 'The worst pain you can imagine. Your body is asking for immediate support and attention.',
  },
}
