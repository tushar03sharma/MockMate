import React, { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import QuestionCard from '../components/QuestionCard'
import AnswerInput from '../components/AnswerInput'
import LoadingAnimation from '../components/LoadingAnimation'
import FeedbackCard from '../components/FeedbackCard'
import { getInterviewFeedback } from '../utils/gemini'
import { saveAttempt } from '../utils/history'
import { CATEGORIES, getRandomQuestion } from '../utils/questions'

// ─── Category pill colours (natural tones) ────────────────────────────────────
const CAT_ACTIVE = {
  Frontend:   'bg-sky-600 text-white',
  Backend:    'bg-blue-700 text-white',
  DSA:        'bg-amber-600 text-white',
  HR:         'bg-rose-600 text-white',
  Behavioral: 'bg-green-700 text-white',
}
const CAT_IDLE =
  'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'

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

function ErrorCard({ message, onRetry }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 space-y-3">
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

export default function InterviewPractice({ onNavigate, currentPage, initialQuestion = null }) {
  const [category, setCategory]   = useState(initialQuestion?.category || 'Frontend')
  const [question, setQuestion]   = useState(() =>
    initialQuestion
      ? { text: initialQuestion.text, difficulty: initialQuestion.difficulty, category: initialQuestion.category }
      : getRandomQuestion('Frontend')
  )
  const [fromResume]              = useState(!!initialQuestion)
  const [answer, setAnswer]       = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback]   = useState(null)
  const [error, setError]         = useState(null)

  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  const handleCategorySelect = (cat) => {
    setCategory(cat)
    setQuestion(getRandomQuestion(cat))
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

  const handleShuffle = () => {
    setQuestion(getRandomQuestion(category))
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

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

  const handleReset = () => {
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

  const handleRetry = () => {
    setError(null)
    handleSubmit()
  }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />

      <main className="flex-1 p-6 pb-24 md:pb-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100">
                Interview Practice
              </h1>
              {fromResume && (
                <span className="px-2.5 py-1 rounded-full text-xs font-medium
                                 bg-teal-50 text-teal-700
                                 dark:bg-teal-900/30 dark:text-teal-300
                                 border border-teal-100 dark:border-teal-800
                                 flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
                      stroke="currentColor" strokeWidth="1.5"/>
                    <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  From your resume
                </span>
              )}
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-sm mt-1">
              {fromResume
                ? 'Practising a resume-tailored question. Answer below and get AI feedback.'
                : 'Choose a category and get AI feedback on your answer.'}
            </p>
          </div>

          {/* Category selector */}
          {!fromResume && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-wider mb-2">
                Category
              </p>
              <CategorySelector selected={category} onSelect={handleCategorySelect} />
            </div>
          )}

          {/* Question */}
          <div className="mb-2">
            <QuestionCard question={question.text} difficulty={question.difficulty} />
          </div>

          {/* Shuffle */}
          {!feedback && !isLoading && (
            <div className="flex justify-end mb-5">
              <button
                onClick={handleShuffle}
                className="flex items-center gap-1.5 text-xs text-stone-400 dark:text-stone-500
                           hover:text-teal-600 dark:hover:text-teal-400 transition"
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
                  className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700
                             disabled:bg-stone-200 dark:disabled:bg-stone-700
                             disabled:cursor-not-allowed text-white font-medium rounded-lg transition text-sm"
                >
                  Submit Answer
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200
                             dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200
                             font-medium rounded-lg transition text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="mb-8">
              <LoadingAnimation />
            </div>
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="mb-8">
              <ErrorCard message={error} onRetry={handleRetry} />
              <button
                onClick={handleReset}
                className="mt-3 text-sm text-stone-500 dark:text-stone-400 hover:underline"
              >
                ← Edit my answer
              </button>
            </div>
          )}

          {/* Feedback */}
          {feedback && !isLoading && (
            <div className="space-y-6">
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
                {!fromResume && (
                  <button
                    onClick={handleShuffle}
                    className="flex-1 px-6 py-3 bg-teal-600 hover:bg-teal-700
                               text-white font-medium rounded-lg transition text-sm"
                  >
                    Try Next Question
                  </button>
                )}
                <button
                  onClick={() => onNavigate(fromResume ? 'resume' : 'history')}
                  className="flex-1 px-6 py-3 bg-stone-100 dark:bg-stone-800
                             hover:bg-stone-200 dark:hover:bg-stone-700
                             text-stone-700 dark:text-stone-200 font-medium rounded-lg transition text-sm"
                >
                  {fromResume ? 'Back to Resume' : 'View History'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
