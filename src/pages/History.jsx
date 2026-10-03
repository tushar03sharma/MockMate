import React, { useState, useCallback, useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import HistoryCard from '../components/HistoryCard'
import HistoryDetailModal from '../components/HistoryDetailModal'
import { loadHistory, deleteAttempt } from '../utils/history'
import { CATEGORIES } from '../utils/questions'

const ALL = 'All'
const FILTER_OPTIONS = [ALL, ...CATEGORIES]

// ─── Search icon ──────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none">
      <path d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center
                      justify-center mb-4">
        <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2
                   M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            stroke="currentColor" strokeWidth="1.2" fill="none" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-200 mb-1">
        No attempts yet
      </h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">
        Complete a practice session to see your history here.
      </p>
      <button
        onClick={() => onNavigate('interview')}
        className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm
                   font-medium rounded-lg transition"
      >
        Start Practising
      </button>
    </div>
  )
}

// ─── No results state ─────────────────────────────────────────────────────────
function NoResults({ onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-stone-500 dark:text-stone-400 text-sm mb-3">
        No attempts match your search or filter.
      </p>
      <button onClick={onClear} className="text-teal-600 hover:underline text-sm">
        Clear filters
      </button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function History({ onNavigate, currentPage }) {
  const [records, setRecords]       = useState(() => loadHistory())
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState(ALL)
  const [selected, setSelected]     = useState(null) // record for modal

  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  const handleDelete = useCallback((id) => {
    deleteAttempt(id)
    setRecords(loadHistory())
  }, [])

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return records.filter((r) => {
      const matchCat = category === ALL || r.category === category
      const matchSearch = !q || r.question.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [records, search, category])

  const clearFilters = () => { setSearch(''); setCategory(ALL) }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />

      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">

          {/* ── Header ── */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100 mb-0.5">
              Interview History
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              {records.length} attempt{records.length !== 1 ? 's' : ''} saved locally
            </p>
          </div>

          {records.length === 0 ? (
            <EmptyState onNavigate={onNavigate} />
          ) : (
            <>
              {/* ── Filters bar ── */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <SearchIcon />
                  </span>
                  <input
                    id="history-search"
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search questions…"
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-white dark:bg-stone-900
                               border border-stone-200 dark:border-stone-700 rounded-lg
                               text-stone-900 dark:text-stone-100 placeholder-stone-400
                               focus:ring-2 focus:ring-teal-400 focus:border-transparent
                               outline-none transition"
                  />
                </div>

                {/* Category dropdown */}
                <select
                  id="history-category-filter"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="px-4 py-2.5 text-sm bg-white dark:bg-stone-900
                             border border-stone-200 dark:border-stone-700 rounded-lg
                             text-stone-900 dark:text-stone-100
                             focus:ring-2 focus:ring-teal-400 focus:border-transparent
                             outline-none transition cursor-pointer"
                >
                  {FILTER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt === ALL ? 'All Categories' : opt}</option>
                  ))}
                </select>
              </div>

              {/* ── Results count ── */}
              {(search || category !== ALL) && (
                <p className="text-xs text-stone-400 dark:text-stone-500 mb-4">
                  Showing {filtered.length} of {records.length} attempts
                  {category !== ALL && ` · ${category}`}
                  {search && ` · "${search}"`}
                </p>
              )}

              {/* ── Cards grid ── */}
              {filtered.length === 0 ? (
                <NoResults onClear={clearFilters} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filtered.map((record, i) => (
                    <div
                      key={record.id}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <HistoryCard
                        record={record}
                        onDelete={handleDelete}
                        onClick={() => setSelected(record)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ── Detail modal ── */}
      {selected && (
        <HistoryDetailModal
          record={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
