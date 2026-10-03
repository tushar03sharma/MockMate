import React from 'react'

export default function StatsCard({ title, value, delta, children }) {
  return (
    <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">{title}</p>
        {delta && <span className="text-xs text-stone-400">{delta}</span>}
      </div>
      <div className="flex items-center gap-3">
        <div className="text-2xl font-semibold text-stone-800 dark:text-stone-100">{value}</div>
        <div className="text-stone-300 dark:text-stone-600">{children}</div>
      </div>
    </div>
  )
}
