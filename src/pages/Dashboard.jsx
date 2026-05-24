import React, { useCallback, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import RecentInterviewsTable from '../components/RecentInterviewsTable'
import { loadHistory, computeStats } from '../utils/history'

function IconSpark() {
  return (
    <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="none"><path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke="currentColor" strokeWidth="1.2"/></svg>
  )
}

function IconTrophy() {
  return (
    <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none">
      <path d="M8 21h8M12 17v4M5 3H3v4a4 4 0 004 4h.5M19 3h2v4a4 4 0 01-4 4h-.5M7 3h10v7a5 5 0 01-10 0V3z"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

function IconTarget() {
  return (
    <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.2"/>
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
    </svg>
  )
}

export default function Dashboard({ onNavigate, currentPage }) {
  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  // Live stats from localStorage
  const stats = useMemo(() => computeStats(), [])

  // 5 most recent attempts formatted for the table
  const recentItems = useMemo(() => {
    const history = loadHistory().slice(0, 5)
    if (history.length === 0) return null
    return history.map((r, i) => ({
      id: i + 1,
      name: r.category,
      role: r.difficulty,
      date: new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      duration: '—',
      score: r.score,
      status: r.score >= 80 ? 'Hired' : r.score >= 60 ? 'Follow-up' : 'Rejected',
    }))
  }, [])

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-1 p-6 pb-24 md:pb-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="text-sm text-gray-500">Welcome back — here's your interview summary.</div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard title="Total Attempts" value={stats.total || '0'} delta="">
            <IconSpark />
          </StatsCard>
          <StatsCard title="Average Score" value={stats.total ? `${stats.avgScore}%` : '—'} delta="">
            <IconTarget />
          </StatsCard>
          <StatsCard title="Best Score" value={stats.total ? `${stats.bestScore}%` : '—'} delta="">
            <IconTrophy />
          </StatsCard>
        </section>

        <section>
          {recentItems ? (
            <RecentInterviewsTable items={recentItems} />
          ) : (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                            rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                No interview attempts yet.
              </p>
              <button
                onClick={() => onNavigate('interview')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm
                           font-medium rounded-lg transition"
              >
                Start Practising
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
