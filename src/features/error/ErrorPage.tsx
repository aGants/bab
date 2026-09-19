import { useEffect } from 'react'
import { useRouteError } from 'react-router-dom'
import { ERROR_SCREEN } from '@/i18n'
import { ROUTES } from '@/routes/paths'
import { PageFrame } from '@/shared/layout'
import { Button } from '@/shared/ui'
import './ErrorPage.css'

/** Route-level error screen. The button does a full page load rather than a client-side
 * navigation: the app state may be broken, and after a deploy a reload also picks up fresh assets. */
export const ErrorPage = () => {
  const error = useRouteError()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <PageFrame>
      <div className="error-page">
        <h1 className="text-display error-page-title">{ERROR_SCREEN.title}</h1>
        <p className="error-page-message">{ERROR_SCREEN.message}</p>
        <Button onClick={() => window.location.assign(ROUTES.checkIn)}>{ERROR_SCREEN.action}</Button>
      </div>
    </PageFrame>
  )
}
