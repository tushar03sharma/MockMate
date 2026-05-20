import React from 'react'

export default function StatsCard({ title, value, delta, children }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-300">{title}</div>
        <div className="text-xs text-gray-400">{delta}</div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="text-2xl font-semibold">{value}</div>
        <div className="text-gray-400">{children}</div>
      </div>
    </div>
  )
}
