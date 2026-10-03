import React from 'react'

export default function AnswerInput({ value, onChange, placeholder = "Type your answer here..." }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
        Your Answer
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={8}
        className="w-full p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700
                   rounded-xl text-stone-800 dark:text-stone-100 placeholder-stone-300
                   dark:placeholder-stone-600 focus:ring-2 focus:ring-teal-400
                   focus:border-transparent outline-none transition resize-none text-sm leading-relaxed"
      />
      <div className="text-xs text-stone-400 dark:text-stone-500 text-right">
        {value.length} characters
      </div>
    </div>
  )
}
