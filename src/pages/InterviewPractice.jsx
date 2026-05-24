import React, { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import QuestionCard from '../components/QuestionCard'
import AnswerInput from '../components/AnswerInput'
import LoadingAnimation from '../components/LoadingAnimation'
import FeedbackCard from '../components/FeedbackCard'
import { getInterviewFeedback } from '../utils/gemini'
import { saveAttempt } from '../utils/history'
import { CATEGORIES, getRandomQuestion } from '../utils/questions'

// ─── Category pill colours ─────────────────────────────────────────────────────
const CAT_ACTIVE = {
  Frontend:   'bg-sky-600 text-white dark:bg-sky-500',
  Backend:    'bg-violet-600 text-white dark:bg-violet-500',
  DSA:        'bg-amber-500 text-white',
  HR:         'bg-pink-600 text-white dark:bg-pink-500',
  Behavioral: 'bg-emerald-600 text-white dark:bg-emerald-500',
}
const CAT_IDLE =
  'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'

// ─── Category Selector ─────────────────────────────────────────────────────────
function CategorySelector({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          id={`cat-${cat.toLowerCase()}`}
          onClick={() => onSelect(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
            selected === cat ? CAT_ACTIVE[cat] : CAT_IDLE
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

// ─── Error Card ───────────────────────────────────────────────────────────────
function ErrorCard({ message, onRetry }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 space-y-3">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h4 className="text-sm font-semibold text-red-700 dark:text-red-300">Something went wrong</h4>
      </div>
      <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="mt-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
      >
        Try Again
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InterviewPractice({ onNavigate, currentPage }) {
  const [category, setCategory]   = useState('Frontend')
  const [question, setQuestion]   = useState(() => getRandomQuestion('Frontend'))
  const [answer, setAnswer]       = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback]   = useState(null)
  const [error, setError]         = useState(null)

  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  // ── Change category → pick a new question ───────────────────────────────────
  const handleCategorySelect = (cat) => {
    setCategory(cat)
    setQuestion(getRandomQuestion(cat))
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

  // ── Shuffle to another question in same category ────────────────────────────
  const handleShuffle = () => {
    setQuestion(getRandomQuestion(category))
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

  // ── Submit: call the AI feedback API + auto-save ───────────────────────────
  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please enter your answer first.')
      return
    }

    setIsLoading(true)
    setError(null)
    setFeedback(null)

    try {
      const result = await getInterviewFeedback(question.text, answer)
      setFeedback(result)

      // Auto-save to localStorage
      saveAttempt({
        question: question.text,
        difficulty: question.difficulty,
        category,
        answer,
        score: result.score,
        communicationScore: result.communicationScore,
        technicalDepthScore: result.technicalDepthScore,
        clarityScore: result.clarityScore,
        overall: result.overall,
        strengths: result.strengths,
        improvements: result.improvements,
      })
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Reset: back to answer input, same question ───────────────────────────
  const handleReset = () => {
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

  // ── Retry: clear error and resubmit ──────────────────────────────────────
  const handleRetry = () => {
    setError(null)
    handleSubmit()
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />

      <main className="flex-1 p-6 pb-24 md:pb-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Interview Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a category and get AI feedback on your answer.
            </p>
          </div>

          {/* Category selector */}
          <div className="mb-5">
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Category
            </p>
            <CategorySelector selected={category} onSelect={handleCategorySelect} />
          </div>

          {/* Question */}
          <div className="mb-2">
            <QuestionCard question={question.text} difficulty={question.difficulty} />
          </div>

          {/* Shuffle button */}
          {!feedback && !isLoading && (
            <div className="flex justify-end mb-6">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500
                           hover:text-indigo-500 dark:hover:text-indigo-400 transition"
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                  <path d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                New question
              </button>
            </div>
          )}

          {/* Answer input */}
          {!feedback && !isLoading && !error && (
            <div className="space-y-4 mb-8">
              <AnswerInput
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  id="submit-answer"
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700
                             disabled:bg-gray-300 dark:disabled:bg-gray-700
                             disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
                             dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100
                             font-medium rounded-lg transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Loading spinner */}
          {isLoading && (
            <div className="mb-8">
              <LoadingAnimation />
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="mb-8">
              <ErrorCard message={error} onRetry={handleRetry} />
              <button
                onClick={handleReset}
                className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:underline"
              >
                ← Edit my answer
              </button>
            </div>
          )}

          {/* Feedback */}
          {feedback && !isLoading && (
            <div className="space-y-6">
              {/* Saved indicator */}
              <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Saved to history
              </div>

              <FeedbackCard
                score={feedback.score}
                overall={feedback.overall}
                communicationScore={feedback.communicationScore}
                technicalDepthScore={feedback.technicalDepthScore}
                clarityScore={feedback.clarityScore}
                strengths={feedback.strengths}
                improvements={feedback.improvements}
              />

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleShuffle}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700
                             text-white font-medium rounded-lg transition"
                >
                  Try Next Question
                </button>
                <button
                  onClick={() => onNavigate('history')}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700
                             hover:bg-gray-300 dark:hover:bg-gray-600
                             text-gray-900 dark:text-gray-100 font-medium rounded-lg transition"
                >
                  View History
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
