import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'

const BodyWordCards = lazy(() => import('./features/word-field/BodyWordCards'))
const CheckIn = lazy(() => import('./features/check-in/CheckIn').then((m) => ({ default: m.CheckIn })))
const CheckInFlowPage = lazy(() =>
  import('./features/check-in-flow/CheckInFlowPage').then((m) => ({ default: m.CheckInFlowPage })),
)
const CalendarPage = lazy(() =>
  import('./features/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })),
)
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

// Keeps the shared page shell in place while a route's chunk loads, instead
// of flashing to a blank screen between routes.
const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageFrame>{null}</PageFrame>}>{element}</Suspense>
)

export const router = createBrowserRouter([
  { path: ROUTES.checkIn, element: withSuspense(<CheckIn />) },
  { path: ROUTES.words, element: withSuspense(<BodyWordCards />) },
  { path: ROUTES.checkInFlow, element: withSuspense(<CheckInFlowPage />) },
  { path: ROUTES.calendar, element: withSuspense(<CalendarPage />) },
  { path: ROUTES.settings, element: withSuspense(<SettingsPage />) },
])
