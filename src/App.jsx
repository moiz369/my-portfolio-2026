import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Sun, Moon, Download, Linkedin, Mail, Send,
  ChevronDown, X, Code2, Layers, Brain,
  MapPin, Phone, GraduationCap, Briefcase,
  Zap, Target, TrendingUp, Award, CheckCircle2,
  ArrowRight, Cpu, Globe, Server
} from 'lucide-react'

// ─── CHATBOT KNOWLEDGE BASE ──────────────────────────────────────────────────

const KNOWLEDGE = `
IDENTITY:
- Full name: Moiz Khan
- Title: Full Stack Web Developer
- Email: moizkh369@gmail.com
- Phone: 03335016753
- Location: H9, Islamabad, Pakistan

PROFESSIONAL SUMMARY (exact from resume):
Passionate Full Stack Web Developer and Software Engineer dedicated to building robust, end-to-end web applications. A natural leader and collaborative team player with a proven track record of guiding technical projects to success. Highly detail-oriented and committed to delivering flawless, high-quality solutions from conception to deployment. Driven by a vision to leverage advanced technologies to build scalable, revolutionary products that create a positive global impact.

EDUCATION:
- University: National University of Modern Languages (NUML), Islamabad, Pakistan
- Degree: Bachelor of Science in Software Engineering
- Duration: September 2022 – Present
- GPA: 3.9 / 4.0

TECHNICAL PROJECTS (exact from resume):

1. Automated Dermatology Assistant (FYP) — March 2025 to May 2026
   - Built an AI-integrated healthcare web app capable of detecting 2 major skin conditions with 85%+ accuracy
   - Optimized the AI prediction pipeline to deliver diagnostic results in under 2 seconds
   - Designed a patient dashboard to track skin health progress
   - Implemented location-based services to match users with nearby dermatologists and book appointments
   - Technologies: Django, SQL, Python, AI Integration

2. Jewellery Store Management System — November 2025 to December 2025
   - Architected a full-stack e-commerce inventory portal handling 500+ products
   - Developed a responsive frontend and robust RESTful API for database querying, pricing, and catalog management
   - Technologies: MongoDB, Express.js, React, Node.js (MERN Stack)

3. Arts and Crafts eCommerce Platform — October 2024 to November 2024
   - Built a niche e-commerce platform with a scalable backend supporting 1000+ concurrent users
   - Implemented secure user authentication, input validation, and real-time database integrations
   - Technologies: HTML, CSS, JavaScript, PHP, SQL

4. Car Parking Management System — October 2022 to November 2022
   - Developed centralized administrative software for real-time parking tracking and automated billing, scaling to 5000+ vehicles
   - Digitized the entire manual entry system, improving workflow efficiency by 100% and reducing logging errors
   - Migrated core C++ console logic to a Java-based GUI for better accessibility
   - Technologies: Java, C++, GUI Design, OOP

SKILLS (exact from resume):
Python, Java, C++, JavaScript, HTML, CSS, React, Node.js, Django, Express.js, AJAX, SQL, GitHub, Visual Studio, Android Studio, WordPress, Leadership, Team Collaboration, Problem Solving, Project Management, Detail-Oriented

LANGUAGES:
- English: Professional proficiency
- Urdu: Native

INTERESTS & HOBBIES:
Vibe Coding, Self Improvement, Exploring New Things, Gym, Music
`

// Smart bot that patterns against the knowledge base
function getBotReply(rawMsg) {
  // Normalize pronouns so "what are his skills?" works exactly like "what are moiz's skills?"
  const m = rawMsg.toLowerCase()
    .replace(/\b(he|his|him|this guy|the guy|this person|this developer|their)\b/g, 'moiz')
    .replace(/\b(my|i am|i'm|i've|i have|i do|i know|i built|i work|i use|i can)\b/g, 'moiz')
    .replace(/\bme\b/g, 'moiz')

  // ── Greetings ──────────────────────────────────────────────────────────────
  if (m.match(/^(hi|hey|hello|sup|what.?s up|yo|howdy|hiya)[\s!?]*$/))
    return "Hey! 👋 I'm Moiz-Bot, trained on Moiz's actual resume. Ask me anything — skills, projects, GPA, how to hire him, or just say 'tell me everything'!"

  if (m.match(/who are you|what are you|introduce yourself|what is this/))
    return "I'm Moiz-Bot 🤖 — an AI assistant built into this portfolio, trained on Moiz Khan's resume. I can answer anything about his skills, projects, education, experience, and how to get in touch. What do you want to know?"

  // ── Full overview ──────────────────────────────────────────────────────────
  if (m.match(/tell me everything|full overview|full summary|complete profile|everything about/))
    return "Here's the full picture 🗂️\n\nMoiz Khan is a Full Stack Web Developer & Software Engineer from Islamabad, Pakistan. He's studying BSc Software Engineering at NUML with a 3.9/4.0 GPA. He's built 4 real projects: an AI Dermatology App (FYP), a MERN Jewellery Store, an Arts & Crafts eCommerce, and a Java/C++ Parking System. His stack covers Python, Django, React, Node.js, MERN, SQL, and AI integration. He speaks English (professional) and Urdu (native). Open to full-time and freelance work. 📩 moizkh369@gmail.com"

  // ── Professional summary / About ──────────────────────────────────────────
  if (m.match(/summar|about|who is|overview|professional|background|descri|what does moiz do|what do/))
    return "Moiz is a passionate Full Stack Web Developer & Software Engineer dedicated to building robust, end-to-end web applications. He's a natural leader, highly detail-oriented, and committed to delivering flawless solutions from conception to deployment. His vision: leverage advanced technologies to build scalable, revolutionary products with a positive global impact. 🌍"

  // ── Skills ────────────────────────────────────────────────────────────────
  if (m.match(/skill|tech|language|framework|stack|know|use|work with|tool|capabilit|expertise|proficien|what can/))
    return "From his resume 📋\n\n💻 Languages: Python, Java, C++, JavaScript, HTML, CSS, SQL\n⚙️ Frameworks: React, Node.js, Django, Express.js, AJAX, WordPress\n🗄️ Databases: SQL, MongoDB\n🛠️ Tools: GitHub, Visual Studio, Android Studio\n🧠 Soft Skills: Leadership, Team Collaboration, Problem Solving, Project Management, Detail-Oriented"

  // ── All projects overview ──────────────────────────────────────────────────
  if (m.match(/project|portfolio|what.*(built|made|creat|develop|work)/))
    return "Moiz has 4 projects on his resume 🚀\n\n🩺 AI Dermatology Assistant (FYP) — Django, Python, AI\n💎 Jewellery Store — MERN Stack (500+ products)\n🎨 Arts & Crafts eCommerce — PHP/SQL (1000+ users)\n🚗 Car Parking System — Java/C++ (5000+ vehicles)\n\nAsk about any specific one for full details!"

  // ── FYP / Dermatology ──────────────────────────────────────────────────────
  if (m.match(/dermatol|skin|fyp|final year|healthcare|ai project|85|detection/))
    return "🩺 Automated Dermatology Assistant (FYP) — Mar 2025 to May 2026\n\nAI-integrated healthcare web app that detects 2 major skin conditions with 85%+ accuracy in under 2 seconds. Includes:\n• Patient dashboard for tracking skin health\n• Location-based dermatologist matching\n• Appointment booking system\n\nStack: Django, SQL, Python, AI Integration"

  // ── Jewellery Store ────────────────────────────────────────────────────────
  if (m.match(/jewel|mern|store|inventory|ecommerce.*mern|mongodb/))
    return "💎 Jewellery Store Management System — Nov to Dec 2025\n\nFull-stack e-commerce portal handling 500+ products. Built with:\n• Responsive React frontend\n• RESTful API for catalog & pricing\n• Rapid database querying\n\nStack: MongoDB, Express.js, React, Node.js (MERN)"

  // ── Arts & Crafts ──────────────────────────────────────────────────────────
  if (m.match(/art|craft|php|1000|ecommerce.*php/))
    return "🎨 Arts & Crafts eCommerce Platform — Oct to Nov 2024\n\nNiche eCommerce platform with scalable backend supporting 1000+ concurrent users. Features:\n• Secure user authentication\n• Input validation\n• Real-time database integrations\n\nStack: HTML, CSS, JavaScript, PHP, SQL"

  // ── Parking ────────────────────────────────────────────────────────────────
  if (m.match(/park|car|5000|java.*project|desktop|c\+\+.*project/))
    return "🚗 Car Parking Management System — Oct to Nov 2022\n\nCentralized admin software tracking 5000+ vehicles in real-time with automated billing. Key achievements:\n• 100% workflow efficiency improvement\n• Digitized entire manual entry system\n• Migrated C++ console to Java GUI\n\nStack: Java, C++, GUI Design, OOP"

  // ── Education ─────────────────────────────────────────────────────────────
  if (m.match(/edu|degree|university|numl|study|student|academ|school|college|qualif/))
    return "🎓 BSc Software Engineering\nNational University of Modern Languages (NUML), Islamabad\n📅 September 2022 – Present\n⭐ GPA: 3.9 / 4.0 (Distinction level)"

  // ── GPA ───────────────────────────────────────────────────────────────────
  if (m.match(/gpa|grade|result|cgpa|mark|score|3\.9|distinction/))
    return "Moiz has a GPA of 3.9 out of 4.0 at NUML 🏆 — distinction level. Impressive considering he simultaneously delivered 4 real-world projects alongside his studies!"

  // ── Contact ───────────────────────────────────────────────────────────────
  if (m.match(/contact|email|phone|reach|number|call|message|get in touch|how to.*contact/))
    return "📬 Here's how to reach Moiz:\n\n📧 Email: moizkh369@gmail.com\n📞 Phone: 03335016753\n📍 Location: H9, Islamabad, Pakistan\n\nHe's responsive and happy to connect!"

  // ── Hiring / Availability ─────────────────────────────────────────────────
  if (m.match(/hire|job|opportun|availab|freelance|intern|recruit|open to|looking for|employ|position|role/))
    return "Yes! Moiz is open to full-time roles, freelance projects, and internship opportunities 🚀 The best way to reach him is moizkh369@gmail.com or 03335016753. He's based in Islamabad but open to remote work too!"

  // ── Hobbies ───────────────────────────────────────────────────────────────
  if (m.match(/hobb|interest|life|outside|personal|gym|music|vibe|free time|fun|passtime/))
    return "Outside of coding, Moiz is into 💪 Gym & Fitness, 🎵 Music, ⚡ Vibe Coding sessions, 📈 Self Improvement, and 🌍 Exploring New Things. He believes a sharp developer needs a sharp life!"

  // ── Languages spoken ──────────────────────────────────────────────────────
  if (m.match(/english|urdu|speak|language.*speak|spoken/))
    return "Moiz speaks English at a professional proficiency level and Urdu natively. 🌐 Both are listed on his resume."

  // ── Soft skills / Leadership ──────────────────────────────────────────────
  if (m.match(/soft skill|leader|team|collaborat|manag|communicat|strength|best at/))
    return "His resume highlights these soft skills: Leadership, Team Collaboration, Problem Solving, Project Management, and Detail-Oriented. He has a track record of leading full technical teams to successful delivery. 💼"

  // ── Specific tech ─────────────────────────────────────────────────────────
  if (m.match(/python|django/))
    return "Python and Django are core to Moiz's backend stack. His FYP uses Django with AI integration, and he's comfortable with Django REST APIs and SQL databases. 🐍"

  if (m.match(/react|frontend|ui/))
    return "Moiz builds frontends with React.js — demonstrated in his MERN Jewellery Store project with a fully responsive UI and RESTful API integration. ⚛️"

  if (m.match(/node|express|mern/))
    return "Full MERN stack (MongoDB, Express, React, Node.js) is one of Moiz's core stacks. His Jewellery Store project is a complete MERN application handling 500+ products. 🟢"

  if (m.match(/sql|database|mongo/))
    return "Moiz works with both SQL (used in Dermatology App and Arts & Crafts platform) and MongoDB (MERN Jewellery Store). Database design is a consistent part of every project he's built. 🗄️"

  if (m.match(/java|c\+\+|oop/))
    return "Java and C++ are part of Moiz's foundational skills — used in his Car Parking Management System to build a GUI desktop app with OOP principles. His first university project! ☕"

  if (m.match(/wordpress|ajax/))
    return "WordPress and AJAX are listed in Moiz's skills — useful for CMS-based projects and dynamic frontend interactions. 🌐"

  if (m.match(/github|git/))
    return "GitHub is Moiz's version control tool of choice — listed in his tools section and used across all projects. 🐙"

  // ── Fallback ──────────────────────────────────────────────────────────────
  return "Good question! Moiz is a Full Stack Developer (BSc SE at NUML, GPA 3.9/4.0) skilled in React, Django, Node.js, MERN Stack, and AI integration. Try asking about his skills, a specific project, his education, or how to hire him! 🚀"
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const TYPEWRITER = [
  'Full Stack Web Developer.',
  'Software Engineer.',
  'AI Integration Specialist.',
  'Django & React Expert.',
  'Problem Solver.',
]

const STATS = [
  { value: 4,    suffix: '+', label: 'Projects Shipped',    icon: <Briefcase size={20} />, color: '#06b6d4' },
  { value: 3.9,  suffix: '/4', label: 'Academic GPA',       icon: <GraduationCap size={20} />, color: '#818cf8' },
  { value: 10,   suffix: '+', label: 'Technologies',         icon: <Cpu size={20} />, color: '#a855f7' },
  { value: 85,   suffix: '%', label: 'AI Model Accuracy',   icon: <Brain size={20} />, color: '#10b981' },
]

const SERVICES = [
  {
    icon: <Globe size={26} />,
    title: 'Full Stack Web Apps',
    desc: 'End-to-end web applications using React on the frontend and Django or Node.js on the backend. From database design to deployment.',
    tags: ['React', 'Django', 'Node.js', 'REST APIs'],
    color: '#06b6d4',
  },
  {
    icon: <Brain size={26} />,
    title: 'AI Integration',
    desc: 'Embedding machine learning models into real-world applications. Skin condition detection, image classification, and predictive systems.',
    tags: ['TensorFlow', 'Python', 'scikit-learn', 'ML APIs'],
    color: '#a855f7',
  },
  {
    icon: <Server size={26} />,
    title: 'Backend & APIs',
    desc: 'Robust, scalable backend systems with clean RESTful APIs, secure JWT authentication, and optimised database queries.',
    tags: ['Django REST', 'Express.js', 'MySQL', 'MongoDB'],
    color: '#10b981',
  },
]

const SKILL_ROWS = [
  ['Python', 'React', 'Django', 'JavaScript', 'Node.js', 'Java', 'C++', 'SQL', 'Express.js', 'TensorFlow'],
  ['HTML5', 'CSS3', 'MERN Stack', 'REST APIs', 'JWT Auth', 'MongoDB', 'MySQL', 'Git', 'Tailwind CSS', 'PHP'],
]

const SKILL_BARS = [
  { name: 'Python / Django',   pct: 90, color: '#06b6d4' },
  { name: 'React / JavaScript', pct: 85, color: '#818cf8' },
  { name: 'Node.js / Express', pct: 80, color: '#a855f7' },
  { name: 'SQL & Databases',   pct: 85, color: '#10b981' },
  { name: 'AI / ML (TensorFlow)', pct: 75, color: '#f59e0b' },
  { name: 'Java / C++',        pct: 78, color: '#ef4444' },
]

const SKILL_CATS = [
  { label: 'Languages',   items: ['Python', 'Java', 'C++', 'JavaScript', 'HTML', 'CSS', 'SQL'], color: '#06b6d4' },
  { label: 'Frameworks',  items: ['React', 'Django', 'Node.js', 'Express.js', 'MERN', 'AJAX', 'WordPress'], color: '#818cf8' },
  { label: 'Tools',       items: ['GitHub', 'VS Code', 'Android Studio', 'Postman'], color: '#a855f7' },
  { label: 'Soft Skills', items: ['Leadership', 'Team Work', 'Problem Solving', 'Communication'], color: '#10b981' },
]

const PROJECTS = [
  {
    emoji: '🩺', num: '01',
    title: 'Automated Dermatology Assistant',
    subtitle: 'AI · Django · Healthcare · Final Year Project',
    desc: 'AI-integrated healthcare platform detecting skin conditions with 85%+ accuracy in under 2 seconds. Includes patient dashboard, scan history, appointment booking, and location-based dermatologist matching via geolocation API.',
    tags: ['Django', 'Python', 'TensorFlow', 'SQL', 'AI/ML'],
    accent: '#06b6d4',
    highlights: ['85%+ AI Accuracy', '< 2s Detection', 'Location Matching', 'Appointment System'],
  },
  {
    emoji: '💎', num: '02',
    title: 'Jewellery Store Management',
    subtitle: 'MERN Stack · E-Commerce · Full Stack',
    desc: 'Full-stack e-commerce inventory portal architected for 500+ products. Features a robust RESTful API, JWT authentication, admin dashboard, and a fully responsive React frontend.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    accent: '#818cf8',
    highlights: ['500+ Products', 'RESTful API', 'JWT Auth', 'Admin Dashboard'],
  },
  {
    emoji: '🎨', num: '03',
    title: 'Arts & Crafts eCommerce',
    subtitle: 'Full Stack · PHP · MySQL · Scalable',
    desc: 'Scalable eCommerce platform engineered to support 1000+ concurrent users with secure session authentication, real-time database integrations, and a complete shopping experience.',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    accent: '#f59e0b',
    highlights: ['1000+ Users', 'Session Auth', 'Real-time DB', 'Shopping Cart'],
  },
  {
    emoji: '🚗', num: '04',
    title: 'Car Parking Management',
    subtitle: 'Desktop App · Java · C++ · OOP',
    desc: 'Administrative desktop software engineered to track 5000+ vehicles simultaneously with real-time slot management, reporting dashboards, and an intuitive GUI — improving workflow efficiency by 100%.',
    tags: ['Java', 'C++', 'GUI', 'OOP', 'Data Structures'],
    accent: '#10b981',
    highlights: ['5000+ Vehicles', 'Real-time Slots', 'Admin Reports', '100% Efficiency Gain'],
  },
]

const TIMELINE = [
  { year: '2022', title: 'Started BSc Software Engineering', sub: 'NUML, Islamabad — GPA: 3.9/4.0', icon: <GraduationCap size={12} />, color: '#06b6d4' },
  { year: '2023', title: 'Built First Full Stack App', sub: 'Arts & Crafts eCommerce — PHP, MySQL, 1000+ users', icon: <Code2 size={12} />, color: '#818cf8' },
  { year: '2023', title: 'Mastered MERN Stack', sub: 'Jewellery Store Management System — 500+ products', icon: <Layers size={12} />, color: '#a855f7' },
  { year: '2024', title: 'Entered AI/ML Development', sub: 'Integrated TensorFlow into real-world Django app', icon: <Brain size={12} />, color: '#f59e0b' },
  { year: '2025', title: 'Final Year AI Project', sub: 'Automated Dermatology Assistant — 85%+ accuracy', icon: <Award size={12} />, color: '#10b981' },
  { year: '2026', title: 'Graduating & Job-Ready', sub: 'Open to full-time / freelance opportunities', icon: <Target size={12} />, color: '#ef4444' },
]

const CURRENTLY = [
  { icon: '🏗️', label: 'Building',   value: 'AI Dermatology Assistant — Final Year Project (due May 2026)' },
  { icon: '🧠', label: 'Sharpening', value: 'AI/ML pipeline optimisation & Django REST architecture' },
  { icon: '💼', label: 'Seeking',    value: 'First full-time developer role — open to remote & on-site' },
  { icon: '🎯', label: 'Target',     value: 'Push FYP AI accuracy beyond 90% before graduation' },
]

// ─── FRAMER VARIANTS ─────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }
  }),
}

// ─── REUSABLE COMPONENTS ──────────────────────────────────────────────────────

function Section({ id, children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.section id={id} ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={`px-6 ${className}`}>
      {children}
    </motion.section>
  )
}

function Heading({ children, sub }) {
  return (
    <motion.div variants={fadeUp} className="text-center mb-14">
      <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">{children}</h2>
      {sub && <p className="text-sm text-slate-400 mt-3 max-w-md mx-auto">{sub}</p>}
      <div className="w-16 h-1 mx-auto rounded-full mt-4 shimmer-bar" />
    </motion.div>
  )
}

// Animated counter
function Counter({ value, suffix }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
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

// Skill bar
function SkillBar({ name, pct, color, dark }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between text-sm font-semibold mb-1.5">
        <span>{name}</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className={`h-2 rounded-full ${dark ? 'bg-white/8' : 'bg-black/8'}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
        />
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(true)
  const [typeText, setTypeText] = useState('')
  const [typeIdx, setTypeIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [typing, setTyping] = useState(true)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const [cursorBig, setCursorBig] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMsgs, setChatMsgs] = useState([
    { from: 'bot', text: "Hi! I'm Moiz-Bot 🤖 I'm trained on Moiz's full resume. Ask me anything — his skills, projects, GPA, how to hire him, or anything else!" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [botTyping, setBotTyping] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  // Scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setScrollPct((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Custom cursor
  useEffect(() => {
    const move = e => setCursor({ x: e.clientX, y: e.clientY })
    const over = e => setCursorBig(!!e.target.closest('a,button,[role="button"],input,textarea'))
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over) }
  }, [])

  // Typewriter
  useEffect(() => {
    const current = TYPEWRITER[typeIdx]
    const t = setTimeout(() => {
      if (typing) {
        if (charIdx < current.length) { setTypeText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1) }
        else setTimeout(() => setTyping(false), 1800)
      } else {
        if (charIdx > 0) { setTypeText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1) }
        else { setTypeIdx(i => (i + 1) % TYPEWRITER.length); setTyping(true) }
      }
    }, typing ? 75 : 35)
    return () => clearTimeout(t)
  }, [typeText, charIdx, typing, typeIdx])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMsgs])

  const sendChat = useCallback(() => {
    if (!chatInput.trim() || botTyping) return
    const msg = chatInput.trim()
    setChatInput('')
    setChatMsgs(prev => [...prev, { from: 'user', text: msg }])
    setBotTyping(true)
    setTimeout(() => {
      setChatMsgs(prev => [...prev, { from: 'bot', text: getBotReply(msg) }])
      setBotTyping(false)
    }, 600 + Math.random() * 400)
  }, [chatInput, botTyping])

  // Theme tokens
  const bg     = dark ? 'bg-[#050818]'       : 'bg-slate-50'
  const card   = dark ? 'bg-[#0d1225]/80'    : 'bg-white/85'
  const border = dark ? 'border-white/[0.07]' : 'border-black/[0.07]'
  const muted  = dark ? 'text-slate-400'     : 'text-slate-500'
  const navBg  = dark ? 'bg-[#050818]/88'    : 'bg-slate-50/88'

  return (
    <div className={`min-h-screen font-[Outfit] ${bg} ${dark ? 'text-slate-100' : 'text-slate-900'} transition-colors duration-300`}>

      {/* ── Scroll progress bar ─────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <div className="h-full shimmer-bar transition-all duration-100" style={{ width: `${scrollPct}%` }} />
      </div>

      {/* ── Custom cursor ───────────────────────────────────── */}
      <div className={`cursor-outer ${cursorBig ? 'expanded' : ''}`} style={{ left: cursor.x, top: cursor.y }} />
      <div className="cursor-dot" style={{ left: cursor.x, top: cursor.y }} />

      {/* ── Background orbs ─────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb-1 absolute w-[600px] h-[600px] rounded-full -top-32 -left-32"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)' }} />
        <div className="orb-2 absolute w-[500px] h-[500px] rounded-full top-1/3 -right-20"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)' }} />
        <div className="orb-3 absolute w-[380px] h-[380px] rounded-full -bottom-10 left-1/3"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)' }} />
      </div>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className={`glass fixed top-0.5 left-0 right-0 z-50 ${navBg} border-b ${border}`}
        style={{ backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="grad-text text-2xl font-black tracking-tight">MK.</span>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex gap-7">
              {['About', 'Skills', 'Projects', 'Journey', 'Contact'].map(s => (
                <a key={s} href={`#${s.toLowerCase()}`}
                  className={`nav-link text-sm font-semibold ${muted} hover:text-cyan-400 transition-colors`}>
                  {s}
                </a>
              ))}
            </div>
            <button onClick={() => setDark(d => !d)}
              className={`${card} border ${border} rounded-xl w-9 h-9 flex items-center justify-center text-cyan-400 hover:border-cyan-400/40 transition-all`}>
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </nav>

      <div className="relative z-10">

        {/* ── HERO ────────────────────────────────────────────── */}
        <section className="min-h-screen flex items-center justify-center px-6 pt-16">
          <div className="max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2.5 mb-8 px-4 py-2 rounded-full border border-cyan-400/30"
                style={{ background: 'rgba(6,182,212,0.07)' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                <span className="text-sm font-semibold text-cyan-400">Open to opportunities</span>
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
              className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
              Hi, I'm <span className="grad-text">Moiz Khan.</span>
            </motion.h1>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-xl md:text-3xl font-bold mb-6 min-h-10 ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
              {typeText}<span className="type-cursor">|</span>
            </motion.div>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className={`text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto ${muted}`}>
              I build robust, end-to-end web applications and integrate AI to create scalable, revolutionary digital products.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-4 justify-center flex-wrap">
              <a href="#projects"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-1"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)', boxShadow: '0 8px 28px rgba(6,182,212,0.35)' }}>
                View My Work <ArrowRight size={15} />
              </a>
              <a href="/resume.pdf" download="Moiz_Khan_Resume.pdf"
                className={`flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm border ${border} ${card} glass transition-all hover:-translate-y-1`}>
                <Download size={15} /> Download Resume
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.5 }}
              className={`mt-20 float ${muted} flex justify-center`}>
              <a href="#about"><ChevronDown size={26} /></a>
            </motion.div>
          </div>
        </section>

        {/* ── STATS ───────────────────────────────────────────── */}
        <Section className="py-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {STATS.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className={`glass ${card} border ${border} rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform`}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <div className="text-3xl font-black mb-1" style={{ color: s.color }}>
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <p className={`text-xs font-semibold ${muted}`}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── ABOUT ───────────────────────────────────────────── */}
        <Section id="about" className="py-20 max-w-5xl mx-auto">
          <Heading sub="Passionate developer. Detail-oriented engineer. Lifelong learner.">
            About <span className="grad-text">Me</span>
          </Heading>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: '⚡', title: 'The Developer',
                body: 'I don\'t just write code — I architect solutions. From a 2-second AI diagnostic engine to a MERN inventory system handling 500+ products, every project I ship is built for scale, speed, and real-world impact.',
                tag: 'Full Stack Engineer',
                tagColor: '#06b6d4',
              },
              {
                icon: '🎓', title: 'The Academic',
                custom: (
                  <div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="text-2xl">🏛️</div>
                      <div>
                        <p className="font-bold text-sm leading-tight">BSc Software Engineering</p>
                        <p className={`text-xs mt-0.5 ${muted}`}>National University of Modern Languages</p>
                        <p className={`text-xs ${muted}`}>Islamabad · Sep 2022 – Present</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(6,182,212,0.15)' }}>
                        <div className="h-full rounded-full shimmer-bar" style={{ width: '97.5%' }} />
                      </div>
                      <span className="text-xs font-black text-cyan-400 whitespace-nowrap">3.9 / 4.0</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border border-cyan-400/30 text-cyan-400"
                      style={{ background: 'rgba(6,182,212,0.08)' }}>
                      🏆 Distinction Level GPA
                    </span>
                  </div>
                ),
              },
              {
                icon: '🌀', title: 'The Human',
                custom: (
                  <div className="space-y-3">
                    <p className={`text-sm leading-relaxed ${muted} mb-4`}>
                      Outside the terminal, I'm building a stronger version of myself — one gym session, music track, and curiosity-driven deep dive at a time.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { emoji: '⚡', text: 'Vibe Coding sessions at midnight' },
                        { emoji: '💪', text: 'Gym — discipline that carries into code' },
                        { emoji: '🎵', text: 'Music fuels the focus' },
                        { emoji: '🌍', text: 'Always exploring what\'s next in tech' },
                      ].map((item, i) => (
                        <div key={i} className={`flex items-center gap-2.5 text-xs font-medium px-3 py-2 rounded-lg border ${border}`}
                          style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
                          <span className="text-base">{item.emoji}</span>
                          <span className={muted}>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              },
            ].map((c, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className={`glass ${card} border ${border} rounded-2xl p-8 hover:-translate-y-1.5 transition-transform duration-300`}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{c.icon}</span>
                  <h3 className="text-lg font-black">{c.title}</h3>
                </div>
                {c.body && (
                  <>
                    <p className={`text-sm leading-relaxed mb-4 ${muted}`}>{c.body}</p>
                    <span className="inline-flex items-center text-xs font-bold px-3 py-1.5 rounded-full"
                      style={{ background: `${c.tagColor}15`, border: `1px solid ${c.tagColor}35`, color: c.tagColor }}>
                      {c.tag}
                    </span>
                  </>
                )}
                {c.custom}
              </motion.div>
            ))}
          </div>

          {/* Currently */}
          <motion.div variants={fadeUp} className={`glass ${card} border ${border} rounded-2xl p-7`}>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              <h3 className="font-black text-sm uppercase tracking-widest text-emerald-400">What I'm up to right now</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {CURRENTLY.map((c, i) => (
                <div key={i} className={`rounded-xl p-4 border ${border} hover:-translate-y-0.5 transition-transform`}
                  style={{ background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
                  <span className="text-2xl block mb-3">{c.icon}</span>
                  <p className="text-xs font-black uppercase tracking-wider mb-1.5" style={{ color: '#06b6d4' }}>{c.label}</p>
                  <p className={`text-xs font-medium leading-snug ${muted}`}>{c.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </Section>

        {/* ── WHAT I DO ────────────────────────────────────────── */}
        <Section className="py-20 max-w-5xl mx-auto">
          <Heading sub="Core services I deliver with precision and care.">
            What I <span className="grad-text">Do</span>
          </Heading>
          <div className="grid md:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className={`glass ${card} border ${border} rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300 group`}
                style={{ borderTop: `2.5px solid ${s.color}` }}>
                <div className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${s.color}18`, color: s.color }}>
                  {s.icon}
                </div>
                <h3 className="text-lg font-black mb-3">{s.title}</h3>
                <p className={`text-sm leading-relaxed mb-5 ${muted}`}>{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {s.tags.map(t => (
                    <span key={t} className="text-xs font-bold px-2.5 py-1 rounded-lg"
                      style={{ background: `${s.color}15`, border: `1px solid ${s.color}35`, color: s.color }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── SKILLS ───────────────────────────────────────────── */}
        <Section id="skills" className="py-20 overflow-hidden">
          <div className="max-w-5xl mx-auto">
            <Heading sub="Technologies I work with daily.">Skills & <span className="grad-text">Technologies</span></Heading>
          </div>

          {SKILL_ROWS.map((row, ri) => (
            <div key={ri} className="overflow-hidden mb-4">
              <div className={`flex gap-4 w-max ${ri % 2 === 0 ? 'marquee-ltr' : 'marquee-rtl'}`}>
                {[...row, ...row].map((skill, si) => (
                  <span key={si}
                    className={`glass ${card} border ${border} text-sm font-semibold px-5 py-2.5 rounded-full whitespace-nowrap hover:-translate-y-0.5 transition-transform`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}

          <div className="max-w-5xl mx-auto mt-14 grid md:grid-cols-2 gap-10">
            {/* Skill bars */}
            <motion.div variants={fadeUp} className={`glass ${card} border ${border} rounded-2xl p-8`}>
              <h3 className="font-black text-base mb-6 flex items-center gap-2">
                <TrendingUp size={17} className="text-cyan-400" /> Proficiency
              </h3>
              {SKILL_BARS.map((s, i) => (
                <SkillBar key={i} {...s} dark={dark} />
              ))}
            </motion.div>

            {/* Skill category tags */}
            <div className="grid grid-cols-1 gap-4">
              {SKILL_CATS.map((cat, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}
                  className={`glass ${card} border ${border} rounded-xl p-5`}>
                  <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: cat.color }}>{cat.label}</h4>
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(s => (
                      <span key={s} className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                        style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}35`, color: cat.color }}>{s}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* ── PROJECTS ─────────────────────────────────────────── */}
        <Section id="projects" className="py-20 max-w-5xl mx-auto">
          <Heading sub="End-to-end applications built from scratch.">Technical <span className="grad-text">Projects</span></Heading>
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}
                className={`glass ${card} border ${border} rounded-2xl p-8 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden`}
                style={{ borderTop: `2.5px solid ${p.accent}` }}>
                <div className="absolute top-0 right-0 text-[110px] opacity-[0.04] select-none pointer-events-none leading-none -mt-2 -mr-2">{p.emoji}</div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-5xl">{p.emoji}</span>
                  <span className="font-black text-2xl opacity-10">{p.num}</span>
                </div>
                <h3 className="text-lg font-black mb-1.5">{p.title}</h3>
                <p className="text-xs font-bold mb-3" style={{ color: p.accent }}>{p.subtitle}</p>
                <p className={`text-sm leading-relaxed mb-5 ${muted}`}>{p.desc}</p>

                {/* Highlights */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {p.highlights.map((h, hi) => (
                    <div key={hi} className="flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: p.accent }}>
                      <CheckCircle2 size={12} /> {h}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-xs font-bold px-2 py-1 rounded-md"
                      style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}35`, color: p.accent }}>{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── JOURNEY / TIMELINE ───────────────────────────────── */}
        <Section id="journey" className="py-20 max-w-3xl mx-auto">
          <Heading sub="Key milestones that shaped my development journey.">
            My <span className="grad-text">Journey</span>
          </Heading>
          <div className="relative pl-12">
            <div className="timeline-line" />
            {TIMELINE.map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="relative mb-8 last:mb-0">
                <div className="timeline-dot" style={{ top: 6, borderColor: item.color, boxShadow: `0 0 12px ${item.color}60` }}>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ color: item.color }}>{item.icon}</div>
                </div>
                <div className={`glass ${card} border ${border} rounded-xl p-5 hover:-translate-y-0.5 transition-transform`}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md" style={{ background: `${item.color}20`, color: item.color }}>{item.year}</span>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                  </div>
                  <p className={`text-xs ${muted} ml-14`} style={{ marginLeft: 0 }}>{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* ── CONTACT ──────────────────────────────────────────── */}
        <Section id="contact" className="py-20 max-w-5xl mx-auto">
          <Heading sub="Let's build something great together.">Get In <span className="grad-text">Touch</span></Heading>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              {[
                { icon: <Mail size={18} />, label: 'Email', value: 'moizkh369@gmail.com', href: 'mailto:moizkh369@gmail.com' },
                { icon: <Phone size={18} />, label: 'Phone', value: '03335016753', href: 'tel:+923335016753' },
                { icon: <MapPin size={18} />, label: 'Location', value: 'H9, Islamabad, Pakistan', href: null },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} custom={i}>
                  {item.href
                    ? <a href={item.href} className={`glass ${card} border ${border} rounded-xl p-5 flex items-center gap-4 hover:-translate-y-0.5 transition-all block`}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-cyan-400" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>{item.icon}</div>
                        <div><p className={`text-xs font-semibold mb-0.5 ${muted}`}>{item.label}</p><p className="text-sm font-bold">{item.value}</p></div>
                      </a>
                    : <div className={`glass ${card} border ${border} rounded-xl p-5 flex items-center gap-4`}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-cyan-400" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.25)' }}>{item.icon}</div>
                        <div><p className={`text-xs font-semibold mb-0.5 ${muted}`}>{item.label}</p><p className="text-sm font-bold">{item.value}</p></div>
                      </div>
                  }
                </motion.div>
              ))}

              {/* Social — Email + LinkedIn only */}
              <motion.div variants={fadeUp} custom={3} className="flex gap-3 mt-1">
                <a href="mailto:moizkh369@gmail.com"
                  className={`glass ${card} border ${border} w-12 h-12 rounded-xl flex items-center justify-center text-cyan-400 hover:-translate-y-1 hover:border-cyan-400/40 transition-all`}
                  title="Email Moiz">
                  <Mail size={18} />
                </a>
                <a href="https://www.linkedin.com/in/moizkhan369" target="_blank" rel="noopener noreferrer"
                  className={`glass ${card} border ${border} w-12 h-12 rounded-xl flex items-center justify-center text-cyan-400 hover:-translate-y-1 hover:border-cyan-400/40 transition-all`}
                  title="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </motion.div>

              {/* Availability badge */}
              <motion.div variants={fadeUp} custom={4}
                className="rounded-xl p-4 border border-emerald-400/20 flex items-center gap-3"
                style={{ background: 'rgba(16,185,129,0.06)' }}>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] flex-shrink-0" />
                <p className="text-sm font-semibold text-emerald-400">Available for full-time & freelance work</p>
              </motion.div>
            </div>

            {/* Contact form */}
            <motion.div variants={fadeUp} custom={1} className={`glass ${card} border ${border} rounded-2xl p-8`}>
              {formSent ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-5">✅</div>
                  <h3 className="text-xl font-black mb-2">Message Sent!</h3>
                  <p className={`text-sm ${muted}`}>Thanks for reaching out. Moiz will get back to you soon.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <h3 className="font-black text-lg mb-1">Send a Message</h3>
                  {['name', 'email'].map(f => (
                    <input key={f} value={form[f]} onChange={e => setForm(p => ({ ...p, [f]: e.target.value }))}
                      placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                      className={`w-full px-4 py-3.5 rounded-xl text-sm border ${border} transition-all`}
                      style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: 'inherit' }} />
                  ))}
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    rows={5} placeholder="Message"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm border ${border} resize-none transition-all`}
                    style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', color: 'inherit' }} />
                  <button onClick={() => { if (form.name && form.email && form.message) setFormSent(true) }}
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)', boxShadow: '0 6px 22px rgba(6,182,212,0.3)' }}>
                    <Send size={15} /> Send Message
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </Section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer className={`border-t ${border} py-8 px-6 text-center`}>
          <p className="grad-text font-black text-xl mb-2">MK.</p>
          <p className={`text-sm ${muted} mb-4`}>Full Stack Web Developer & Software Engineer · Islamabad, Pakistan</p>
          <p className={`text-xs ${muted}`}>© 2025 Moiz Khan — Crafted with <span className="grad-text font-bold">passion & precision.</span></p>
        </footer>

      </div>

      {/* ── FLOATING CHATBOT ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {chatOpen && (
            <motion.div key="chat"
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute bottom-16 right-0 w-[340px] glass border ${border} rounded-2xl overflow-hidden shadow-2xl`}
              style={{ background: dark ? 'rgba(6,10,26,0.97)' : 'rgba(255,255,255,0.97)' }}>

              <div className="flex items-center justify-between px-4 py-3.5"
                style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">🤖</div>
                  <div>
                    <p className="text-white text-sm font-bold leading-none">Moiz-Bot</p>
                    <p className="text-white/70 text-xs mt-0.5">Trained on Moiz's full resume</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)}
                  className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
                  <X size={13} />
                </button>
              </div>

              {/* Quick prompts */}
              {chatMsgs.length === 1 && (
                <div className="px-3 pt-3 flex flex-wrap gap-1.5">
                  {['Skills?', 'Projects?', 'GPA?', 'Hire him?'].map(q => (
                    <button key={q} onClick={() => { setChatInput(q); setTimeout(() => sendChat(), 50) }}
                      className="text-xs px-3 py-1.5 rounded-full border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 transition-colors"
                      style={{ background: 'rgba(6,182,212,0.06)' }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div className="h-64 overflow-y-auto p-4 flex flex-col gap-3">
                {chatMsgs.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.from === 'bot' && (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>🤖</div>
                    )}
                    <div className={`max-w-[78%] text-xs leading-relaxed px-3.5 py-2.5 rounded-2xl ${
                      msg.from === 'user' ? 'text-white rounded-br-sm' : `${dark ? 'bg-white/7' : 'bg-black/5'} rounded-bl-sm`
                    }`} style={msg.from === 'user' ? { background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' } : {}}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {botTyping && (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>🤖</div>
                    <div className={`flex gap-1 px-3.5 py-2.5 rounded-2xl rounded-bl-sm ${dark ? 'bg-white/7' : 'bg-black/5'}`}>
                      {[0,1,2].map(j => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                          style={{ animation: `blink 1.2s ${j*0.2}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className={`flex gap-2 p-3 border-t ${border}`}>
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  placeholder="Ask about Moiz..."
                  className={`flex-1 text-xs px-3.5 py-2.5 rounded-xl border ${border} outline-none`}
                  style={{ background: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', color: 'inherit' }} />
                <button onClick={sendChat}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)' }}>
                  <Send size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button onClick={() => setChatOpen(o => !o)}
          className="pulse-ring relative w-14 h-14 rounded-full text-white text-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105"
          style={{ background: 'linear-gradient(135deg,#06b6d4,#7c3aed)', boxShadow: '0 8px 28px rgba(6,182,212,0.4)' }}>
          <AnimatePresence mode="wait">
            {chatOpen
              ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}><X size={20} /></motion.span>
              : <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>🤖</motion.span>
            }
          </AnimatePresence>
        </button>
      </div>

    </div>
  )
}
