/**
 * src/components/ChatBot.jsx
 *
 * Drop-in replacement for the inline chatbot in App.jsx.
 * Features:
 *  - Streaming (typewriter) AI responses via SSE
 *  - RAG-powered answers from knowledge_embeddings.json
 *  - 3 Quick Action buttons (spec'd by user)
 *  - Keyword-matcher fallback if API is unavailable
 *  - Full conversation memory (last 3 exchanges sent to API)
 *  - Visual streaming cursor (blinking ▋)
 *
 * Usage in App.jsx:
 *   import ChatBot from './components/ChatBot'
 *   // Replace the entire {/* ── CHATBOT ── *\/} section with:
 *   <ChatBot dark={dark} />
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Zap } from 'lucide-react'

// ─── Keyword fallback (used when API is unavailable) ─────────────────────────
// Keep this as a safety net so the bot always responds, even offline/no-key.

function getBotReply(rawMsg) {
  const m = rawMsg.toLowerCase()

  if (m.match(/^(hi|hey|hello|sup|yo|howdy)[\s!?]*$/))
    return "Hey! 👋 I'm Moiz-Bot. Ask me about his skills, projects, availability, or how to hire him — I'm trained on his full portfolio."

  if (m.match(/latest project|recent project|fyp|final year|dermatol|skin/))
    return "Moiz's latest project is his Final Year Project — an AI Dermatology Assistant. It detects 2 skin conditions at 85%+ accuracy in under 2 seconds, built with Django, Next.js, SQL, and AI integration. He handled the full frontend and backend. 🩺\n\nContact: moizkh369@gmail.com"

  if (m.match(/tech stack|stack|language|framework|skill|technology|what.*use|what.*know/))
    return "Moiz's stack: Python, Django, React, Next.js, Node.js, JavaScript, PHP, Java, C++, SQL, MongoDB. He's currently focused on AI integration in web apps. Also worked with WordPress, AJAX, and Android Studio. ⚙️"

  if (m.match(/relocat|remote|on.?site|location|move|flexible|work.*from|where.*work/))
    return "Moiz is fully flexible — open to remote work globally and on-site positions. Relocation is on the table. He's actively seeking his first full-time role. 🌍\n\nReach him at moizkh369@gmail.com"

  if (m.match(/hire|job|opportun|availab|freelance|intern|recruit|open to|employ/))
    return "Yes — Moiz is actively open to full-time, freelance, and internship opportunities. Preferred roles: Full Stack, Frontend, Backend, Mobile, or AI-integrated dev. Both remote and on-site work.\n\n📧 moizkh369@gmail.com | 📞 03335016753"

  if (m.match(/contact|email|phone|reach|number|how to/))
    return "📧 moizkh369@gmail.com\n📞 03335016753\n📍 H9, Islamabad, Pakistan\n🔗 linkedin.com/in/moizkhan369\n\nHe's responsive and happy to connect!"

  if (m.match(/gpa|grade|3\.9|distinction|academic|university|numl|degree|education/))
    return "Moiz is completing his BSc Software Engineering at NUML, Islamabad with a 3.9/4.0 GPA — Distinction level. He achieved this while building 4 real-world projects. 🎓"

  if (m.match(/project|portfolio|what.*(built|made|created|developed)/))
    return "Moiz has 4 projects:\n🩺 AI Dermatology Assistant (Django, Next.js, AI)\n💎 Jewellery Store (MERN, 500+ products)\n🎨 Arts & Crafts eCommerce (PHP/SQL, 1000+ users)\n🚗 Car Parking System (Java/C++, 5000+ vehicles)\n\nAsk about any one for details!"

  if (m.match(/work style|philosophy|how.*work|approach|method/))
    return "Moiz builds from prototype or scratch, makes it professional and visually polished, then tests relentlessly — trying edge cases to ensure nothing breaks. Detail-oriented to the point of perfectionism. Ships when it's actually right."

  if (m.match(/personality|leader|team|who are you|yourself|describe/))
    return "Teammates describe Moiz as a strict but cooperative and guiding leader. He holds the team to high standards and actively mentors others. Outside code: gym, music, self-improvement, vibe coding. 💪"

  return "Great question! For anything specific, reach Moiz directly at 📧 moizkh369@gmail.com — he'll respond promptly. Or try asking about his skills, projects, tech stack, or availability!"
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: '🚀 Latest project',    query: 'Tell me about your latest project' },
  { label: '⚙️ Tech stack',         query: 'What is your tech stack?' },
  { label: '🌍 Open to relocation?', query: 'Are you open to relocation?' },
]

// ─── Streaming API call ───────────────────────────────────────────────────────

async function streamChatResponse({ message, history, onToken, onDone, onError }) {
  try {
    const response = await fetch('/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message, history }),
    })

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`)
    }

    const reader  = response.body.getReader()
    const decoder = new TextDecoder()
    let   buffer  = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() // keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue

        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') { onDone(); return }

        try {
          const parsed = JSON.parse(data)
          if (parsed.token) onToken(parsed.token)
          if (parsed.error) throw new Error(parsed.error)
        } catch (parseErr) {
          // Skip malformed SSE chunks
        }
      }
    }

    onDone()
  } catch (err) {
    onError(err)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatBot({ dark }) {
  const card   = dark ? 'bg-[#0d1225]/80' : 'bg-white/85'
  const border = dark ? 'border-white/[0.07]' : 'border-black/[0.07]'
  const muted  = dark ? 'text-slate-400' : 'text-slate-500'

  const [open, setOpen]           = useState(false)
  const [input, setInput]         = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(true)

  // conversation history for API (role/content pairs)
  const [history, setHistory]     = useState([])

  // chat display messages
  const [messages, setMessages]   = useState([{
    id:        'welcome',
    from:      'bot',
    text:      "Hi! I'm Moiz-Bot 🤖 — powered by AI and trained on Moiz's full portfolio. Ask me anything, or use the quick actions below.",
    streaming: false,
  }])

  const chatEndRef    = useRef(null)
  const inputRef      = useRef(null)
  const streamingIdRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  // ── Core send logic ─────────────────────────────────────────────────────────

  const sendMessage = useCallback(async (rawText) => {
    const text = (rawText || input).trim()
    if (!text || isStreaming) return

    setInput('')
    setIsStreaming(true)
    setShowQuickActions(false)

    // Add user message
    const userMsg = { id: `u-${Date.now()}`, from: 'user', text, streaming: false }
    setMessages(prev => [...prev, userMsg])

    // Add bot placeholder with streaming flag
    const botId = `b-${Date.now()}`
    streamingIdRef.current = botId
    setMessages(prev => [...prev, { id: botId, from: 'bot', text: '', streaming: true }])

    let fullText = ''

    await streamChatResponse({
      message: text,
      history,

      onToken(token) {
        fullText += token
        setMessages(prev =>
          prev.map(m => m.id === botId ? { ...m, text: fullText } : m)
        )
      },

      onDone() {
        // Finalize the streaming message
        setMessages(prev =>
          prev.map(m => m.id === botId ? { ...m, streaming: false } : m)
        )
        // Save to history for multi-turn context
        setHistory(prev => [
          ...prev,
          { role: 'user',      content: text     },
          { role: 'assistant', content: fullText  },
        ])
        setIsStreaming(false)
      },

      onError(err) {
        console.warn('[ChatBot] API error, using fallback:', err.message)
        // Fallback to keyword matcher
        const fallback = getBotReply(text)
        setMessages(prev =>
          prev.map(m =>
            m.id === botId ? { ...m, text: fallback, streaming: false } : m
          )
        )
        setIsStreaming(false)
      },
    })
  }, [input, isStreaming, history])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* ── Chat Window ────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute bottom-16 right-0 w-[360px] border ${border} rounded-2xl overflow-hidden shadow-2xl`}
            style={{
              background: dark ? 'rgba(6,10,26,0.97)' : 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)',
            }}
          >

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5"
              style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white/30"
                    style={{ boxShadow: '0 0 6px #10b981' }} />
                </div>
                <div>
                  <p className="text-white text-sm font-bold leading-none">Moiz-Bot</p>
                  <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
                    <Zap size={9} />
                    AI-powered · RAG knowledge base
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
              >
                <X size={13} />
              </button>
            </div>

            {/* Quick Action Buttons */}
            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-3 pt-3 pb-1 flex flex-col gap-1.5"
                >
                  <p className={`text-[10px] font-bold uppercase tracking-widest px-1 mb-0.5 ${muted}`}>
                    Quick actions
                  </p>
                  {QUICK_ACTIONS.map((action) => (
                    <motion.button
                      key={action.query}
                      whileHover={{ x: 3, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => sendMessage(action.query)}
                      disabled={isStreaming}
                      className="w-full text-left text-xs px-3 py-2 rounded-xl border font-semibold transition-colors disabled:opacity-50"
                      style={{
                        background:   'rgba(6,182,212,0.06)',
                        border:       '1px solid rgba(6,182,212,0.25)',
                        color:        '#67e8f9',
                      }}
                    >
                      {action.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="h-60 overflow-y-auto p-4 flex flex-col gap-3"
              style={{ scrollbarWidth: 'thin' }}>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>

                  {msg.from === 'bot' && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[78%] text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl whitespace-pre-line ${
                      msg.from === 'user'
                        ? 'text-white rounded-br-sm'
                        : `${dark ? 'bg-white/7' : 'bg-black/5'} rounded-bl-sm`
                    }`}
                    style={msg.from === 'user' ? { background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' } : {}}
                  >
                    {msg.text || (msg.streaming ? '' : '...')}

                    {/* Blinking cursor during streaming */}
                    {msg.streaming && (
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                        className="inline-block ml-0.5 text-cyan-400 font-bold"
                        style={{ fontSize: '0.9em', lineHeight: 1 }}
                      >
                        ▋
                      </motion.span>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator (before first token arrives) */}
              {isStreaming && messages[messages.length - 1]?.text === '' && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>
                    🤖
                  </div>
                  <div className={`flex gap-1 px-3.5 py-2.5 rounded-2xl rounded-bl-sm ${dark ? 'bg-white/7' : 'bg-black/5'}`}>
                    {[0, 1, 2].map(j => (
                      <motion.div key={j}
                        className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, delay: j * 0.15, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className={`flex gap-2 p-3 border-t ${border}`}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={isStreaming}
                placeholder={isStreaming ? 'Moiz-Bot is typing...' : 'Ask about Moiz...'}
                className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border ${border} outline-none transition-all disabled:opacity-50`}
                style={{
                  background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  color: 'inherit',
                }}
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={isStreaming || !input.trim()}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}
              >
                <Send size={13} />
              </motion.button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button ───────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="pulse-ring relative w-14 h-14 rounded-full text-white text-xl flex items-center justify-center shadow-lg"
        style={{
          background:  'linear-gradient(135deg,#06b6d4,#7c3aed)',
          boxShadow:   '0 8px 28px rgba(6,182,212,0.4)',
        }}
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}>
                <X size={20} />
              </motion.span>
            : <motion.span key="bot"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}>
                🤖
              </motion.span>
          }
        </AnimatePresence>

        {/* New badge — shows "AI" label on the toggle button */}
        {!open && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 text-[9px] font-black px-1.5 py-0.5 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }}
          >
            AI
          </motion.span>
        )}
      </motion.button>

    </div>
  )
}
