import React from 'react'

// ─── Category badge styles ────────────────────────────────────────────────────
const CAT_STYLE = {
  Technical:  'bg-sky-100   text-sky-700   dark:bg-sky-900/40   dark:text-sky-300',
  Project:    'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  Behavioral: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
}

const DIFF_STYLE = {
  Easy:   'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  Hard:   'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-300',
}

// ─── Category icon ────────────────────────────────────────────────────────────
function CategoryIcon({ category }) {
  if (category === 'Technical') {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
        <polyline points="16 18 22 12 16 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <polyline points="8 6 2 12 8 18"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
  if (category === 'Project') {
    return (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/**
 * ResumeQuestionCard — displays one AI-generated resume question.
 *
 * Props:
 *   question   — { question, category, difficulty, tag }
 *   index      — for staggered animation delay
 *   onPractice — called when "Practice This" is clicked
 */
export default function ResumeQuestionCard({ question, index = 0, onPractice }) {
  const catStyle  = CAT_STYLE[question.category]  || CAT_STYLE.Technical
  const diffStyle = DIFF_STYLE[question.difficulty] || DIFF_STYLE.Medium

  return (
    <div
      className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700
                 hover:shadow-md transition-all duration-200 flex flex-col gap-4
                 animate-fadeIn"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top badges row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {/* Category badge */}
          <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${catStyle}`}>
            <CategoryIcon category={question.category} />
            {question.category}
          </span>
          {/* Difficulty badge */}
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffStyle}`}>
            {question.difficulty}
          </span>
        </div>
        {/* Tag chip */}
        {question.tag && (
          <span className="px-2.5 py-0.5 rounded-full text-xs
                           bg-indigo-50 text-indigo-600
                           dark:bg-indigo-900/30 dark:text-indigo-300
                           border border-indigo-100 dark:border-indigo-800 font-mono">
            {question.tag}
          </span>
        )}
      </div>

      {/* Question text */}
      <p className="text-sm text-gray-800 dark:text-gray-100 leading-relaxed flex-1">
        {question.question}
      </p>

      {/* Practice button */}
      <button
        onClick={() => onPractice(question)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5
                   bg-indigo-50 dark:bg-indigo-900/30
                   hover:bg-indigo-600 dark:hover:bg-indigo-600
                   text-indigo-600 dark:text-indigo-300
                   hover:text-white dark:hover:text-white
                   border border-indigo-200 dark:border-indigo-800
                   hover:border-indigo-600 dark:hover:border-indigo-600
                   rounded-lg text-sm font-medium
                   transition-all duration-150 group/btn"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Practice This
      </button>
    </div>
  )
}
