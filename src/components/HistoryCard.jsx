import React from 'react'

// ─── Category badge colours (natural, not neon) ───────────────────────────────
export const CATEGORY_STYLES = {
  Frontend:   'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
  Backend:    'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  DSA:        'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  HR:         'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  Behavioral: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
}

function ScorePill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-xs font-semibold tabular-nums ${color}`}>{value}%</span>
      <span className="text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">{label}</span>
    </div>
  )
}

function OverallBadge({ score }) {
  const color =
    score >= 80 ? 'text-green-600 dark:text-green-400' :
    score >= 60 ? 'text-teal-600 dark:text-teal-400' :
                  'text-amber-600 dark:text-amber-400'
  return (
    <div className={`text-2xl font-bold tabular-nums ${color}`}>
      {score}<span className="text-sm font-medium">%</span>
    </div>
  )
}

/**
 * HistoryCard — shows one attempt summary.
 */
export default function HistoryCard({ record, onDelete, onClick }) {
  const categoryStyle = CATEGORY_STYLES[record.category] || 'bg-stone-100 text-stone-600'
  const date = new Date(record.createdAt)
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="group bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800
                 rounded-xl p-5 hover:border-stone-300 dark:hover:border-stone-600
                 hover:shadow-sm transition-all duration-200 cursor-pointer animate-fadeIn"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle}`}>
            {record.category}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            record.difficulty === 'Easy'   ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' :
            record.difficulty === 'Hard'   ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                                             'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
          }`}>
            {record.difficulty}
          </span>
        </div>
        <OverallBadge score={record.score} />
      </div>

      {/* Question text */}
      <p className="text-sm text-stone-700 dark:text-stone-200 line-clamp-2 mb-3 leading-relaxed">
        {record.question}
      </p>

      {/* Sub-scores */}
      <div className="flex items-center gap-5 mb-3 px-1">
        <ScorePill label="Comm."   value={record.communicationScore}  color="text-sky-600 dark:text-sky-400" />
        <ScorePill label="Tech."   value={record.technicalDepthScore} color="text-amber-600 dark:text-amber-400" />
        <ScorePill label="Clarity" value={record.clarityScore}        color="text-teal-600 dark:text-teal-400" />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-stone-400 dark:text-stone-500">
          {dateStr} · {timeStr}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(record.id) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400
                     hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Delete this attempt"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
