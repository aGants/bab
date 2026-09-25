import { describe, expect, it, afterEach } from 'vitest'
import { act, render } from '@/test/render'
import { LOCALES, type Locale } from './locales'
import { bodyZoneLabelFor, bodyZoneShortLabelFor, categoriesFor, errorScreenFor, vasScaleFor, wordCardsFor } from './content'
import { DATE_FNS_LOCALES } from './dateLocale'
import { activateLocale, setLocale } from './runtime'
import { useContent } from './useContent'

type Content = ReturnType<typeof useContent>

/** Hands the hook's result to the test, so it can be compared across renders and components. */
const Capture = ({ into }: { into: Content[] }) => {
  into.push(useContent())
  return null
}

describe('useContent', () => {
  afterEach(() => act(() => activateLocale('en')))

  it.each(Object.keys(LOCALES) as Locale[])('serves the "%s" catalogs', async (locale) => {
    await act(() => setLocale(locale))
    const seen: Content[] = []
    render(<Capture into={seen} />)
    const content = seen.at(-1)!

    expect(content.locale).toBe(locale)
    expect(content.dateLocale).toBe(DATE_FNS_LOCALES[locale])
    expect(content.wordCards).toEqual(wordCardsFor(locale))
    expect(content.categories).toEqual(categoriesFor(locale))
    expect(content.vasScale).toEqual(vasScaleFor(locale))
    expect(content.errorScreen).toEqual(errorScreenFor(locale))
    expect(content.bodyZoneLabel('kneeLeft')).toBe(bodyZoneLabelFor(locale, 'kneeLeft'))
    expect(content.bodyZoneShortLabel('kneeLeft')).toBe(bodyZoneShortLabelFor(locale, 'kneeLeft'))
  })

  it('builds the content once per language, however many components ask for it', () => {
    const seen: Content[] = []
    render(
      <>
        <Capture into={seen} />
        <Capture into={seen} />
      </>,
    )

    expect(seen).toHaveLength(2)
    expect(seen[1]).toBe(seen[0])
    expect(seen[1].wordCards).toBe(seen[0].wordCards)
  })

  it('keeps the same content across re-renders', () => {
    const seen: Content[] = []
    const { rerender } = render(<Capture into={seen} />)
    rerender(<Capture into={seen} />)

    expect(seen.at(-1)).toBe(seen[0])
  })

  it('switches to the other language\'s content and back to the same objects', async () => {
    const seen: Content[] = []
    render(<Capture into={seen} />)
    const english = seen.at(-1)!

    await act(() => setLocale('it'))
    const italian = seen.at(-1)!
    expect(italian).not.toBe(english)
    expect(italian.locale).toBe('it')

    await act(() => setLocale('en'))
    expect(seen.at(-1)).toBe(english)
  })
})
