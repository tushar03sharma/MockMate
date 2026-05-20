import React from 'react'

export default function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500 border-r-indigo-500 animate-spin"></div>
      </div>
      <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">Analyzing your answer...</span>
    </div>
  )
}
