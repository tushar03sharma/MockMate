import React, { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import QuestionCard from '../components/QuestionCard'
import AnswerInput from '../components/AnswerInput'
import LoadingAnimation from '../components/LoadingAnimation'
import FeedbackCard from '../components/FeedbackCard'

const mockQuestion = {
  text: "Explain the difference between REST and GraphQL APIs, and when you would use each.",
  difficulty: "Medium"
}

const mockFeedback = {
  score: 78,
  overall: "Good explanation of both concepts with clear distinctions. You covered the key differences well, but could expand more on real-world use case comparisons.",
  strengths: [
    "Clear definition of REST principles",
    "Good explanation of GraphQL's query flexibility",
    "Mentioned performance considerations"
  ],
  improvements: [
    "Could provide specific examples of when to choose GraphQL (e.g., mobile apps, complex data needs)",
    "Discuss caching strategies for both approaches",
    "Mention tooling and ecosystem maturity"
  ]
}

export default function InterviewPractice({ onNavigate, currentPage }) {
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const onToggleTheme = useCallback(() => {
    const root = document.documentElement
    const isDark = root.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [])

  const handleSubmit = () => {
    if (!answer.trim()) {
      alert('Please enter your answer first')
      return
    }
    
    setIsLoading(true)
    // Simulate API delay
    setTimeout(() => {
      setFeedback(mockFeedback)
      setIsLoading(false)
    }, 2000)
  }

  const handleReset = () => {
    setAnswer('')
    setFeedback(null)
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar onToggleTheme={onToggleTheme} onNavigate={onNavigate} currentPage={currentPage} />
      <main className="flex-1 p-6">
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

        {/* Question Section */}
        <div className="mb-8">
          <QuestionCard question={mockQuestion.text} difficulty={mockQuestion.difficulty} />
        </div>

        {/* Answer Input Section */}
        {!feedback && (
          <div className="space-y-4 mb-8">
            <AnswerInput value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !answer.trim()}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium rounded-lg transition"
              >
                {isLoading ? 'Analyzing...' : 'Submit Answer'}
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

        {/* Loading State */}
        {isLoading && (
          <div className="mb-8">
            <LoadingAnimation />
          </div>
        )}

        {/* Feedback Section */}
        {feedback && (
          <div className="space-y-6">
            <FeedbackCard
              score={feedback.score}
              overall={feedback.overall}
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
                className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-medium rounded-lg transition"
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
