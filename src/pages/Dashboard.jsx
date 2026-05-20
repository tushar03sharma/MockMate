import React, { useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import RecentInterviewsTable from '../components/RecentInterviewsTable'

function IconSpark() {
  return (
    <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="1.2"/></svg>
  )
}

export default function Dashboard({ onNavigate, currentPage }) {
  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-1 p-6 pb-24 md:pb-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm text-gray-500">Welcome back — here's the interview summary.</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard title="Interviews this week" value="24" delta="+8%">
            <IconSpark />
          </StatsCard>
          <StatsCard title="Avg. score" value="81%" delta="+3%">
            <IconSpark />
          </StatsCard>
          <StatsCard title="Hires" value="4" delta="+1">
            <IconSpark />
          </StatsCard>
        </section>

        <section>
          <RecentInterviewsTable />
        </section>
      </main>
    </div>
  )
}
