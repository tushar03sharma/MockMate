#!/usr/bin/env node
/**
 * backend-server.js - Simple proxy backend for AI feedback API
 * Run: node backend-server.js
 * Port: 3001
 */

const http = require('http')
const https = require('https')

const PORT = process.env.PORT || 3001

const HUGGINGFACE_KEY = process.env.VITE_HUGGINGFACE_API_KEY
const OPENAI_KEY = process.env.VITE_OPENAI_API_KEY
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

const fetchHuggingFace = (prompt) =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: 'api-inference.huggingface.co',
      port: 443,
      path: '/models/tiiuae/falcon-7b-instruct',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${HUGGINGFACE_KEY}`,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HF API returned ${res.statusCode}: ${data}`))
        } else {
          try {
            const parsed = JSON.parse(data)
            const text = Array.isArray(parsed) ? parsed[0]?.generated_text : parsed?.generated_text
            resolve(text || '')
          } catch (e) {
            reject(new Error(`Failed to parse HF response: ${e.message}`))
          }
        }
      })
    })

    req.on('error', (e) => reject(e))
    req.write(
      JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.4,
          top_p: 1,
        },
      })
    )
    req.end()
  })

const fetchOpenAI = (prompt) =>
  new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_KEY}`,
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`OpenAI API returned ${res.statusCode}: ${data}`))
        } else {
          try {
            const parsed = JSON.parse(data)
            const text = parsed?.choices?.[0]?.message?.content || ''
            resolve(text)
          } catch (e) {
            reject(new Error(`Failed to parse OpenAI response: ${e.message}`))
          }
        }
      })
    })

    req.on('error', (e) => reject(e))
    req.write(
      JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical interviewer that returns only JSON.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
        top_p: 1,
        max_tokens: 1024,
      })
    )
    req.end()
  })

const stripJson = (text) => text.replace(/```json\s*/gi, '').replace(/```\s*/gi, '').trim()

const parseJson = (text) => {
  if (!text) throw new Error('Empty response')
  const cleaned = stripJson(text)
  return JSON.parse(cleaned)
}

const handleFeedbackRequest = async (question, answer) => {
  if (!question || !answer) {
    throw new Error('Question and answer are required')
  }

  const prompt = buildPrompt(question, answer)

  if (HUGGINGFACE_KEY) {
    try {
      console.log('[HF] Calling Hugging Face API...')
      const text = await fetchHuggingFace(prompt)
      const result = parseJson(text)
      console.log('[HF] Success')
      return result
    } catch (err) {
      console.warn('[HF] Error:', err.message)
    }
  }

  if (OPENAI_KEY) {
    try {
      console.log('[OpenAI] Calling OpenAI API...')
      const text = await fetchOpenAI(prompt)
      const result = parseJson(text)
      console.log('[OpenAI] Success')
      return result
    } catch (err) {
      console.warn('[OpenAI] Error:', err.message)
    }
  }

  throw new Error('No AI provider configured or all providers failed')
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.statusCode = 200
    res.end()
    return
  }

  if (req.method === 'POST' && req.url === '/api/feedback') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      try {
        const { question, answer } = JSON.parse(body)
        const result = await handleFeedbackRequest(question, answer)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(result))
      } catch (err) {
        console.error('[Error]', err.message)
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: err.message }))
      }
    })
  } else {
    res.statusCode = 404
    res.end('Not found')
  }
})

server.listen(PORT, () => {
  console.log(`\n✓ Backend API server running on http://localhost:${PORT}`)
  console.log(`  Endpoint: POST /api/feedback`)
  if (HUGGINGFACE_KEY) console.log('  Provider: Hugging Face (primary)')
  if (OPENAI_KEY) console.log('  Provider: OpenAI (fallback)')
  if (!HUGGINGFACE_KEY && !OPENAI_KEY)
    console.warn('  ⚠ No API keys configured! Set VITE_HUGGINGFACE_API_KEY or VITE_OPENAI_API_KEY')
  console.log('')
})
