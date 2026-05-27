import React, { useState } from 'react'

const LEVEL_STYLE = {
  Junior:     'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300',
  'Mid-level':'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  Senior:     'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

/**
 * ResumeInsights — collapsible panel showing detected skills, projects, and level.
 *
 * Props:
 *   skills: string[]
 *   projects: string[]
 *   experienceLevel: string
 */
export default function ResumeInsights({ skills, projects, experienceLevel }) {
  const [open, setOpen] = useState(true)

  const levelStyle = LEVEL_STYLE[experienceLevel] || LEVEL_STYLE['Mid-level']

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden animate-fadeIn">
      {/* Header — toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4
                   hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Resume Analysis</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {skills.length} skills · {projects.length} project{projects.length !== 1 ? 's' : ''} detected
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${levelStyle}`}>
            {experienceLevel}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24" fill="none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* Collapsible content */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-800 pt-4 space-y-4">
          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">
                Detected Skills & Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-xs font-medium
                               bg-gray-100 dark:bg-gray-800
                               text-gray-700 dark:text-gray-200
                               border border-gray-200 dark:border-gray-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">
                Projects Identified
              </p>
              <div className="flex flex-col gap-1.5">
                {projects.map((proj) => (
                  <div key={proj} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    {proj}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
