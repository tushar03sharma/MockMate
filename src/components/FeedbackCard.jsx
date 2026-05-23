import React, { useEffect, useState } from 'react'

/**
 * Animated score bar — fills from 0 to `value` on mount
 */
function ScoreBar({ label, value, color }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    // Small delay so the CSS transition plays after mount
    const t = setTimeout(() => setWidth(value), 80)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Circular score badge for the overall score
 */
function ScoreBadge({ score }) {
  const color =
    score >= 80 ? 'text-green-500 dark:text-green-400' :
    score >= 60 ? 'text-indigo-500 dark:text-indigo-400' :
                  'text-orange-500 dark:text-orange-400'

  return (
    <div className={`text-4xl font-bold tabular-nums ${color}`}>
      {score}<span className="text-xl font-medium">%</span>
    </div>
  )
}

/**
 * FeedbackCard — shows AI-generated feedback with animated score bars
 *
 * Props:
 *   score               {number}   0-100 overall score
 *   overall             {string}   overall assessment paragraph
 *   communicationScore  {number}   0-100
 *   technicalDepthScore {number}   0-100
 *   clarityScore        {number}   0-100
 *   strengths           {string[]} list of strength bullets
 *   improvements        {string[]} list of improvement bullets
 */
export default function FeedbackCard({
  score,
  overall,
  communicationScore,
  technicalDepthScore,
  clarityScore,
  strengths,
  improvements,
}) {
  const [visible, setVisible] = useState(false)

  // Trigger fade-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 border border-indigo-100 dark:border-gray-700 rounded-lg p-6 space-y-5">

        {/* Header row: title + overall score */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">AI Feedback</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Powered by AI</p>
          </div>
          <ScoreBadge score={score} />
        </div>

        {/* Overall assessment */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Overall Assessment</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{overall}</p>
        </div>

        {/* Score breakdown bars */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Score Breakdown</h4>
          <ScoreBar label="Communication"   value={communicationScore}   color="bg-indigo-500" />
          <ScoreBar label="Technical Depth" value={technicalDepthScore}  color="bg-purple-500" />
          <ScoreBar label="Clarity"         value={clarityScore}         color="bg-sky-500" />
        </div>

        {/* Strengths */}
        <div>
          <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">Strengths</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 dark:text-green-400 mt-0.5 shrink-0">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h4 className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">Areas to Improve</h4>
          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1.5">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-orange-500 dark:text-orange-400 mt-0.5 shrink-0">→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
