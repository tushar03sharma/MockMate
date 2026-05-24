import React from 'react'

// ─── Category badge colours ──────────────────────────────────────────────────
export const CATEGORY_STYLES = {
  Frontend:   'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  Backend:    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  DSA:        'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  HR:         'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Behavioral: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
}

function ScorePill({ label, value, color }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-xs font-semibold ${color}`}>{value}%</span>
      <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{label}</span>
    </div>
  )
}

function OverallBadge({ score }) {
  const color =
    score >= 80 ? 'text-green-600 dark:text-green-400' :
    score >= 60 ? 'text-indigo-600 dark:text-indigo-400' :
                  'text-orange-500 dark:text-orange-400'
  return (
    <div className={`text-2xl font-bold tabular-nums ${color}`}>
      {score}<span className="text-sm font-medium">%</span>
    </div>
  )
}

/**
 * HistoryCard — shows one attempt summary.
 * Props: record, onDelete, onClick
 */
export default function HistoryCard({ record, onDelete, onClick }) {
  const categoryStyle = CATEGORY_STYLES[record.category] || 'bg-gray-100 text-gray-600'
  const date = new Date(record.createdAt)
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700
                 hover:shadow-md transition-all duration-200 cursor-pointer
                 animate-fadeIn"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Top row — category + date + score */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryStyle}`}>
            {record.category}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            record.difficulty === 'Easy'   ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
            record.difficulty === 'Hard'   ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                             'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
          }`}>
            {record.difficulty}
          </span>
        </div>
        <OverallBadge score={record.score} />
      </div>

      {/* Question text */}
      <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 mb-3 leading-relaxed">
        {record.question}
      </p>

      {/* Score breakdown mini row */}
      <div className="flex items-center gap-4 mb-3 px-1">
        <ScorePill label="Comm." value={record.communicationScore} color="text-indigo-500 dark:text-indigo-400" />
        <ScorePill label="Tech."  value={record.technicalDepthScore} color="text-purple-500 dark:text-purple-400" />
        <ScorePill label="Clarity" value={record.clarityScore} color="text-sky-500 dark:text-sky-400" />
      </div>

      {/* Footer — date + delete */}
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {dateStr} · {timeStr}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(record.id) }}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400
                     hover:text-red-600 dark:hover:text-red-400 px-2 py-1 rounded hover:bg-red-50
                     dark:hover:bg-red-900/20"
          title="Delete this attempt"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
