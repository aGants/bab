import { createBrowserRouter } from 'react-router-dom'
import BodyWordCards from './features/word-field/BodyWordCards'
import { CheckIn } from './features/check-in/CheckIn'
import { CheckInFlowPage } from './features/check-in-flow/CheckInFlowPage'
import { CalendarPage } from './features/calendar/CalendarPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { ROUTES } from '@/routes/paths'

export const router = createBrowserRouter([
  { path: ROUTES.checkIn, element: <CheckIn /> },
  { path: ROUTES.words, element: <BodyWordCards /> },
  { path: ROUTES.checkInFlow, element: <CheckInFlowPage /> },
  { path: ROUTES.calendar, element: <CalendarPage /> },
  { path: ROUTES.settings, element: <SettingsPage /> },
])
