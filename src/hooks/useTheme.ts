import { useState } from 'react'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Set the attribute synchronously so the first render already has the right theme
const initial = getInitialTheme()
if (typeof document !== 'undefined') {
  document.documentElement.dataset.theme = initial
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initial)

  const toggle = () => {
    setTheme(current => {
      const next = current === 'light' ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      localStorage.setItem('theme', next)
      return next
    })
  }

  return { theme, toggle }
}
