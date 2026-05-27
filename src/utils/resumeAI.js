// gemini api stuff
// using the free tier so hopefully it doesnt rate limit lol

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`

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
    throw new Error('No API key found. Add VITE_GEMINI_API_KEY to your .env file')
  }

  console.log('calling gemini api...')

  const body = JSON.stringify({
    contents: [{ parts: [{ text: buildPrompt(resumeText) }] }],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 4096,
    },
  })

  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!response.ok) {
    const errText = await response.text().catch(() => '')
    console.error('gemini error:', errText)
    throw new Error(`Gemini API error (${response.status}): ${errText.slice(0, 200)}`)
  }

  const data = await response.json()
  console.log('gemini response received')

  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text

  if (!raw) {
    throw new Error('Got empty response from Gemini, try again')
  }

  let parsed
  try {
    parsed = JSON.parse(stripCodeFences(raw))
  } catch (e) {
    console.error('failed to parse json:', raw.slice(0, 300))
    throw new Error('Could not parse the AI response. Maybe resume was too short?')
  }

  // make sure we actually got questions back
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('No questions were generated. Try uploading a more detailed resume.')
  }

  return {
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    experienceLevel: parsed.experienceLevel || 'Mid-level',
    questions: parsed.questions,
  }
}
