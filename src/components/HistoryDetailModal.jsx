import React, { useEffect } from 'react'
import FeedbackCard from './FeedbackCard'
import { CATEGORY_STYLES } from './HistoryCard'

export default function HistoryDetailModal({ record, onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const date = new Date(record.createdAt)
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const categoryStyle = CATEGORY_STYLES[record.category] || 'bg-gray-100 text-gray-600'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto
                   bg-gray-50 dark:bg-gray-950 rounded-2xl shadow-2xl
                   border border-gray-200 dark:border-gray-800
                   animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-950 border-b border-gray-100
                        dark:border-gray-800 px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
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
            <p className="text-xs text-gray-400 dark:text-gray-500">{dateStr} · {timeStr}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full
                       text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                       hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Question */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                          rounded-xl p-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Question
            </p>
            <p className="text-gray-800 dark:text-gray-100 text-sm leading-relaxed">
              {record.question}
            </p>
          </div>

          {/* Your answer */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                          rounded-xl p-4">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Your Answer
            </p>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {record.answer}
            </p>
          </div>

          {/* Feedback card (reused) */}
          <FeedbackCard
            score={record.score}
            overall={record.overall}
            communicationScore={record.communicationScore}
            technicalDepthScore={record.technicalDepthScore}
            clarityScore={record.clarityScore}
            strengths={record.strengths}
            improvements={record.improvements}
          />
        </div>
      </div>
    </div>
  )
}
