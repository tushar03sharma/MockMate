const API_URL = 'http://localhost:3001/api/feedback'

export async function getInterviewFeedback(question, answer) {
  if (!question || !answer) {
    throw new Error('Question and answer are required.')
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        answer,
      }),
    })

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}))
      throw new Error(errBody?.error || `Backend error: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    throw new Error(
      error.message ||
        'Failed to connect to AI feedback server. Make sure backend-server.js is running: node backend-server.js'
    )
  }
}
