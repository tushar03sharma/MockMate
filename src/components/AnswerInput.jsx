import React from 'react'

export default function AnswerInput({ value, onChange, placeholder = "Type your answer here..." }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Answer</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={8}
        className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
      />
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {value.length} characters
      </div>
    </div>
  )
}
