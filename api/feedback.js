/**
 * api/feedback.js — Vercel Serverless Function
 * Handles POST /api/feedback → calls Gemini API → returns JSON feedback
 */

const https = require('https')

const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY

const buildPrompt = (question, answer) => `
You are an expert technical interviewer. Evaluate the following interview answer and return structured JSON feedback.

Interview Question:
"${question}"

Candidate's Answer:
"${answer}"

Respond with ONLY a valid JSON object — no markdown, no code fences, no explanation. Use this exact structure:
{
  "score": <overall score 0-100 as integer>,
  "overall": "<2-3 sentence overall assessment>",
  "communicationScore": <0-100 as integer>,
  "technicalDepthScore": <0-100 as integer>,
  "clarityScore": <0-100 as integer>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}
`.trim()

const fetchGemini = (prompt) =>
  new Promise((resolve, reject) => {
    const model = 'gemini-2.5-flash'
    const path = `/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`
    const body = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 4096 },
    })

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Gemini API returned ${res.statusCode}: ${data}`))
        } else {
          try {
            const parsed = JSON.parse(data)
            const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text || ''
            resolve(text)
          } catch (e) {
            reject(new Error(`Failed to parse Gemini response: ${e.message}`))
          }
        }
      })
    })

    req.on('error', (e) => reject(e))
    req.write(body)
    req.end()
  })

const stripJson = (text) => text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()

const parseJson = (text) => {
  if (!text) throw new Error('Empty response from Gemini')
  return JSON.parse(stripJson(text))
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(404).json({ error: 'Not found' })
    return
  }

  const { question, answer } = req.body || {}

  if (!question || !answer) {
    res.status(400).json({ error: 'question and answer are required' })
    return
  }

  if (!GEMINI_KEY) {
    res.status(500).json({ error: 'VITE_GEMINI_API_KEY is not configured on the server.' })
    return
  }

  try {
    const prompt = buildPrompt(question, answer)
    const text = await fetchGemini(prompt)
    const result = parseJson(text)
    res.status(200).json(result)
  } catch (err) {
    console.error('[Gemini Error]', err.message)
    res.status(500).json({ error: err.message })
  }
}
