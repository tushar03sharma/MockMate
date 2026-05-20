import React from 'react'

export default function FeedbackCard({ score, strengths, improvements, overall }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Feedback</h3>
        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{score}%</div>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Overall Assessment</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{overall}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Strengths</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-600 dark:text-green-400 mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">Areas to Improve</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
