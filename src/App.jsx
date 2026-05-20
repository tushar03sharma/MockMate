import React, { useEffect } from 'react'
import Dashboard from './pages/Dashboard'

export default function App() {
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return <Dashboard />
}
