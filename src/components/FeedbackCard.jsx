import React, { useEffect, useState } from 'react'

/**
 * Animated score bar — fills from 0 to `value` on mount
 */
function ScoreBar({ label, value, color }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80)
    return () => clearTimeout(t)
  }, [value])

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-stone-500 dark:text-stone-400">{label}</span>
        <span className="text-xs font-semibold text-stone-700 dark:text-stone-200">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-stone-100 dark:bg-stone-700 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Numeric score badge
 */
function ScoreBadge({ score }) {
  const color =
    score >= 80 ? 'text-green-600 dark:text-green-400' :
    score >= 60 ? 'text-teal-600 dark:text-teal-400' :
                  'text-amber-600 dark:text-amber-400'

  return (
    <div className={`text-4xl font-bold tabular-nums ${color}`}>
      {score}<span className="text-xl font-medium">%</span>
    </div>
  )
}

/**
 * FeedbackCard — AI-generated feedback with animated score bars
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
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl p-6 space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-base font-semibold text-stone-800 dark:text-stone-100">Feedback</h3>
            <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">Powered by Gemini</p>
          </div>
          <ScoreBadge score={score} />
        </div>

        {/* Overall assessment */}
        <div>
          <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1.5">
            Overall Assessment
          </h4>
          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">{overall}</p>
        </div>

        {/* Score breakdown */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
            Score Breakdown
          </h4>
          <ScoreBar label="Communication"   value={communicationScore}   color="bg-sky-500" />
          <ScoreBar label="Technical Depth" value={technicalDepthScore}  color="bg-amber-500" />
          <ScoreBar label="Clarity"         value={clarityScore}         color="bg-teal-500" />
        </div>

        {/* Strengths */}
        <div>
          <h4 className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider mb-2">
            Strengths
          </h4>
          <ul className="text-sm text-stone-600 dark:text-stone-300 space-y-1.5">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-2">
            Areas to Improve
          </h4>
          <ul className="text-sm text-stone-600 dark:text-stone-300 space-y-1.5">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5 shrink-0">→</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
