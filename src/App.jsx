import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun, Moon, Download, Linkedin, Mail, Send,
  ChevronDown, X, Code2, Layers, Brain,
  MapPin, Phone, GraduationCap, Briefcase,
  Zap, Target, TrendingUp, Award, CheckCircle2,
  ArrowRight, Cpu, Globe, Server, Sparkles,
  Terminal, Coffee, Rocket, Users
} from 'lucide-react'

// ─── CHATBOT KEYWORD MATCHER ──────────────────────────────────────────────────

function getBotReply(rawMsg) {
  const m = rawMsg.toLowerCase()
    .replace(/\b(he|his|him|this guy|this person|this developer|their|they)\b/g, 'moiz')
    .replace(/\b(my|i am|i'm|i've|i have|i do|i know|i built|i work|i use|i can|myself)\b/g, 'moiz')
    .replace(/\bme\b/g, 'moiz')

  if (m.match(/^(hi|hey|hello|sup|yo|howdy)[\s!?]*$/))
    return "Hey! 👋 I'm Moiz-Bot, trained on Moiz's full resume. Ask me anything — skills, projects, GPA, availability, or how to hire him. Or just say 'tell me everything'!"

  if (m.match(/who are you|what are you|introduce yourself|what is this bot/))
    return "I'm Moiz-Bot 🤖 — an AI assistant built into this portfolio, trained on Moiz Khan's resume. I can answer anything about his skills, projects, education, experience, and how to get in touch!"

  if (m.match(/tell me everything|full overview|full summary|complete profile|everything about/))
    return "Here's the full picture 🗂️\n\nMoiz Khan is a Full Stack Web Developer & Software Engineer from Islamabad, Pakistan. BSc Software Engineering at NUML with a 3.9/4.0 GPA. He's built 4 real projects: AI Dermatology App (FYP), MERN Jewellery Store, Arts & Crafts eCommerce, and a Java/C++ Parking System. Stack: Python, Django, React, Node.js, MERN, SQL, AI Integration. Open to full-time & freelance work.\n\n📧 moizkh369@gmail.com"

  if (m.match(/summar|about|who is|overview|professional|background|descri|what does moiz do|what do/))
    return "Moiz is a passionate Full Stack Web Developer & Software Engineer dedicated to building robust, end-to-end web applications. He's a natural leader, highly detail-oriented, and committed to delivering flawless solutions from conception to deployment. His vision: leverage advanced technologies to build scalable, revolutionary products with a positive global impact. 🌍"

  if (m.match(/skill|tech|language|framework|stack|know|use|work with|tool|capabilit|expertise|proficien|what can/))
    return "From his resume 📋\n\n💻 Languages: Python, Java, C++, JavaScript, HTML, CSS, SQL\n⚙️ Frameworks: React, Node.js, Django, Express.js, AJAX, WordPress\n🗄️ Databases: SQL, MongoDB\n🛠️ Tools: GitHub, Visual Studio, Android Studio\n🧠 Soft Skills: Leadership, Team Collaboration, Problem Solving, Project Management"

  if (m.match(/project|portfolio|what.*(built|made|creat|develop|work)/))
    return "Moiz has 4 projects on his resume 🚀\n\n🩺 AI Dermatology Assistant (FYP) — Django, Python, AI\n💎 Jewellery Store — MERN Stack (500+ products)\n🎨 Arts & Crafts eCommerce — PHP/SQL (1000+ users)\n🚗 Car Parking System — Java/C++ (5000+ vehicles)\n\nAsk about any one for full details!"

  if (m.match(/dermatol|skin|fyp|final year|healthcare|ai project|85|detection/))
    return "🩺 Automated Dermatology Assistant (FYP) — Mar 2025 to May 2026\n\nAI-integrated healthcare web app detecting 2 major skin conditions with 85%+ accuracy in under 2 seconds. Includes:\n• Patient dashboard for skin health tracking\n• Location-based dermatologist matching\n• Appointment booking system\n\nStack: Django, SQL, Python, AI Integration"

  if (m.match(/jewel|mern|ecommerce.*mern|mongodb|500.*product/))
    return "💎 Jewellery Store Management System — Nov to Dec 2025\n\nFull-stack e-commerce portal handling 500+ products. Features:\n• Responsive React frontend\n• RESTful API for catalog & pricing\n• Rapid database querying\n\nStack: MongoDB, Express.js, React, Node.js (MERN)"

  if (m.match(/art|craft|php|1000.*user|ecommerce.*php/))
    return "🎨 Arts & Crafts eCommerce Platform — Oct to Nov 2024\n\nNiche eCommerce platform supporting 1000+ concurrent users. Features:\n• Secure user authentication & input validation\n• Real-time database integrations\n• Full shopping & order management\n\nStack: HTML, CSS, JavaScript, PHP, SQL"

  if (m.match(/park|car|5000|java.*project|desktop|c\+\+.*project/))
    return "🚗 Car Parking Management System — Oct to Nov 2022\n\nCentralized admin software tracking 5000+ vehicles with automated billing. Achievements:\n• 100% workflow efficiency improvement\n• Digitized entire manual entry system\n• Migrated C++ console to Java GUI\n\nStack: Java, C++, GUI Design, OOP"

  if (m.match(/edu|degree|university|numl|study|student|academ|school|college|qualif/))
    return "🎓 BSc Software Engineering\nNational University of Modern Languages (NUML), Islamabad\n📅 September 2022 – Present\n⭐ GPA: 3.9 / 4.0 — Distinction level"

  if (m.match(/gpa|grade|result|cgpa|mark|score|3\.9|distinction/))
    return "Moiz has a GPA of 3.9 out of 4.0 at NUML 🏆 — distinction level. Impressive considering he simultaneously shipped 4 real-world projects during his studies!"

  if (m.match(/contact|email|phone|reach|number|call|message|get in touch|how to.*contact/))
    return "📬 Here's how to reach Moiz:\n\n📧 Email: moizkh369@gmail.com\n📞 Phone: 03335016753\n📍 Location: H9, Islamabad, Pakistan\n\nHe's responsive and happy to connect!"

  if (m.match(/hire|job|opportun|availab|freelance|intern|recruit|open to|looking for|employ|position|role/))
    return "Yes! Moiz is actively open to full-time roles, freelance projects, and internship opportunities 🚀 Remote and on-site both work. Best way: moizkh369@gmail.com or 03335016753."

  if (m.match(/hobb|interest|life|outside|personal|gym|music|vibe|free time|fun/))
    return "Outside of coding, Moiz is into 💪 Gym & Fitness, 🎵 Music, ⚡ Vibe Coding sessions, 📈 Self Improvement, and 🌍 Exploring New Things. He believes a sharp developer needs a sharp life!"

  if (m.match(/english|urdu|speak|language.*speak|spoken/))
    return "Moiz speaks English at a professional proficiency level and Urdu natively. 🌐"

  if (m.match(/soft skill|leader|team|collaborat|manag|communicat|strength|best at/))
    return "His resume highlights: Leadership, Team Collaboration, Problem Solving, Project Management, and Detail-Oriented. He's led multiple technical teams to successful delivery. 💼"

  if (m.match(/python|django/))
    return "Python and Django are core to Moiz's backend stack. His FYP uses Django with AI integration. He builds Django REST APIs and is comfortable with SQL databases. 🐍"

  if (m.match(/react|frontend|ui/))
    return "Moiz builds frontends with React.js — demonstrated in his MERN Jewellery Store with a fully responsive UI and RESTful API integration. ⚛️"

  if (m.match(/node|express|mern/))
    return "Full MERN stack (MongoDB, Express, React, Node.js) is one of Moiz's core stacks. His Jewellery Store project is a complete MERN application. 🟢"

  if (m.match(/sql|database|mongo/))
    return "Moiz works with both SQL (Dermatology App, Arts & Crafts) and MongoDB (MERN Jewellery Store). Database design is a consistent part of every project he's built. 🗄️"

  if (m.match(/java|c\+\+|oop/))
    return "Java and C++ are part of Moiz's foundational skills — used in his Car Parking System with OOP principles and a Java GUI desktop app. ☕"

  if (m.match(/wordpress|ajax/))
    return "WordPress and AJAX are in Moiz's skills — useful for CMS-based projects and dynamic frontend interactions. 🌐"

  if (m.match(/github|git|version control/))
    return "GitHub is Moiz's version control tool of choice — listed in his tools section and used across all projects. 🐙"

  if (m.match(/what is react|what is django|what is mern|what is node|what is python/))
    return "Great tech question! While I'm focused on Moiz's profile, I can say he works hands-on with these technologies daily. Want to know specifically how he uses them in his projects? 😊"

  if (m.match(/best language|best framework|which is better/))
    return "That's a great debate! From Moiz's experience: Python/Django shines for backend & AI, React for frontend, and Node.js for real-time apps. He picks the right tool for the job rather than one-size-fits-all. 🛠️"

  if (m.match(/salary|pay|compensat|expect|rate/))
    return "For salary or rate details, that's best discussed directly with Moiz 😊 Reach him at moizkh369@gmail.com — he's open to negotiation based on the role and scope."

  if (m.match(/cv|resume|download/))
    return "You can download Moiz's full resume using the 'Download Resume' button at the top of this page! It has all his project details, skills, and education. 📄"

  return "That's a great question! For more personalised queries like this, reach out to Moiz directly at 📧 moizkh369@gmail.com — he'll be happy to answer in detail. Or try asking me about his skills, projects, education, or availability! 🚀"
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TYPEWRITER = [
  'Full Stack Web Developer.',
  'Software Engineer.',
  'AI Integration Specialist.',
  'Django & React Expert.',
  'Problem Solver.',
]

const STATS = [
  { value: 4,   suffix: '+',  label: 'Projects Shipped',  icon: <Briefcase size={20} />,    color: '#06b6d4' },
  { value: 3.9, suffix: '/4', label: 'Academic GPA',      icon: <GraduationCap size={20} />, color: '#818cf8' },
  { value: 10,  suffix: '+',  label: 'Technologies',      icon: <Cpu size={20} />,           color: '#a855f7' },
  { value: 85,  suffix: '%',  label: 'AI Model Accuracy', icon: <Brain size={20} />,         color: '#10b981' },
]

const SERVICES = [
  {
    icon: <Globe size={26} />,
    title: 'Full Stack Web Apps',
    desc: 'End-to-end web applications using React on the frontend and Django or Node.js on the backend — from database design to deployment.',
    tags: ['React', 'Django', 'Node.js', 'REST APIs'],
    color: '#06b6d4',
  },
  {
    icon: <Brain size={26} />,
    title: 'AI Integration',
    desc: 'Embedding machine learning models into real-world applications — skin condition detection, image classification, and intelligent systems.',
    tags: ['Python', 'AI/ML', 'Django', 'TensorFlow'],
    color: '#a855f7',
  },
  {
    icon: <Server size={26} />,
    title: 'Backend & APIs',
    desc: 'Robust, scalable backend systems with clean RESTful APIs, secure authentication, and optimised database design.',
    tags: ['Django REST', 'Express.js', 'MySQL', 'MongoDB'],
    color: '#10b981',
  },
]

const SKILL_ROWS = [
  ['Python', 'React', 'Django', 'JavaScript', 'Node.js', 'Java', 'C++', 'SQL', 'Express.js', 'AJAX'],
  ['HTML5', 'CSS3', 'MERN Stack', 'REST APIs', 'MongoDB', 'MySQL', 'Git', 'GitHub', 'WordPress', 'PHP'],
]

const SKILL_BARS = [
  { name: 'Python / Django',     pct: 90, color: '#06b6d4' },
  { name: 'React / JavaScript',  pct: 85, color: '#818cf8' },
  { name: 'Node.js / Express',   pct: 80, color: '#a855f7' },
  { name: 'SQL & Databases',     pct: 85, color: '#10b981' },
  { name: 'AI / ML Integration', pct: 75, color: '#f59e0b' },
  { name: 'Java / C++',          pct: 78, color: '#ef4444' },
]

const SKILL_CATS = [
  { label: 'Languages',   items: ['Python', 'Java', 'C++', 'JavaScript', 'HTML', 'CSS', 'SQL'],              color: '#06b6d4' },
  { label: 'Frameworks',  items: ['React', 'Django', 'Node.js', 'Express.js', 'MERN', 'AJAX', 'WordPress'], color: '#818cf8' },
  { label: 'Tools',       items: ['GitHub', 'Visual Studio', 'Android Studio'],                              color: '#a855f7' },
  { label: 'Soft Skills', items: ['Leadership', 'Team Collaboration', 'Problem Solving', 'Project Management'], color: '#10b981' },
]

const PROJECTS = [
  {
    emoji: '🩺', num: '01',
    title: 'Automated Dermatology Assistant',
    subtitle: 'AI · Django · Healthcare · Final Year Project',
    desc: 'AI-integrated healthcare platform detecting 2 major skin conditions with 85%+ accuracy in under 2 seconds. Includes patient dashboard, scan history, appointment booking, and location-based dermatologist matching.',
    tags: ['Django', 'Python', 'SQL', 'AI Integration'],
    accent: '#06b6d4',
    highlights: ['85%+ AI Accuracy', '< 2s Detection', 'Location Matching', 'Appointment System'],
  },
  {
    emoji: '💎', num: '02',
    title: 'Jewellery Store Management',
    subtitle: 'MERN Stack · E-Commerce · Full Stack',
    desc: 'Full-stack e-commerce inventory portal handling 500+ products. Features a robust RESTful API, admin dashboard, rapid database querying, and a fully responsive React frontend.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    accent: '#818cf8',
    highlights: ['500+ Products', 'RESTful API', 'Admin Dashboard', 'Responsive UI'],
  },
  {
    emoji: '🎨', num: '03',
    title: 'Arts & Crafts eCommerce',
    subtitle: 'Full Stack · PHP · MySQL',
    desc: 'Scalable eCommerce platform supporting 1000+ concurrent users with secure authentication, input validation, and real-time database integrations for order processing.',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'SQL'],
    accent: '#f59e0b',
    highlights: ['1000+ Users', 'Secure Auth', 'Real-time DB', 'Order Management'],
  },
  {
    emoji: '🚗', num: '04',
    title: 'Car Parking Management',
    subtitle: 'Desktop App · Java · C++ · OOP',
    desc: 'Centralized admin desktop software tracking 5000+ vehicles with automated billing and real-time slot management. Migrated C++ console to Java GUI — improving workflow efficiency by 100%.',
    tags: ['Java', 'C++', 'GUI', 'OOP'],
    accent: '#10b981',
    highlights: ['5000+ Vehicles', 'Automated Billing', '100% Efficiency', 'Java GUI'],
  },
]

const CURRENTLY = [
  { icon: '🏗️', label: 'Building',   value: 'AI Dermatology Assistant — Final Year Project (due May 2026)' },
  { icon: '⚡',  label: 'Sharpening', value: 'Advanced React patterns & Django REST architecture' },
  { icon: '💼', label: 'Seeking',    value: 'First full-time developer role — open to remote & on-site' },
  { icon: '🎯', label: 'Target',     value: 'Push FYP AI accuracy beyond 90% before graduation' },
]

const TIMELINE = [
  { year: '2022', title: 'Started BSc Software Engineering', sub: 'NUML Islamabad — GPA: 3.9/4.0',                       icon: <GraduationCap size={12} />, color: '#06b6d4' },
  { year: '2022', title: 'Built First Project',              sub: 'Car Parking System — Java/C++, 5000+ vehicles',        icon: <Code2 size={12} />,         color: '#818cf8' },
  { year: '2024', title: 'Full Stack eCommerce',             sub: 'Arts & Crafts Platform — PHP/SQL, 1000+ users',        icon: <Globe size={12} />,         color: '#a855f7' },
  { year: '2025', title: 'Mastered MERN Stack',              sub: 'Jewellery Store — 500+ products, RESTful API',         icon: <Layers size={12} />,        color: '#f59e0b' },
  { year: '2025', title: 'Entered AI Development',           sub: 'Integrated AI into Django for skin detection at 85%+', icon: <Brain size={12} />,         color: '#10b981' },
  { year: '2026', title: 'Graduating & Job-Ready',           sub: 'Open to full-time & freelance opportunities',          icon: <Rocket size={12} />,        color: '#ef4444' },
]

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

const fadeUp = {
  hidden:  { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

const fadeIn = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

const slideLeft = {
  hidden:  { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ─── REUSABLE REVEAL ──────────────────────────────────────────────────────────

function Reveal({ children, variants = fadeUp, custom = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-60px' }}
      variants={variants}
      custom={custom}
    >
      {children}
    </motion.div>
  )
}

// ─── HEADING ─────────────────────────────────────────────────────────────────

function Heading({ children, sub }) {
  return (
    <Reveal className="text-center mb-14">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{children}</h2>
      {sub && <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">{sub}</p>}
      <div className="w-16 h-1 mx-auto rounded-full mt-4 shimmer-bar" />
    </Reveal>
  )
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────

function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); else setInView(false) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) { setDisplay(0); return }
    const isDecimal = value % 1 !== 0
    const duration = 1400
    const steps = 50
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current = Math.min(current + increment, value)
      setDisplay(isDecimal ? parseFloat(current.toFixed(1)) : Math.round(current))
      if (current >= value) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [inView, value])

  return <span ref={ref}>{display}{suffix}</span>
}

// ─── SKILL BAR ────────────────────────────────────────────────────────────────

function SkillBar({ name, pct, color, dark }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-semibold mb-1.5">
        <span>{name}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className={`h-2 rounded-full ${dark ? 'bg-white/8' : 'bg-black/8'}`}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${pct}%` }}
          viewport={{ once: false }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }}
        />
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark]           = useState(true)
  const [typeText, setTypeText]   = useState('')
  const [typeIdx, setTypeIdx]     = useState(0)
  const [charIdx, setCharIdx]     = useState(0)
  const [typing, setTyping]       = useState(true)
  const [scrollPct, setScrollPct] = useState(0)

  // ── Chatbot state ──────────────────────────────────────────────────────────
  const [chatOpen, setChatOpen]   = useState(false)
  const [chatMsgs, setChatMsgs]   = useState([
    { from: 'bot', text: "Hi! I'm Moiz-Bot 🤖 Trained on Moiz's full resume. Ask me anything about his skills, projects, GPA, or how to hire him!" },
  ])
  const [chatInput, setChatInput] = useState('')
  const [botTyping, setBotTyping] = useState(false)
  const chatEndRef                = useRef(null)

  // ── Contact form state ─────────────────────────────────────────────────────
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent] = useState(false)

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    const fn = () => {
      const el = document.documentElement
      setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const current = TYPEWRITER[typeIdx]
    const t = setTimeout(() => {
      if (typing) {
        if (charIdx < current.length) {
          setTypeText(current.slice(0, charIdx + 1))
          setCharIdx(c => c + 1)
        } else {
          setTimeout(() => setTyping(false), 1800)
        }
      } else {
        if (charIdx > 0) {
          setTypeText(current.slice(0, charIdx - 1))
          setCharIdx(c => c - 1)
        } else {
          setTypeIdx(i => (i + 1) % TYPEWRITER.length)
          setTyping(true)
        }
      }
    }, typing ? 75 : 35)
    return () => clearTimeout(t)
  }, [typeText, charIdx, typing, typeIdx])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMsgs])

  // ── Chatbot send ───────────────────────────────────────────────────────────
  const sendChat = useCallback(() => {
    if (!chatInput.trim() || botTyping) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMsgs(prev => [...prev, { from: 'user', text: msg }])
    setBotTyping(true)
    setTimeout(() => {
      setChatMsgs(prev => [...prev, { from: 'bot', text: getBotReply(msg) }])
      setBotTyping(false)
    }, 500 + Math.random() * 400)
  }, [chatInput, botTyping])

  // ── Contact form — opens mail client with all fields pre-filled ────────────
  const sendContactEmail = useCallback(() => {
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    const subject = encodeURIComponent(`Portfolio Inquiry from ${form.name}`)
    const body    = encodeURIComponent(
      `Hi Moiz,\n\nYou received a message from your portfolio contact form.\n\n` +
      `Name:    ${form.name}\n` +
      `Email:   ${form.email}\n\n` +
      `Message:\n${form.message}\n\n` +
      `---\nSent via moizkhan.dev portfolio`
    )
    window.open(`mailto:moizkh369@gmail.com?subject=${subject}&body=${body}`)
    setFormSent(true)
  }, [form])

  // ── Theme tokens ───────────────────────────────────────────────────────────
  const bg     = dark ? 'bg-[#050818]'     : 'bg-slate-50'
  const card   = dark ? 'bg-[#0d1225]/80'  : 'bg-white/85'
  const border = dark ? 'border-white/[0.07]' : 'border-black/[0.07]'
  const muted  = dark ? 'text-slate-400'   : 'text-slate-500'
  const navBg  = dark ? 'bg-[#050818]/90'  : 'bg-slate-50/90'

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen font-[Outfit] ${bg} ${dark ? 'text-slate-100' : 'text-slate-900'} transition-colors duration-300`}>

      {/* ── Scroll progress bar ────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <motion.div
          className="h-full shimmer-bar"
          style={{ width: `${scrollPct}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* ── Gradient orbs ──────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb-1 absolute w-[600px] h-[600px] rounded-full -top-32 -left-32"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)' }} />
        <div className="orb-2 absolute w-[500px] h-[500px] rounded-full top-1/3 -right-20"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)' }} />
        <div className="orb-3 absolute w-[380px] h-[380px] rounded-full -bottom-10 left-1/3"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav
        className={`glass fixed top-[3px] left-0 right-0 z-50 ${navBg} border-b ${border}`}
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="grad-text text-2xl font-black tracking-tight">MK.</span>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-7">
              {['About', 'Skills', 'Projects', 'Journey', 'Contact'].map(s => (
                <a
                  key={s}
                  href={`#${s.toLowerCase()}`}
                  className={`nav-link text-sm font-semibold ${muted} hover:text-cyan-400 transition-colors`}
                >
                  {s}
                </a>
              ))}
            </div>
            <button
              onClick={() => setDark(d => !d)}
              className={`${card} border ${border} rounded-xl w-9 h-9 flex items-center justify-center text-cyan-400 hover:border-cyan-400/40 transition-all`}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── ALL PAGE CONTENT ───────────────────────────────────── */}
      <div className="relative z-10">

        {/* ── HERO ───────────────────────────────────────────── */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="max-w-3xl text-center">

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div
                className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-cyan-400/30"
                style={{ background: 'rgba(6,182,212,0.07)' }}
              >
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-400 block shadow-[0_0_8px_#10b981]"
                />
                <span className="text-sm font-semibold text-cyan-400">Open to opportunities</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6"
            >
              Hi, I'm <span className="grad-text">Moiz Khan.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl md:text-3xl font-bold mb-6 min-h-10 ${dark ? 'text-slate-300' : 'text-slate-600'}`}
            >
              {typeText}<span className="type-cursor">|</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto ${muted}`}
            >
              I build robust, end-to-end web applications and integrate AI to create scalable, revolutionary digital products.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <motion.a
                href="#projects"
                whileHover={{ y: -3, boxShadow: '0 12px 35px rgba(6,182,212,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)', boxShadow: '0 8px 28px rgba(6,182,212,0.35)' }}
              >
                View My Work <ArrowRight size={15} />
              </motion.a>

              {/*
                ── DOWNLOAD RESUME BUTTON ──────────────────────────────────────
                To make this work:
                  1. Name your resume PDF file exactly:  Moiz_Khan_Resume.pdf
                  2. Place it inside the  public/  folder at the root of your project:
                       Portfolio/
                         public/
                           Moiz_Khan_Resume.pdf   ← here
                         src/
                         ...
                  3. That's it — this button will then trigger a direct download.
              */}
              <motion.a
                href="/Moiz_Khan_Resume.pdf"
                download="Moiz_Khan_Resume.pdf"
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border ${border} ${card} glass`}
              >
                <Download size={15} /> Download Resume
              </motion.a>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className={`mt-20 float ${muted} flex justify-center`}
            >
              <a href="#about">
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <ChevronDown size={26} />
                </motion.div>
              </a>
            </motion.div>

          </div>
        </section>

        {/* ── STATS ──────────────────────────────────────────── */}
        <section className="px-6 py-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <Reveal key={i} custom={i} variants={fadeIn}>
                <motion.div
                  whileHover={{ y: -5, boxShadow: `0 16px 40px ${s.color}25` }}
                  className={`glass ${card} border ${border} rounded-2xl p-6 text-center`}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${s.color}18`, color: s.color }}
                  >
                    {s.icon}
                  </div>
                  <div className="text-3xl font-black mb-1" style={{ color: s.color }}>
                    <Counter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className={`text-xs font-semibold ${muted}`}>{s.label}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── ABOUT ──────────────────────────────────────────── */}
        <section id="about" className="px-6 py-20 max-w-5xl mx-auto">
          <Heading sub="Passionate developer. Detail-oriented engineer. Lifelong learner.">
            About <span className="grad-text">Me</span>
          </Heading>

          {/* Row 1: Bio + Education */}
          <div className="grid md:grid-cols-5 gap-6 mb-6">

            <Reveal className="md:col-span-3" variants={slideLeft}>
              <motion.div whileHover={{ y: -3 }} className={`glass ${card} border ${border} rounded-2xl p-8 h-full`}>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(168,85,247,0.15))' }}
                  >⚡</div>
                  <div>
                    <h3 className="font-black text-xl">Moiz Khan</h3>
                    <p className="text-xs font-semibold text-cyan-400">Full Stack Web Developer</p>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed mb-6 ${muted}`}>
                  I don't just write code — I architect solutions. From a{' '}
                  <span className="text-cyan-400 font-semibold">2-second AI diagnostic engine</span> to a MERN inventory system handling{' '}
                  <span className="text-purple-400 font-semibold">500+ products</span>, every project I ship is built for scale, speed, and real-world impact.
                </p>
                <p className={`text-sm leading-relaxed mb-6 ${muted}`}>
                  A natural leader and collaborative team player with a vision to leverage advanced technologies to build{' '}
                  <span className="text-emerald-400 font-semibold">revolutionary products</span> that create a positive global impact.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Full Stack', 'AI Integration', 'MERN Stack', 'Django', 'Problem Solver', 'Team Leader'].map(tag => (
                    <span
                      key={tag}
                      className="text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)', color: '#67e8f9' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Reveal>

            <Reveal className="md:col-span-2" variants={fadeUp} custom={1}>
              <motion.div whileHover={{ y: -3 }} className={`glass ${card} border ${border} rounded-2xl p-8 h-full`}>
                <div className="text-3xl mb-4">🎓</div>
                <h3 className="font-black text-lg mb-1">Education</h3>
                <p className="text-xs font-bold text-cyan-400 mb-4">Academic Excellence</p>
                <p className="font-bold text-sm mb-1">BSc Software Engineering</p>
                <p className={`text-xs mb-1 ${muted}`}>National University of Modern Languages</p>
                <p className={`text-xs mb-5 ${muted}`}>Islamabad · Sep 2022 – Present</p>
                <div className="mb-2 flex justify-between text-xs font-semibold">
                  <span className={muted}>GPA Progress</span>
                  <span className="text-cyan-400 font-black">3.9 / 4.0</span>
                </div>
                <div className={`h-2.5 rounded-full mb-4 ${dark ? 'bg-white/8' : 'bg-black/8'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: '97.5%' }}
                    viewport={{ once: false }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full shimmer-bar"
                  />
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-400/30 text-cyan-400"
                  style={{ background: 'rgba(6,182,212,0.08)' }}
                >
                  🏆 Distinction Level
                </span>
              </motion.div>
            </Reveal>
          </div>

          {/* Row 2: Languages + Soft Skills + Hobbies */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Reveal variants={fadeUp} custom={0}>
              <motion.div whileHover={{ y: -3 }} className={`glass ${card} border ${border} rounded-2xl p-6`}>
                <div className="text-2xl mb-3">🌐</div>
                <h3 className="font-black text-base mb-4">Languages Spoken</h3>
                <div className="space-y-3">
                  {[
                    { lang: 'English', level: 'Professional', pct: 90,  color: '#06b6d4' },
                    { lang: 'Urdu',    level: 'Native',       pct: 100, color: '#a855f7' },
                  ].map(l => (
                    <div key={l.lang}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span>{l.lang}</span>
                        <span style={{ color: l.color }}>{l.level}</span>
                      </div>
                      <div className={`h-1.5 rounded-full ${dark ? 'bg-white/8' : 'bg-black/8'}`}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${l.pct}%` }}
                          viewport={{ once: false }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full"
                          style={{ background: l.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>

            <Reveal variants={fadeUp} custom={1}>
              <motion.div whileHover={{ y: -3 }} className={`glass ${card} border ${border} rounded-2xl p-6`}>
                <div className="text-2xl mb-3">💼</div>
                <h3 className="font-black text-base mb-4">Soft Skills</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Leadership', 'Team Work', 'Problem Solving', 'Project Mgmt', 'Detail-Oriented', 'Communication'].map(s => (
                    <div
                      key={s}
                      className={`text-xs font-semibold px-2.5 py-2 rounded-lg flex items-center gap-1.5 border ${border}`}
                      style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                    >
                      <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0" /> {s}
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>

            <Reveal variants={fadeUp} custom={2}>
              <motion.div whileHover={{ y: -3 }} className={`glass ${card} border ${border} rounded-2xl p-6`}>
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="font-black text-base mb-4">Beyond the Code</h3>
                <div className="space-y-2">
                  {[
                    { emoji: '⚡', text: 'Vibe Coding sessions' },
                    { emoji: '💪', text: 'Gym — discipline that carries into code' },
                    { emoji: '🎵', text: 'Music fuels the focus' },
                    { emoji: '📈', text: 'Self Improvement daily' },
                    { emoji: '🌍', text: 'Exploring new tech & things' },
                  ].map((h, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2 rounded-lg border ${border}`}
                      style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                    >
                      <span className="text-base">{h.emoji}</span>
                      <span className={muted}>{h.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          </div>

          {/* Currently */}
          <Reveal variants={fadeUp}>
            <motion.div whileHover={{ y: -2 }} className={`glass ${card} border ${border} rounded-2xl p-7`}>
              <div className="flex items-center gap-2.5 mb-6">
                <motion.span
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2.5 h-2.5 rounded-full bg-emerald-400 block shadow-[0_0_8px_#10b981]"
                />
                <h3 className="font-black text-sm uppercase tracking-widest text-emerald-400">What I'm up to right now</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CURRENTLY.map((c, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -3, scale: 1.02 }}
                    className={`rounded-xl p-4 border ${border} transition-colors`}
                    style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                  >
                    <span className="text-2xl block mb-3">{c.icon}</span>
                    <p className="text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#06b6d4' }}>{c.label}</p>
                    <p className={`text-xs font-medium leading-snug ${muted}`}>{c.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Reveal>
        </section>

        {/* ── WHAT I DO ──────────────────────────────────────── */}
        <section className="px-6 py-20 max-w-5xl mx-auto">
          <Heading sub="Core services I deliver with precision.">
            What I <span className="grad-text">Do</span>
          </Heading>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <Reveal key={i} custom={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: `0 24px 50px ${s.color}20` }}
                  className={`glass ${card} border ${border} rounded-2xl p-8 h-full`}
                  style={{ borderTop: `2.5px solid ${s.color}` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${s.color}18`, color: s.color }}
                  >
                    {s.icon}
                  </div>
                  <h3 className="text-lg font-black mb-3">{s.title}</h3>
                  <p className={`text-sm leading-relaxed mb-5 ${muted}`}>{s.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.tags.map(t => (
                      <span
                        key={t}
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{ background: `${s.color}15`, border: `1px solid ${s.color}35`, color: s.color }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── SKILLS ─────────────────────────────────────────── */}
        <section id="skills" className="py-20 overflow-hidden">
          <div className="max-w-5xl mx-auto px-6">
            <Heading sub="Technologies I work with daily.">
              Skills & <span className="grad-text">Technologies</span>
            </Heading>
          </div>

          {SKILL_ROWS.map((row, ri) => (
            <div key={ri} className="overflow-hidden mb-4">
              <div className={`flex gap-4 w-max ${ri % 2 === 0 ? 'marquee-ltr' : 'marquee-rtl'}`}>
                {[...row, ...row].map((skill, si) => (
                  <motion.span
                    key={si}
                    whileHover={{ y: -4, scale: 1.05 }}
                    className={`glass ${card} border ${border} text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap`}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}

          <div className="max-w-5xl mx-auto mt-14 px-6 grid md:grid-cols-2 gap-10">
            <Reveal variants={slideLeft}>
              <div className={`glass ${card} border ${border} rounded-2xl p-8`}>
                <h3 className="font-black text-base mb-6 flex items-center gap-2">
                  <TrendingUp size={17} className="text-cyan-400" /> Proficiency
                </h3>
                {SKILL_BARS.map((s, i) => <SkillBar key={i} {...s} dark={dark} />)}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-4">
              {SKILL_CATS.map((cat, i) => (
                <Reveal key={i} custom={i} variants={fadeUp}>
                  <motion.div whileHover={{ x: 4 }} className={`glass ${card} border ${border} rounded-xl p-5`}>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: cat.color }}>
                      {cat.label}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map(s => (
                        <span
                          key={s}
                          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35`, color: cat.color }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROJECTS ───────────────────────────────────────── */}
        <section id="projects" className="px-6 py-20 max-w-5xl mx-auto">
          <Heading sub="End-to-end applications built from scratch.">
            Technical <span className="grad-text">Projects</span>
          </Heading>
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((p, i) => (
              <Reveal key={i} custom={i} variants={fadeUp}>
                <motion.div
                  whileHover={{ y: -8, boxShadow: `0 28px 55px ${p.accent}18` }}
                  className={`glass ${card} border ${border} rounded-2xl p-8 relative overflow-hidden h-full`}
                  style={{ borderTop: `2.5px solid ${p.accent}` }}
                >
                  <div className="absolute top-0 right-0 text-[110px] opacity-[0.04] select-none pointer-events-none leading-none -mt-2 -mr-2">
                    {p.emoji}
                  </div>
                  <div className="flex items-center justify-between mb-5">
                    <motion.span whileHover={{ scale: 1.2, rotate: 5 }} className="text-5xl inline-block">
                      {p.emoji}
                    </motion.span>
                    <span className="font-black text-2xl opacity-10">{p.num}</span>
                  </div>
                  <h3 className="text-lg font-black mb-1.5">{p.title}</h3>
                  <p className="text-xs font-bold mb-3" style={{ color: p.accent }}>{p.subtitle}</p>
                  <p className={`text-sm leading-relaxed mb-5 ${muted}`}>{p.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {p.highlights.map((h, hi) => (
                      <div key={hi} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: p.accent }}>
                        <CheckCircle2 size={12} /> {h}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(t => (
                      <span
                        key={t}
                        className="text-xs font-bold px-2 py-1 rounded-md"
                        style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}35`, color: p.accent }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── JOURNEY ────────────────────────────────────────── */}
        <section id="journey" className="px-6 py-20 max-w-3xl mx-auto">
          <Heading sub="Key milestones that shaped my development journey.">
            My <span className="grad-text">Journey</span>
          </Heading>
          <div className="relative pl-12">
            <div className="timeline-line" />
            {TIMELINE.map((item, i) => (
              <Reveal key={i} custom={i} variants={slideLeft}>
                <div className="relative mb-8 last:mb-0">
                  <div
                    className="timeline-dot"
                    style={{ top: 14, borderColor: item.color, boxShadow: `0 0 12px ${item.color}60` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center" style={{ color: item.color }}>
                      {item.icon}
                    </div>
                  </div>
                  <motion.div whileHover={{ x: 4 }} className={`glass ${card} border ${border} rounded-xl p-5`}>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span
                        className="text-xs font-black px-2 py-0.5 rounded-md"
                        style={{ background: `${item.color}20`, color: item.color }}
                      >
                        {item.year}
                      </span>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                    </div>
                    <p className={`text-xs ${muted}`}>{item.sub}</p>
                  </motion.div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CONTACT ────────────────────────────────────────── */}
        <section id="contact" className="px-6 py-20 max-w-5xl mx-auto">
          <Heading sub="Let's build something great together.">
            Get In <span className="grad-text">Touch</span>
          </Heading>

          <div className="grid md:grid-cols-2 gap-8">

            {/* Left column — contact info + social links */}
            <div className="flex flex-col gap-4">

              {/* Contact info cards — all open their respective apps */}
              {[
                {
                  icon:  <Mail size={18} />,
                  label: 'Email',
                  value: 'moizkh369@gmail.com',
                  // Opens default mail client
                  href:  'mailto:moizkh369@gmail.com?subject=Hello from your Portfolio&body=Hi Moiz,',
                },
                {
                  icon:  <Phone size={18} />,
                  label: 'Phone',
                  value: '03335016753',
                  // Opens dialer / WhatsApp on mobile
                  href:  'tel:+923335016753',
                },
                {
                  icon:  <MapPin size={18} />,
                  label: 'Location',
                  value: 'H9, Islamabad, Pakistan',
                  href:  null, // no link for location
                },
              ].map((item, i) => (
                <Reveal key={i} custom={i} variants={fadeUp}>
                  {item.href ? (
                    <motion.a
                      href={item.href}
                      whileHover={{ x: 4 }}
                      className={`glass ${card} border ${border} rounded-xl p-5 flex items-center gap-4 no-underline`}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-cyan-400"
                        style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold mb-0.5 ${muted}`}>{item.label}</p>
                        <p className="text-sm font-bold">{item.value}</p>
                      </div>
                    </motion.a>
                  ) : (
                    <div className={`glass ${card} border ${border} rounded-xl p-5 flex items-center gap-4`}>
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-cyan-400"
                        style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold mb-0.5 ${muted}`}>{item.label}</p>
                        <p className="text-sm font-bold">{item.value}</p>
                      </div>
                    </div>
                  )}
                </Reveal>
              ))}

              {/* Social icon buttons */}
              <Reveal custom={3} variants={fadeUp}>
                <div className="flex gap-3">
                  {[
                    {
                      icon:   <Mail size={18} />,
                      href:   'mailto:moizkh369@gmail.com?subject=Hello from your Portfolio&body=Hi Moiz,',
                      title:  'Send Email',
                      target: undefined,
                    },
                    {
                      icon:   <Linkedin size={18} />,
                      href:   'https://www.linkedin.com/in/moizkhan369',
                      title:  'LinkedIn Profile',
                      target: '_blank',
                    },
                  ].map((s, i) => (
                    <motion.a
                      key={i}
                      href={s.href}
                      target={s.target}
                      rel="noopener noreferrer"
                      title={s.title}
                      whileHover={{ y: -4, scale: 1.1 }}
                      className={`glass ${card} border ${border} w-12 h-12 rounded-xl flex items-center justify-center text-cyan-400 hover:border-cyan-400/40`}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </Reveal>

              {/* Availability badge */}
              <Reveal custom={4} variants={fadeUp}>
                <div
                  className="rounded-xl p-4 border border-emerald-400/20 flex items-center gap-3"
                  style={{ background: 'rgba(16,185,129,0.06)' }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2.5 h-2.5 rounded-full bg-emerald-400 block shadow-[0_0_8px_#10b981] flex-shrink-0"
                  />
                  <p className="text-sm font-semibold text-emerald-400">Available for full-time & freelance work</p>
                </div>
              </Reveal>
            </div>

            {/* Right column — contact form */}
            <Reveal custom={1} variants={fadeUp}>
              <motion.div whileHover={{ y: -3 }} className={`glass ${card} border ${border} rounded-2xl p-8`}>
                {formSent ? (
                  <div className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="text-6xl mb-5"
                    >
                      ✅
                    </motion.div>
                    <h3 className="text-xl font-black mb-2">Message Sent!</h3>
                    <p className={`text-sm ${muted}`}>
                      Your mail client opened with the message pre-filled. Moiz will reply to{' '}
                      <span className="text-cyan-400 font-semibold">{form.email}</span> soon.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setFormSent(false); setForm({ name: '', email: '', message: '' }) }}
                      className={`mt-6 text-xs font-bold px-4 py-2 rounded-xl border ${border} ${muted} hover:text-cyan-400 transition-colors`}
                    >
                      Send another message
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <h3 className="font-black text-lg mb-1">Send a Message</h3>
                    <p className={`text-xs ${muted} -mt-2`}>
                      Fills and opens your mail client — no middleman, reaches Moiz directly.
                    </p>

                    {['name', 'email'].map(f => (
                      <motion.input
                        key={f}
                        whileFocus={{ scale: 1.01 }}
                        type={f === 'email' ? 'email' : 'text'}
                        value={form[f]}
                        onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                        placeholder={f === 'name' ? 'Your Name' : 'your.email@example.com'}
                        className={`w-full px-4 py-3.5 rounded-xl text-sm border ${border} outline-none focus:border-cyan-400/50 transition-all`}
                        style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: 'inherit' }}
                      />
                    ))}

                    <motion.textarea
                      whileFocus={{ scale: 1.01 }}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      rows={5}
                      placeholder="Tell me about your project or opportunity..."
                      className={`w-full px-4 py-3.5 rounded-xl text-sm border ${border} resize-none outline-none focus:border-cyan-400/50 transition-all`}
                      style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: 'inherit' }}
                    />

                    <motion.button
                      whileHover={{ y: -2, boxShadow: '0 10px 28px rgba(6,182,212,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={sendContactEmail}
                      disabled={!form.name.trim() || !form.email.trim() || !form.message.trim()}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                      style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)', boxShadow: '0 6px 22px rgba(6,182,212,0.3)' }}
                    >
                      <Mail size={15} /> Open in Mail Client
                    </motion.button>

                    <p className={`text-[10px] text-center ${muted}`}>
                      Opens Gmail, Outlook, Apple Mail or any default email app
                    </p>
                  </div>
                )}
              </motion.div>
            </Reveal>

          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer className={`border-t ${border} py-8 px-6 text-center`}>
          <p className="grad-text font-black text-xl mb-2">MK.</p>
          <p className={`text-sm ${muted} mb-1`}>Full Stack Web Developer & Software Engineer · Islamabad, Pakistan</p>
          <p className={`text-xs ${muted}`}>
            © 2026 Moiz Khan — Crafted with <span className="grad-text font-bold">passion & precision.</span>
          </p>
        </footer>

      </div>{/* end relative z-10 */}

      {/* ── CHATBOT (fixed position) ───────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute bottom-16 right-0 w-[340px] glass border ${border} rounded-2xl overflow-hidden shadow-2xl`}
              style={{ background: dark ? 'rgba(6,10,26,0.97)' : 'rgba(255,255,255,0.97)' }}
            >
              {/* Chatbot header */}
              <div
                className="flex items-center justify-between px-4 py-3.5"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
                  <div>
                    <p className="text-white text-sm font-bold leading-none">Moiz-Bot</p>
                    <p className="text-white/70 text-xs mt-0.5">Trained on Moiz's full resume</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              {/* Quick suggestion chips — shown only on first message */}
              {chatMsgs.length === 1 && (
                <div className="px-3 pt-3 flex flex-wrap gap-1.5">
                  {['His skills?', 'His projects?', 'GPA?', 'Hire him?', 'Contact?'].map(q => (
                    <motion.button
                      key={q}
                      whileHover={{ scale: 1.04 }}
                      onClick={() => {
                        const msg = q
                        setChatMsgs(p => [...p, { from: 'user', text: msg }])
                        setBotTyping(true)
                        setTimeout(() => {
                          setChatMsgs(p => [...p, { from: 'bot', text: getBotReply(msg) }])
                          setBotTyping(false)
                        }, 500)
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                      style={{ background: 'rgba(6,182,212,0.06)' }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Message list */}
              <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3">
                {chatMsgs.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'bot' && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}
                      >
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
                      {msg.text}
                    </div>
                  </div>
                ))}

                {botTyping && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}
                    >
                      🤖
                    </div>
                    <div className={`flex gap-1 px-3.5 py-2.5 rounded-2xl rounded-bl-sm ${dark ? 'bg-white/7' : 'bg-black/5'}`}>
                      {[0, 1, 2].map(j => (
                        <motion.div
                          key={j}
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

              {/* Input row */}
              <div className={`flex gap-2 p-3 border-t ${border}`}>
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Ask about Moiz..."
                  className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border ${border} outline-none`}
                  style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: 'inherit' }}
                />
                <motion.button
                  onClick={sendChat}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}
                >
                  <Send size={13} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <motion.button
          onClick={() => setChatOpen(o => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="pulse-ring relative w-14 h-14 rounded-full text-white text-xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)', boxShadow: '0 8px 28px rgba(6,182,212,0.4)' }}
        >
          <AnimatePresence mode="wait">
            {chatOpen
              ? <motion.span key="x"   initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90,  opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.span>
              : <motion.span key="bot" initial={{ rotate: 90,  opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>🤖</motion.span>
            }
          </AnimatePresence>
        </motion.button>
      </div>

    </div>
  )
}