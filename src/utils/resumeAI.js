// gemini api stuff for resume feature
// using the free tier so hopefully it doesnt rate limit lol

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

// try these models in order if one is overloaded or quota exceeded
const GEMINI_MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash']

function geminiUrl(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
}

// builds the prompt - took a while to get this right, had to experiment a lot
function buildPrompt(resumeText) {
  // cutting off at 6000 chars otherwise it errors out sometimes
  const truncated = resumeText.slice(0, 6000)

  return `
You are an expert technical interviewer. Carefully read the resume below and generate highly personalised interview questions based on the candidate's actual skills, technologies, and projects.

RESUME TEXT:
"""
${truncated}
"""

Instructions:
1. Identify all technical skills, programming languages, frameworks, tools and technologies mentioned.
2. Identify all projects, their descriptions and technologies used.
3. Identify work experience, roles, and notable achievements.
4. Determine an experience level: "Junior", "Mid-level", or "Senior".
5. Generate 12-15 tailored interview questions that specifically reference content from THIS resume.
   - 5-6 Technical questions (about specific tech/skills mentioned)
   - 4-5 Project questions (about specific projects or implementations)
   - 3-4 Behavioral questions (based on their role/experience)
   - Make every question feel personalised — reference actual items from the resume.

Return ONLY a valid JSON object, no markdown, no explanation, no code fences. Exactly this structure:
{
  "skills": ["skill1", "skill2", ...],
  "projects": ["Project Name 1", "Project Name 2", ...],
  "experienceLevel": "Junior" | "Mid-level" | "Senior",
  "questions": [
    {
      "question": "The specific question text that references this resume",
      "category": "Technical" | "Project" | "Behavioral",
      "difficulty": "Easy" | "Medium" | "Hard",
      "tag": "The specific skill, tech, or project this question is about"
    }
  ]
}
`.trim()
}

// gemini sometimes wraps response in ```json ``` for some reason, this strips it
function stripCodeFences(text) {
  return text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
}

export async function generateQuestionsFromResume(resumeText) {
  if (!GEMINI_API_KEY) {
    console.warn('no api key, using mock data')
    return mockResumeResponse(resumeText)
  }

  const body = JSON.stringify({
    contents: [{ parts: [{ text: buildPrompt(resumeText) }] }],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 4096,
    },
  })

  let lastError
  for (const model of GEMINI_MODELS) {
    console.log('trying model:', model)
    try {
      const response = await fetch(geminiUrl(model), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => '')
        const msg = `Gemini API error (${response.status}): ${errText.slice(0, 200)}`
        const err = new Error(msg)
        
        // Retry on rate limiting, service unavailable, and server errors
        if (response.status === 503 || response.status === 429 || response.status === 500 || response.status === 502 || response.status === 504) {
          console.warn(`model ${model} returned ${response.status}, trying next...`)
          lastError = err
          continue
        }
        
        // Don't retry on client errors (unless it's a temporary gateway error)
        throw err
      }

      const data = await response.json()
      console.log('gemini response received from', model)

      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!raw) {
        const msg = `Got empty response from Gemini: ${JSON.stringify(data).slice(0, 200)}`
        console.warn(msg)
        throw new Error(msg)
      }

      let parsed
      try {
        parsed = JSON.parse(stripCodeFences(raw))
      } catch (e) {
        console.error('failed to parse json from response:', raw.slice(0, 300))
        throw new Error(`Could not parse the AI response: ${e.message}`)
      }

      // Validate the parsed response has the expected structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid response structure: not an object')
      }

      if (!Array.isArray(parsed.questions)) {
        throw new Error('Invalid response structure: questions is not an array')
      }

      if (parsed.questions.length === 0) {
        throw new Error('No questions were generated. Try uploading a more detailed resume.')
      }

      return {
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        experienceLevel: parsed.experienceLevel || 'Mid-level',
        questions: parsed.questions,
      }
    } catch (err) {
      // Retry on rate limit/overload errors and other temporary failures
      if (err.message.includes('503') || err.message.includes('429') || err.message.includes('overloaded') || err.message.includes('parse')) {
        lastError = err
        console.warn(`model ${model} failed with ${err.message.slice(0, 100)}, trying next...`)
        continue
      }
      // For unexpected errors, still save and continue to next model instead of throwing
      lastError = err
      continue
    }
  }

  // all models failed — fall back to mock so the app still works
  console.warn('all gemini models failed, using mock resume response')
  if (lastError) {
    console.error('last error was:', lastError.message)
  }
  return mockResumeResponse(resumeText)
}

// mock response for when api quota is exhausted
// tries to detect skills from resume text so it still feels somewhat personalised
function mockResumeResponse(resumeText) {
  const text = (resumeText || '').toLowerCase()

  const allSkills = ['React', 'JavaScript', 'Node.js', 'Python', 'Java', 'CSS', 'HTML',
    'MongoDB', 'SQL', 'Express', 'TypeScript', 'Git', 'REST APIs', 'Docker', 'AWS', 'C++', 'Firebase']
  const detected = allSkills.filter(s => text.includes(s.toLowerCase()))
  const skills = detected.length >= 3 ? detected : ['JavaScript', 'React', 'Node.js', 'Git', 'REST APIs']

  return {
    skills,
    projects: ['Personal Project', 'College Assignment App'],
    experienceLevel: 'Junior',
    questions: [
      {
        question: `You listed ${skills[0]} as a skill. Can you explain a challenging problem you solved using it?`,
        category: 'Technical',
        difficulty: 'Medium',
        tag: skills[0],
      },
      {
        question: `Walk me through a project where you used ${skills[1] || skills[0]}. What was your role and contribution?`,
        category: 'Project',
        difficulty: 'Medium',
        tag: skills[1] || skills[0],
      },
      {
        question: `How do you approach debugging when something breaks and you have no idea why?`,
        category: 'Technical',
        difficulty: 'Hard',
        tag: 'Debugging',
      },
      {
        question: `Tell me about a time you had to learn something new quickly for a deadline. How did you manage?`,
        category: 'Behavioral',
        difficulty: 'Easy',
        tag: 'Learning',
      },
      {
        question: `What's the difference between ${skills[0]} and an alternative, and when would you pick one over the other?`,
        category: 'Technical',
        difficulty: 'Medium',
        tag: skills[0],
      },
      {
        question: `Describe the most complex project on your resume. What was the hardest technical challenge?`,
        category: 'Project',
        difficulty: 'Hard',
        tag: 'Architecture',
      },
      {
        question: `How do you make sure your code is readable and maintainable for other developers?`,
        category: 'Behavioral',
        difficulty: 'Easy',
        tag: 'Code Quality',
      },
      {
        question: `If a REST API you built is responding slowly, how would you go about finding and fixing the bottleneck?`,
        category: 'Technical',
        difficulty: 'Hard',
        tag: 'Performance',
      },
    ],
  }
}
