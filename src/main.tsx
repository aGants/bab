import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { i18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { RouterProvider } from 'react-router-dom'
import './styles/tokens.css'
import './index.css'
import { router } from './router.tsx'
import { DEFAULT_LOCALE } from './i18n'
import { activateLocale, getInitialLocale } from './i18n/runtime'
import { applyTheme, getInitialTheme } from './features/theme/theme'
import { registerServiceWorker } from './features/pwa/registerServiceWorker'
import { listenForInstallPrompt } from './features/pwa/installPrompt'

applyTheme(getInitialTheme())
registerServiceWorker()
listenForInstallPrompt()

// The catalog has to be loaded before the first render, or the UI would flash untranslated.
// If the chosen language's catalog can't be fetched (offline), open in the default one instead.
activateLocale(getInitialLocale())
  .catch(() => activateLocale(DEFAULT_LOCALE))
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <I18nProvider i18n={i18n}>
          <RouterProvider router={router} />
        </I18nProvider>
      </StrictMode>,
    )
  })
