import React from 'react'

export default function QuestionCard({ question, difficulty }) {
  const diffColor = {
    Easy:   'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    Hard:   'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',
  }

  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider">
          Interview Question
        </p>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${diffColor[difficulty] || diffColor.Medium}`}>
          {difficulty}
        </span>
      </div>
      <p className="text-stone-800 dark:text-stone-100 leading-relaxed text-lg font-medium">
        {question}
      </p>
    </div>
  )
}
