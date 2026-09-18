/** Design tokens, mirrored from tokens.css for use in JS/TS (inline styles, canvas, SVG fills, etc). */

export const COLORS = {
  anchor: '#114F4F',
  energy: '#BCE739',
  signals: '#E8836A',
  cycle: '#EDE6FE',
  ground: '#FDFCF9',
} as const

export type ColorToken = keyof typeof COLORS

export const FONTS = {
  display: "'Plus Jakarta Sans', system-ui, sans-serif",
  body: "'DM Sans', system-ui, sans-serif",
} as const

export const TYPE = {
  display: {
    fontFamily: FONTS.display,
    fontWeight: 800,
    fontStyle: 'italic',
    letterSpacing: '-0.05em',
    skew: '-4deg',
  },
  body: {
    fontFamily: FONTS.body,
    fontSize: '16px',
    lineHeight: 1.5,
  },
} as const
