import { createBrowserRouter } from 'react-router-dom'
import BodyWordCards from './features/word-field/BodyWordCards'
import { CheckIn } from './features/check-in/CheckIn'
import { CheckInFlowPage } from './features/check-in-flow/CheckInFlowPage'
import { ROUTES } from '@/routes/paths'

export const router = createBrowserRouter([
  { path: ROUTES.checkIn, element: <CheckIn /> },
  { path: ROUTES.words, element: <BodyWordCards /> },
  { path: ROUTES.checkInFlow, element: <CheckInFlowPage /> },
])
