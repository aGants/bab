import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/tokens.css'
import './index.css'
import { router } from './router.tsx'
import ThemeToggle from './features/theme/ThemeToggle'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeToggle />
    <RouterProvider router={router} />
  </StrictMode>,
)
