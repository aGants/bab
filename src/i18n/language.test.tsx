import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { CalendarPage } from '@/features/calendar/CalendarPage'
import { TabBar } from '@/shared/ui/TabBar/TabBar'
import { act, render, screen } from '@/test/render'
import { useContent } from './useContent'
import { activateLocale, setLocale } from './runtime'

const Probe = () => {
  const { wordCards, vasScale, bodyZoneLabel } = useContent()
  return (
    <ul>
      <li data-testid="word">{wordCards[0].word}</li>
      <li data-testid="vas">{vasScale[0].label}</li>
      <li data-testid="zone">{bodyZoneLabel('kneeLeft')}</li>
    </ul>
  )
}

const switchTo = (locale: 'en' | 'it') => act(() => setLocale(locale))

describe('changing the language', () => {
  afterEach(() => act(() => activateLocale('en')))

  it('re-renders translated UI strings', async () => {
    render(
      <MemoryRouter>
        <TabBar />
      </MemoryRouter>,
    )
    expect(screen.getByRole('navigation', { name: 'Primary' }).textContent).toBe('HomeJournalWorldSettings')

    await switchTo('it')

    expect(screen.getByRole('navigation', { name: 'Principale' }).textContent).toBe('HomeDiarioMondoImpostazioni')
  })

  it('serves domain content in the active language', async () => {
    render(<Probe />)
    expect(screen.getByTestId('word').textContent).toBe('strong')
    expect(screen.getByTestId('vas').textContent).toBe('Nothing at all')
    expect(screen.getByTestId('zone').textContent).toBe('your left knee')

    await switchTo('it')

    expect(screen.getByTestId('word').textContent).toBe('forte')
    expect(screen.getByTestId('vas').textContent).toBe('Per niente')
    expect(screen.getByTestId('zone').textContent).toBe('ginocchio sinistro')
  })

  it('names the calendar month and weekdays in that language', async () => {
    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    )
    await switchTo('it')

    const month = new Intl.DateTimeFormat('it', { month: 'long', year: 'numeric' }).format(new Date())
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(month)
    // the weekday row is decorative (aria-hidden), so it is found by its text rather than its role
    expect(screen.getByText('lun', { selector: 'th' })).toBeTruthy()
  })

  it('marks the page with the active language for screen readers', async () => {
    await switchTo('it')
    expect(document.documentElement.lang).toBe('it')
  })
})
