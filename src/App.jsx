import React, { useEffect, useState } from 'react'
import Dashboard from './pages/Dashboard'
import InterviewPractice from './pages/InterviewPractice'
import History from './pages/History'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  return (
    <>
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} currentPage={currentPage} />}
      {currentPage === 'interview'  && <InterviewPractice onNavigate={setCurrentPage} currentPage={currentPage} />}
      {currentPage === 'history'    && <History onNavigate={setCurrentPage} currentPage={currentPage} />}
    </>
  )
}
