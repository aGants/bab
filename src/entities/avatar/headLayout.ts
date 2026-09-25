import { wordPath } from '@/entities/word'

// A feeling's shape stands in for the cloud on the same canvas. Word shapes are
// drawn in a 100×100 box but fill it very unevenly (a bolt is narrow, a puddle
// low), so each is fitted by its own bounds: its longer side matches the
// cloud's height, it's centred over the cloud and rests on the body like the
// cloud does. The face was drawn for the 200-wide cloud, so it shrinks with the
// shape's width and sits on its centre.
const HEAD_FIT = 125
const HEAD_CENTER_X = 100
const HEAD_BASE_Y = 122
const FACE_CENTER = { x: 98, y: 82 } as const
const FACE_WIDTH = 76
const FACE_SHARE = 0.55
// the hat is as wide as this share of the shape and rests this far below its top
const HAT_SHARE = 0.65
const HAT_SINK = 0.14

const pathBounds = (path: string) => {
  const numbers = path.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? []
  const xs = numbers.filter((_, i) => i % 2 === 0)
  const ys = numbers.filter((_, i) => i % 2 === 1)
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) }
}

const computeWordHeadLayout = (wordId: string) => {
  const path = wordPath(wordId, false)
  const { minX, maxX, minY, maxY } = pathBounds(path)
  const scale = HEAD_FIT / Math.max(maxX - minX, maxY - minY)
  const width = (maxX - minX) * scale
  const height = (maxY - minY) * scale
  const x = HEAD_CENTER_X - ((minX + maxX) / 2) * scale
  const y = HEAD_BASE_Y - maxY * scale
  const faceScale = (FACE_SHARE * width) / FACE_WIDTH
  return {
    path,
    headTransform: `translate(${x} ${y}) scale(${scale})`,
    faceTransform: `translate(${HEAD_CENTER_X - FACE_CENTER.x * faceScale} ${y + ((minY + maxY) / 2) * scale - FACE_CENTER.y * faceScale}) scale(${faceScale})`,
    hat: { x: HEAD_CENTER_X, restY: HEAD_BASE_Y - height + height * HAT_SINK, width: width * HAT_SHARE },
  }
}

const layoutByWord = new Map<string, ReturnType<typeof computeWordHeadLayout>>()

/** Where a feeling's shape, its face and a hat on it go on the character's canvas. It depends only on
 * the word, and finding it means parsing the whole outline, so each word is worked out once. */
export const wordHeadLayout = (wordId: string) => {
  let layout = layoutByWord.get(wordId)
  if (!layout) {
    layout = computeWordHeadLayout(wordId)
    layoutByWord.set(wordId, layout)
  }
  return layout
}
