import React from 'react'

export default function QuestionCard({ question, difficulty }) {
  const diffColor = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-xl font-semibold flex-1">Interview Question</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${diffColor[difficulty] || diffColor.Medium}`}>
          {difficulty}
        </span>
      </div>
      <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
        {question}
      </p>
    </div>
  )
}
