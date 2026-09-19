/* oxlint-disable react/only-export-components -- test helper, never hot-reloaded */
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

const Providers = ({ children }: { children: ReactNode }) => (
  <I18nProvider i18n={i18n}>{children}</I18nProvider>
)

/** Drop-in for RTL's `render` that supplies the i18n context every translated component needs. */
const renderWithProviders = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: Providers, ...options })

export * from '@testing-library/react'
export { renderWithProviders as render }
