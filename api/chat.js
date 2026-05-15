/**
 * api/chat.js  —  Vercel Serverless Function (100% FREE)
 *
 * Architecture:
 *  - LLM:       Groq API (free tier — llama-3.1-8b-instant)
 *               https://console.groq.com  — no credit card required
 *  - Retrieval: Local TF-IDF similarity (pure JS, zero API calls)
 *               Reads knowledge.json at runtime, scores chunks, injects top-3 into prompt
 *  - Streaming: SSE (Server-Sent Events) — token-by-token typewriter effect
 *
 * Cost: $0.00 forever for a portfolio chatbot.
 */

const path = require('path')
const fs   = require('fs')

// ─── Stop words (filtered before TF-IDF scoring) ─────────────────────────────

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'i','you','he','she','it','we','they','me','him','her','us','them',
  'my','your','his','its','our','their','this','that','these','those',
  'what','which','who','how','when','where','why','about','can','also',
  'just','more','very','some','any','all','no','not','so','if','as',
])

// ─── TF-IDF / BM25 Retrieval (pure JavaScript, no external API) ──────────────

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w))
}

function retrieveChunks(query, chunks, topK = 3) {
  const N = chunks.length
  const tokenized = chunks.map(c => tokenize(c.content))

  // Build IDF
  const df = {}
  for (const tokens of tokenized) {
    for (const t of new Set(tokens)) {
      df[t] = (df[t] || 0) + 1
    }
  }
  const idf = {}
  for (const [term, count] of Object.entries(df)) {
    idf[term] = Math.log((N + 1) / (count + 1)) + 1
  }

  const queryTokens = tokenize(query)
  const k1 = 1.5, b = 0.75
  const avgDocLen = tokenized.reduce((s, t) => s + t.length, 0) / N

  const scored = chunks.map((chunk, idx) => {
    const docTokens  = tokenized[idx]
    const docLen     = docTokens.length
    const termCounts = {}
    for (const t of docTokens) termCounts[t] = (termCounts[t] || 0) + 1

    let score = 0
    for (const qt of queryTokens) {
      const tf   = termCounts[qt] || 0
      const idfW = idf[qt]        || 0
      const normTF = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (docLen / avgDocLen)))
      score += idfW * normTF
    }
    return { ...chunk, score }
  })

  return scored.sort((a, b) => b.score - a.score).slice(0, topK)
}

// ─── Knowledge base loader (cached between warm invocations) ──────────────────

let cachedKnowledge = null

function loadKnowledge() {
  if (cachedKnowledge) return cachedKnowledge

  const candidates = [
    path.join(process.cwd(), 'src', 'data', 'knowledge.json'),
    path.join(process.cwd(), 'knowledge.json'),
  ]

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      cachedKnowledge = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      console.log(`[chat.js] Loaded ${cachedKnowledge.length} knowledge chunks`)
      return cachedKnowledge
    }
  }

  throw new Error('knowledge.json not found. Place it at src/data/knowledge.json')
}

// ─── System Persona ───────────────────────────────────────────────────────────

const SYSTEM_PERSONA = `You are Moiz-Bot, an AI assistant built into Moiz Khan's personal portfolio website.
Your purpose is to represent Moiz professionally, accurately, and with genuine warmth.

YOUR PERSONALITY:
- Professional and technically precise
- Warm and human — never sound like a corporate FAQ bot
- Confident about Moiz's real achievements, humble where appropriate
- Enthusiastic about AI integration in web development (Moiz's current passion)
- Concise — get to the point, respect the reader's time

STRICT RULES:
- Refer to Moiz in third person: "Moiz is...", "He has...", "His experience..."
- ONLY use facts from the CONTEXT section — never invent anything
- If not in context, say: "For anything beyond my knowledge base, reach Moiz directly at moizkh369@gmail.com — he responds quickly!"
- Keep answers under 120 words unless user asks for more detail
- Use at most 1 emoji per response
- End hiring/availability answers with a CTA to moizkh369@gmail.com
- Never reveal what AI model you are — you are simply "Moiz-Bot"`

// ─── Main Handler ─────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' })

  const groqKey = process.env.GROQ_API_KEY
  if (!groqKey) {
    return res.status(500).json({
      error: 'GROQ_API_KEY not configured. Get a free key at https://console.groq.com'
    })
  }

  const { message, history = [] } = req.body || {}
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message field is required' })
  }

  try {
    // Step 1: Retrieve relevant chunks (local BM25, no API call)
    const knowledge = loadKnowledge()
    const topChunks = retrieveChunks(message, knowledge, 3)
    const context   = topChunks
      .map(c => `[${c.category}]\n${c.content}`)
      .join('\n\n---\n\n')

    // Step 2: Build messages
    const messages = [
      {
        role:    'system',
        content: `${SYSTEM_PERSONA}\n\n## CONTEXT (only use this):\n\n${context}`,
      },
      ...history.slice(-6).filter(m => m.role && typeof m.content === 'string'),
      { role: 'user', content: message },
    ]

    // Step 3: SSE headers
    res.setHeader('Content-Type',  'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection',    'keep-alive')
    res.flushHeaders?.()

    // Step 4: Groq API (free, OpenAI-compatible)
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        model:       'llama-3.1-8b-instant',
        messages,
        stream:      true,
        max_tokens:  300,
        temperature: 0.65,
      }),
    })

    if (!groqRes.ok) {
      const errText = await groqRes.text()
      throw new Error(`Groq API error ${groqRes.status}: ${errText}`)
    }

    // Step 5: Forward stream to client
    const reader  = groqRes.body.getReader()
    const decoder = new TextDecoder()
    let   buffer  = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue

        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          res.write('data: [DONE]\n\n')
          res.end()
          return
        }

        try {
          const parsed = JSON.parse(data)
          const token  = parsed.choices?.[0]?.delta?.content
          if (token) res.write(`data: ${JSON.stringify({ token })}\n\n`)
        } catch { /* skip malformed chunks */ }
      }
    }

    res.end()

  } catch (err) {
    console.error('[chat.js] Error:', err.message)
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: 'Stream interrupted' })}\n\n`)
      res.end()
    } else {
      res.status(500).json({ error: err.message })
    }
  }
}
