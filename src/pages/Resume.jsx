import React, { useState, useCallback, useEffect, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import ResumeDropzone from '../components/ResumeDropzone'
import ResumeInsights from '../components/ResumeInsights'
import ResumeQuestionCard from '../components/ResumeQuestionCard'
import { extractTextFromPDF } from '../utils/resumeParser'
import { generateQuestionsFromResume } from '../utils/resumeAI'

// the different steps shown while processing
const STEPS = [
  { label: 'Reading your resume…', at: 0 },
  { label: 'Identifying skills & technologies…', at: 25 },
  { label: 'Detecting projects & experience…', at: 50 },
  { label: 'Generating personalised questions…', at: 70 },
  { label: 'Almost there…', at: 90 },
]

// page can be in one of these states
// TODO: could use a proper state machine here but this works fine
const STATE = { UPLOAD: 'upload', PROCESSING: 'processing', RESULTS: 'results', ERROR: 'error' }

// ─── Filter tabs ───────────────────────────────────────────────────────────────
const FILTER_ALL = 'All'
const FILTERS = [FILTER_ALL, 'Technical', 'Project', 'Behavioral']

// ─── Error card ────────────────────────────────────────────────────────────────
function ErrorState({ message, onReset }) {
  return (
    <div className="flex flex-col items-center gap-5 py-16 text-center animate-fadeIn">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
          Something went wrong
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
          {message}
        </p>
      </div>
      <button
        onClick={onReset}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white
                   text-sm font-medium rounded-lg transition"
      >
        Try Again
      </button>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Resume({ onNavigate, currentPage }) {
  const [pageState, setPageState]       = useState(STATE.UPLOAD)
  const [progress, setProgress]         = useState(0)
  const [processingLabel, setLabel]     = useState(STEPS[0].label)
  const [result, setResult]             = useState(null)   // { skills, projects, experienceLevel, questions }
  const [error, setError]               = useState('')
  const [activeFilter, setActiveFilter] = useState(FILTER_ALL)
  const progressIntervalRef             = useRef(null)

  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  // ── Animate progress bar through steps ───────────────────────────────────────
  function startProgressAnimation() {
    setProgress(0)
    setLabel(STEPS[0].label)
    let stepIdx = 0

    progressIntervalRef.current = setInterval(() => {
      stepIdx++
      if (stepIdx < STEPS.length) {
        setProgress(STEPS[stepIdx].at)
        setLabel(STEPS[stepIdx].label)
      } else {
        clearInterval(progressIntervalRef.current)
      }
    }, 1800)
  }

  function stopProgressAnimation() {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }

  useEffect(() => () => stopProgressAnimation(), [])

  // ── Handle file selected from dropzone ───────────────────────────────────────
  async function handleFile(file) {
    setPageState(STATE.PROCESSING)
    setProgress(0)
    setError('')
    setResult(null)
    setActiveFilter(FILTER_ALL)
    startProgressAnimation()

    try {
      const text = await extractTextFromPDF(file)
      console.log('got text from pdf, length:', text.length)

      const data = await generateQuestionsFromResume(text)
      console.log('got', data.questions.length, 'questions from gemini')

      stopProgressAnimation()
      setProgress(100)
      await new Promise((r) => setTimeout(r, 400))

      setResult(data)
      setPageState(STATE.RESULTS)
    } catch (err) {
      console.error('resume processing failed:', err)
      stopProgressAnimation()
      setError(err.message || 'Something went wrong, please try again.')
      setPageState(STATE.ERROR)
    }
  }

  // ── "Practice This" — navigate to interview with question pre-loaded ──────────
  function handlePractice(q) {
    onNavigate('interview', {
      text:       q.question,
      difficulty: q.difficulty,
      category:   q.category,
      tag:        q.tag,
    })
  }

  // ── Filter questions ──────────────────────────────────────────────────────────
  const filteredQuestions = result?.questions?.filter(
    (q) => activeFilter === FILTER_ALL || q.category === activeFilter
  ) ?? []

  // ─── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />

      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Resume Interview Prep
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Upload your resume and get AI-generated questions tailored to your skills and projects.
            </p>
          </div>

          {/* ── Upload state ─────────────────────────────────────────────── */}
          {pageState === STATE.UPLOAD && (
            <div className="animate-fadeIn">
              <ResumeDropzone
                onFile={handleFile}
                isProcessing={false}
              />

              {/* Feature hints */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: '🔍', title: 'Skills Detection',   desc: 'Identifies all technologies and tools from your resume' },
                  { icon: '💡', title: 'Project Questions',  desc: 'Asks about specific projects and implementations you listed' },
                  { icon: '🎯', title: 'Tailored Questions', desc: 'Every question is personalised — not generic templates' },
                ].map(({ icon, title, desc }) => (
                  <div key={title}
                    className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
                               rounded-xl p-4 text-center">
                    <div className="text-2xl mb-2">{icon}</div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">{title}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Processing state ──────────────────────────────────────────── */}
          {pageState === STATE.PROCESSING && (
            <div className="animate-fadeIn">
              <ResumeDropzone
                onFile={() => {}}
                isProcessing
                progress={progress}
                processingLabel={processingLabel}
              />
            </div>
          )}

          {/* ── Error state ───────────────────────────────────────────────── */}
          {pageState === STATE.ERROR && (
            <ErrorState message={error} onReset={() => setPageState(STATE.UPLOAD)} />
          )}

          {/* ── Results state ─────────────────────────────────────────────── */}
          {pageState === STATE.RESULTS && result && (
            <div className="space-y-6 animate-fadeIn">

              {/* Insights panel */}
              <ResumeInsights
                skills={result.skills}
                projects={result.projects}
                experienceLevel={result.experienceLevel}
              />

              {/* Questions header + filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Personalised Questions
                  </h2>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {result.questions.length} questions generated · click any to start practising
                  </p>
                </div>

                {/* Category filter pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        activeFilter === f
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-indigo-400'
                      }`}
                    >
                      {f}
                      {f !== FILTER_ALL && (
                        <span className="ml-1 opacity-60">
                          ({result.questions.filter((q) => q.category === f).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuestions.map((q, i) => (
                  <ResumeQuestionCard
                    key={`${q.tag}-${i}`}
                    question={q}
                    index={i}
                    onPractice={handlePractice}
                  />
                ))}
              </div>

              {/* Reset button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => { setPageState(STATE.UPLOAD); setResult(null) }}
                  className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500
                             hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload a different resume
                </button>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  )
}
