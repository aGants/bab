export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

export const getInitialTheme = (): Theme => {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Flips `data-theme` on <html>, which tokens.css reads to swap the neutral
 * black/white roles (--color-ink, --color-surface, ...) while leaving the
 * brand palette (anchor/energy/signals/cycle/ground) untouched. */
export const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme
  window.localStorage.setItem(STORAGE_KEY, theme)
}
