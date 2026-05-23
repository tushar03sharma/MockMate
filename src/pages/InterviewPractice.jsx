import React, { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import QuestionCard from '../components/QuestionCard'
import AnswerInput from '../components/AnswerInput'
import LoadingAnimation from '../components/LoadingAnimation'
import FeedbackCard from '../components/FeedbackCard'
import { getInterviewFeedback } from '../utils/gemini'

// ─── Sample question (can be expanded to a question bank later) ──────────────
const mockQuestion = {
  text: 'Explain the difference between REST and GraphQL APIs, and when you would use each.',
  difficulty: 'Medium',
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
  const [answer, setAnswer]       = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback]   = useState(null)
  const [error, setError]         = useState(null)

  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  // ── Submit: call the AI feedback API ──────────────────────────────────────
  const handleSubmit = async () => {
    if (!answer.trim()) {
      alert('Please enter your answer first.')
      return
    }

    setIsLoading(true)
    setError(null)
    setFeedback(null)

    try {
      const result = await getInterviewFeedback(mockQuestion.text, answer)
      setFeedback(result)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // ── Reset: go back to the answer input ──────────────────────────────────
  const handleReset = () => {
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

  // ── Retry: clear error and keep the typed answer ─────────────────────────
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Interview Practice
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Answer the question below and get AI feedback on your response.
            </p>
          </div>

          {/* Question */}
          <div className="mb-8">
            <QuestionCard question={mockQuestion.text} difficulty={mockQuestion.difficulty} />
          </div>

          {/* Answer input — hidden while loading or showing feedback/error */}
          {!feedback && !isLoading && !error && (
            <div className="space-y-4 mb-8">
              <AnswerInput
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={!answer.trim()}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition"
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition"
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
              <FeedbackCard
                score={feedback.score}
                overall={feedback.overall}
                communicationScore={feedback.communicationScore}
                technicalDepthScore={feedback.technicalDepthScore}
                clarityScore={feedback.clarityScore}
                strengths={feedback.strengths}
                improvements={feedback.improvements}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
                >
                  Try Next Question
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
