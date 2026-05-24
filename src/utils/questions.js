/**
 * Question bank — 5 questions per category.
 * Each question has: text, difficulty, category
 */
export const CATEGORIES = ['Frontend', 'Backend', 'DSA', 'HR', 'Behavioral']

export const QUESTIONS = {
  Frontend: [
    {
      text: 'Explain the difference between controlled and uncontrolled components in React.',
      difficulty: 'Medium',
    },
    {
      text: 'What is the CSS box model, and how do margin, border, padding, and content relate to each other?',
      difficulty: 'Easy',
    },
    {
      text: 'How does the browser\'s event loop work, and what is the difference between microtasks and macrotasks?',
      difficulty: 'Hard',
    },
    {
      text: 'Explain the difference between REST and GraphQL APIs, and when you would use each.',
      difficulty: 'Medium',
    },
    {
      text: 'What are React hooks? Explain useState, useEffect, and useCallback with real-world examples.',
      difficulty: 'Medium',
    },
  ],
  Backend: [
    {
      text: 'What is the difference between SQL and NoSQL databases? When would you choose one over the other?',
      difficulty: 'Medium',
    },
    {
      text: 'Explain how database indexing works and the trade-offs involved in adding indexes.',
      difficulty: 'Hard',
    },
    {
      text: 'What is rate limiting, and how would you implement it in a Node.js REST API?',
      difficulty: 'Medium',
    },
    {
      text: 'Describe the differences between authentication and authorization, and common patterns for each.',
      difficulty: 'Easy',
    },
    {
      text: 'What is a message queue (e.g., Kafka, RabbitMQ)? When and why would you use one?',
      difficulty: 'Hard',
    },
  ],
  DSA: [
    {
      text: 'Explain the time and space complexity of common sorting algorithms (bubble, merge, quick sort).',
      difficulty: 'Medium',
    },
    {
      text: 'What is dynamic programming? Explain with the classic example of the Fibonacci sequence.',
      difficulty: 'Hard',
    },
    {
      text: 'What is the difference between a stack and a queue? Give a real-world use case for each.',
      difficulty: 'Easy',
    },
    {
      text: 'Explain BFS vs DFS graph traversal. When would you choose one over the other?',
      difficulty: 'Medium',
    },
    {
      text: 'What is a hash table, and how does it handle collisions? What is its average-case time complexity?',
      difficulty: 'Medium',
    },
  ],
  HR: [
    {
      text: 'Tell me about yourself and why you are a good fit for this role.',
      difficulty: 'Easy',
    },
    {
      text: 'Where do you see yourself in five years? How does this role align with your goals?',
      difficulty: 'Easy',
    },
    {
      text: 'What is your expected salary range, and how did you arrive at that number?',
      difficulty: 'Medium',
    },
    {
      text: 'Why are you leaving your current job, and what are you looking for in your next opportunity?',
      difficulty: 'Easy',
    },
    {
      text: 'What are your greatest strengths and weaknesses? Give a concrete example for each.',
      difficulty: 'Medium',
    },
  ],
  Behavioral: [
    {
      text: 'Tell me about a time you had a conflict with a colleague. How did you resolve it?',
      difficulty: 'Medium',
    },
    {
      text: 'Describe a situation where you had to meet a tight deadline. What was your approach?',
      difficulty: 'Medium',
    },
    {
      text: 'Give an example of a project you are most proud of. What was your specific contribution?',
      difficulty: 'Medium',
    },
    {
      text: 'Tell me about a time you received critical feedback. How did you respond and what did you learn?',
      difficulty: 'Easy',
    },
    {
      text: 'Describe a situation where you had to make a difficult decision with limited information.',
      difficulty: 'Hard',
    },
  ],
}

/**
 * Pick a random question from the given category.
 * @param {string} category
 * @returns {{ text: string, difficulty: string, category: string }}
 */
export function getRandomQuestion(category) {
  const pool = QUESTIONS[category] || QUESTIONS.Frontend
  const q = pool[Math.floor(Math.random() * pool.length)]
  return { ...q, category }
}
