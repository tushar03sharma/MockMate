import React, { useEffect, useState } from 'react'
import Dashboard         from './pages/Dashboard'
import InterviewPractice from './pages/InterviewPractice'
import History           from './pages/History'
import Resume            from './pages/Resume'

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [pageParams,  setPageParams]  = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Navigate to a page, optionally carrying params (e.g. initialQuestion from Resume page)
  function handleNavigate(page, params = null) {
    setPageParams(params)
    setCurrentPage(page)
  }

  return (
    <>
      {currentPage === 'dashboard' && <Dashboard         onNavigate={handleNavigate} currentPage={currentPage} />}
      {currentPage === 'interview' && <InterviewPractice onNavigate={handleNavigate} currentPage={currentPage} initialQuestion={pageParams} />}
      {currentPage === 'history'   && <History           onNavigate={handleNavigate} currentPage={currentPage} />}
      {currentPage === 'resume'    && <Resume            onNavigate={handleNavigate} currentPage={currentPage} />}
    </>
  )
}
