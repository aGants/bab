import { describe, expect, it } from 'vitest'
import indexHtml from '../../index.html?raw'
import fontsCss from './fonts.css?raw'
import tokensCss from './tokens.css?raw'

const fontFiles = import.meta.glob('./fonts/*.woff2', { query: '?url', import: 'default' })

const facesOf = (css: string) => [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => body)
const declared = (face: string, property: string) => face.match(new RegExp(`${property}:\\s*([^;]+);`))?.[1].trim()

describe('typefaces', () => {
  const faces = facesOf(fontsCss)

  it('are served from the app, not from a third-party font host', () => {
    expect(indexHtml).not.toMatch(/fonts\.(googleapis|gstatic)\.com/)
    expect(fontsCss).not.toMatch(/https?:\/\//)
  })

  it('declare a face for both families the design tokens ask for', () => {
    const wanted = [...tokensCss.matchAll(/--font-(?:display|body):\s*'([^']+)'/g)].map(([, family]) => family)
    expect(wanted).toEqual(['Bricolage Grotesque', 'Instrument Sans'])
    const declaredFamilies = new Set(faces.map((face) => declared(face, 'font-family')?.replace(/['"]/g, '')))
    for (const family of wanted) expect(declaredFamilies.has(family), family).toBe(true)
  })

  it('point at font files that exist', () => {
    const files = new Set(Object.keys(fontFiles))
    const used = [...fontsCss.matchAll(/url\('([^']+\.woff2)'\)/g)].map(([, path]) => path)
    expect(used.length).toBe(faces.length)
    for (const path of used) expect(files.has(path), path).toBe(true)
    expect(files.size, 'a font file nothing uses').toBe(new Set(used).size)
  })

  it('swap in when loaded rather than hiding text, and only load for the characters they cover', () => {
    for (const face of faces) {
      expect(declared(face, 'font-display')).toBe('swap')
      expect(declared(face, 'unicode-range')).toBeTruthy()
    }
  })

  it('cover a weight range, since each file is a variable font', () => {
    for (const face of faces) expect(declared(face, 'font-weight')).toMatch(/^\d{3} \d{3}$/)
  })
})
