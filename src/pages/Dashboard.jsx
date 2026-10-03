import React, { useCallback, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import StatsCard from '../components/StatsCard'
import RecentInterviewsTable from '../components/RecentInterviewsTable'
import { loadHistory, computeStats } from '../utils/history'

export default function Dashboard({ onNavigate, currentPage }) {
  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  const stats = useMemo(() => computeStats(), [])

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
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-1 p-6 pb-24 md:pb-6">
        <header className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100">Dashboard</h1>
            <p className="text-sm text-stone-400 dark:text-stone-500 mt-0.5">Here's your interview summary.</p>
          </div>
          <button
            onClick={() => onNavigate('interview')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
          >
            + Start Practice
          </button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard title="Total Sessions" value={stats.total || '0'}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </StatsCard>
          <StatsCard title="Average Score" value={stats.total ? `${stats.avgScore}%` : '—'}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
            </svg>
          </StatsCard>
          <StatsCard title="Best Score" value={stats.total ? `${stats.bestScore}%` : '—'}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M8 21h8M12 17v4M5 3H3v4a4 4 0 004 4h.5M19 3h2v4a4 4 0 01-4 4h-.5M7 3h10v7a5 5 0 01-10 0V3z"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
          </StatsCard>
        </section>

        <section>
          {recentItems ? (
            <RecentInterviewsTable items={recentItems} />
          ) : (
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-10 text-center">
              <p className="text-stone-400 dark:text-stone-500 text-sm mb-4">
                No sessions yet — start practising to see results here.
              </p>
              <button
                onClick={() => onNavigate('interview')}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
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
