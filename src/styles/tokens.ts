/** Design tokens, mirrored from tokens.css for use in JS/TS (inline styles, canvas, SVG fills, etc). */

export const COLORS = {
  anchor: '#0A7B6B',
  energy: '#C2E84D',
  signals: '#E8836A',
  cycle: '#D8D0F0',
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
