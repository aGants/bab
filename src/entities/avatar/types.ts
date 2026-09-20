export const BODY_COLOR_IDS = ['coral', 'teal', 'lime', 'pink', 'lavender', 'red'] as const
export type BodyColorId = (typeof BODY_COLOR_IDS)[number]
