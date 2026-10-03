import React, { useMemo, useCallback } from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import Sidebar from '../components/Sidebar'
import { loadHistory, computeStats } from '../utils/history'
import { CATEGORIES } from '../utils/questions'

// ── colour palette (teal/stone, natural) ─────────────────────────────────────
const CAT_COLORS = {
  Frontend:   '#0d9488', // teal-600
  Backend:    '#0369a1', // sky-700
  DSA:        '#b45309', // amber-700
  HR:         '#be185d', // pink-700
  Behavioral: '#15803d', // green-700
}

const METRIC_COLORS = {
  score:              '#0d9488',
  communicationScore: '#0369a1',
  technicalDepthScore:'#b45309',
  clarityScore:       '#15803d',
}

// ── Custom tooltip for line chart ────────────────────────────────────────────
function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="text-stone-500 dark:text-stone-400 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  )
}

// ── Custom tooltip for bar chart ─────────────────────────────────────────────
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-3 py-2 shadow-md text-xs">
      <p className="font-semibold text-stone-700 dark:text-stone-200">{label}</p>
      <p className="text-stone-500 dark:text-stone-400">
        Avg score: <span className="font-semibold text-teal-600 dark:text-teal-400">{payload[0]?.value}%</span>
      </p>
      <p className="text-stone-500 dark:text-stone-400">
        Attempts: <span className="font-semibold">{payload[0]?.payload?.count}</span>
      </p>
    </div>
  )
}

// ── Metric summary card ───────────────────────────────────────────────────────
function MetricCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-5">
      <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold tabular-nums ${accent}`}>{value}</p>
      {sub && <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{sub}</p>}
    </div>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-stone-700 dark:text-stone-200 mb-4">{title}</h2>
      {children}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onNavigate }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 16l4-4 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-200 mb-1">No data yet</h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">
        Complete a few practice sessions to see your analytics here.
      </p>
      <button
        onClick={() => onNavigate('interview')}
        className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
      >
        Start Practising
      </button>
    </div>
  )
}

// ── Main Analytics Page ───────────────────────────────────────────────────────
export default function Analytics({ onNavigate, currentPage }) {
  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  const history = useMemo(() => loadHistory(), [])
  const stats   = useMemo(() => computeStats(), [])

  // ── Score trend: last 20 attempts in chronological order ─────────────────
  const trendData = useMemo(() => {
    return [...history]
      .reverse()
      .slice(-20)
      .map((r, i) => ({
        idx:   i + 1,
        label: `#${i + 1}`,
        score:              r.score,
        communicationScore: r.communicationScore ?? null,
        technicalDepthScore:r.technicalDepthScore ?? null,
        clarityScore:       r.clarityScore ?? null,
      }))
  }, [history])

  // ── Per-category averages ────────────────────────────────────────────────
  const categoryData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const records = history.filter((r) => r.category === cat)
      if (records.length === 0) return { cat, avg: 0, count: 0 }
      const avg = Math.round(records.reduce((s, r) => s + r.score, 0) / records.length)
      return { cat, avg, count: records.length }
    }).filter((d) => d.count > 0)
  }, [history])

  // ── Best category ────────────────────────────────────────────────────────
  const bestCat = useMemo(() => {
    if (categoryData.length === 0) return '—'
    return categoryData.reduce((a, b) => (a.avg >= b.avg ? a : b)).cat
  }, [categoryData])

  // ── Average sub-scores ───────────────────────────────────────────────────
  const avgSubScores = useMemo(() => {
    if (history.length === 0) return { comm: 0, tech: 0, clarity: 0 }
    const comm    = Math.round(history.reduce((s, r) => s + (r.communicationScore ?? 0),  0) / history.length)
    const tech    = Math.round(history.reduce((s, r) => s + (r.technicalDepthScore ?? 0), 0) / history.length)
    const clarity = Math.round(history.reduce((s, r) => s + (r.clarityScore ?? 0),        0) / history.length)
    return { comm, tech, clarity }
  }, [history])

  if (history.length === 0) {
    return (
      <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />
        <main className="flex-1 p-6"><EmptyState onNavigate={onNavigate} /></main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />

      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Analytics</h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Based on {history.length} practice session{history.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              label="Total Sessions"
              value={stats.total}
              sub="all time"
              accent="text-stone-800 dark:text-stone-100"
            />
            <MetricCard
              label="Average Score"
              value={`${stats.avgScore}%`}
              sub="across all attempts"
              accent="text-teal-600 dark:text-teal-400"
            />
            <MetricCard
              label="Best Score"
              value={`${stats.bestScore}%`}
              sub="personal best"
              accent="text-green-600 dark:text-green-400"
            />
            <MetricCard
              label="Best Category"
              value={bestCat}
              sub="highest avg score"
              accent="text-sky-700 dark:text-sky-400"
            />
          </div>

          {/* Sub-score averages */}
          <div className="grid grid-cols-3 gap-4">
            <MetricCard
              label="Avg Communication"
              value={`${avgSubScores.comm}%`}
              accent="text-sky-700 dark:text-sky-400"
            />
            <MetricCard
              label="Avg Technical Depth"
              value={`${avgSubScores.tech}%`}
              accent="text-amber-700 dark:text-amber-400"
            />
            <MetricCard
              label="Avg Clarity"
              value={`${avgSubScores.clarity}%`}
              accent="text-green-700 dark:text-green-400"
            />
          </div>

          {/* Score trend line chart */}
          {trendData.length >= 2 && (
            <Section title="Score Trend — last 20 sessions">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={trendData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<LineTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Overall"
                    stroke={METRIC_COLORS.score}
                    strokeWidth={2}
                    dot={{ r: 3, fill: METRIC_COLORS.score }}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="communicationScore"
                    name="Communication"
                    stroke={METRIC_COLORS.communicationScore}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="technicalDepthScore"
                    name="Technical"
                    stroke={METRIC_COLORS.technicalDepthScore}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="clarityScore"
                    name="Clarity"
                    stroke={METRIC_COLORS.clarityScore}
                    strokeWidth={1.5}
                    strokeDasharray="4 3"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-3">
                {[
                  { key: 'Overall',       color: METRIC_COLORS.score,               dash: false },
                  { key: 'Communication', color: METRIC_COLORS.communicationScore,   dash: true  },
                  { key: 'Technical',     color: METRIC_COLORS.technicalDepthScore,  dash: true  },
                  { key: 'Clarity',       color: METRIC_COLORS.clarityScore,         dash: true  },
                ].map(({ key, color, dash }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <svg width="20" height="6">
                      <line
                        x1="0" y1="3" x2="20" y2="3"
                        stroke={color}
                        strokeWidth={dash ? 1.5 : 2}
                        strokeDasharray={dash ? '4 3' : undefined}
                      />
                    </svg>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{key}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Category performance bar chart */}
          {categoryData.length > 0 && (
            <Section title="Average Score by Category">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
                  <XAxis
                    dataKey="cat"
                    tick={{ fontSize: 12, fill: '#78716c' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: '#78716c' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.cat}
                        fill={CAT_COLORS[entry.cat] || '#0d9488'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* Category legend */}
              <div className="flex flex-wrap gap-3 mt-3">
                {categoryData.map(({ cat, count, avg }) => (
                  <div key={cat} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm inline-block"
                      style={{ background: CAT_COLORS[cat] || '#0d9488' }}
                    />
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      {cat} <span className="text-stone-400">({count} · {avg}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Recent activity quick-list */}
          <Section title="Recent Sessions">
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {history.slice(0, 8).map((r) => {
                const dateStr = new Date(r.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short'
                })
                const scoreColor =
                  r.score >= 80 ? 'text-green-600 dark:text-green-400' :
                  r.score >= 60 ? 'text-teal-600 dark:text-teal-400' :
                                  'text-amber-600 dark:text-amber-400'
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between py-2.5 gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: CAT_COLORS[r.category] || '#0d9488' }}
                      />
                      <span className="text-sm text-stone-700 dark:text-stone-200 truncate">
                        {r.question}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-stone-400">{dateStr}</span>
                      <span className={`font-semibold tabular-nums ${scoreColor}`}>{r.score}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>

        </div>
      </main>
    </div>
  )
}
