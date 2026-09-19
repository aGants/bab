import { lazy, Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import { ErrorPage } from './features/error/ErrorPage'

const BodyWordCards = lazy(() => import('./features/word-field/BodyWordCards'))
const CheckIn = lazy(() => import('./features/check-in/CheckIn').then((m) => ({ default: m.CheckIn })))
const CheckInFlowPage = lazy(() =>
  import('./features/check-in-flow/CheckInFlowPage').then((m) => ({ default: m.CheckInFlowPage })),
)
const CalendarPage = lazy(() =>
  import('./features/calendar/CalendarPage').then((m) => ({ default: m.CalendarPage })),
)
const AvatarPage = lazy(() =>
  import('./features/avatar/AvatarPage').then((m) => ({ default: m.AvatarPage })),
)
const SettingsPage = lazy(() =>
  import('./features/settings/SettingsPage').then((m) => ({ default: m.SettingsPage })),
)

// Keeps the shared page shell in place while a route's chunk loads, instead
// of flashing to a blank screen between routes.
const withSuspense = (element: ReactNode) => (
  <Suspense fallback={<PageFrame>{null}</PageFrame>}>{element}</Suspense>
)

// Imported statically (not lazy): it must render even when a route chunk fails to load.
const errorElement = <ErrorPage />

export const router = createBrowserRouter([
  { path: ROUTES.checkIn, element: withSuspense(<CheckIn />), errorElement },
  { path: ROUTES.words, element: withSuspense(<BodyWordCards />), errorElement },
  { path: ROUTES.checkInFlow, element: withSuspense(<CheckInFlowPage />), errorElement },
  { path: ROUTES.calendar, element: withSuspense(<CalendarPage />), errorElement },
  { path: ROUTES.settings, element: withSuspense(<SettingsPage />), errorElement },
  { path: ROUTES.world, element: withSuspense(<AvatarPage />), errorElement },
])
