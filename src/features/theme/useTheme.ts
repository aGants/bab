import { useEffect, useState } from 'react'
import { applyTheme, getInitialTheme, type Theme } from './theme'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return { theme, setTheme }
}
