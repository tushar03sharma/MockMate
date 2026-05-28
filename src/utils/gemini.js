const API_URL = '/api/feedback'

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
      let errBody = {}
      try {
        errBody = await response.json()
      } catch (e) {
        // Response is not JSON
      }
      throw new Error(
        errBody?.error || `Backend error: ${response.status} ${response.statusText}`
      )
    }

    const result = await response.json()
    
    // Validate that response has required fields
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid response format from API')
    }
    
    if (typeof result.score !== 'number' || result.score < 0 || result.score > 100) {
      throw new Error('Invalid score in API response')
    }

    return result
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(
        'Failed to parse server response. Make sure backend-server.js is running on http://localhost:3001'
      )
    }
    throw new Error(
      error.message ||
        'Failed to connect to AI feedback server. Make sure backend-server.js is running: node backend-server.js'
    )
  }
}
