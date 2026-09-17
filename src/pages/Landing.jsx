import React, { useState, useEffect, useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  Mic,
  BrainCircuit,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Star,
  Zap,
  Target,
  Clock,
  Trophy,
  Play,
  MessageSquare,
  BarChart3,
  FileDown,
  Code2,
  Database,
  Layers,
  GraduationCap,
  Briefcase
} from 'lucide-react'
import Navbar from '../components/Navbar'
import SectionSidebar from '../components/SectionSidebar'
import { useInterview } from '../context/InterviewContext'
import { useAuth } from '../context/AuthContext'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import './Landing.css'

gsap.registerPlugin(ScrollTrigger)

/* ── Animated count-up hook ── */
function useCountUp(target, duration = 1800, start = false) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setValue(Math.floor(progress * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return value
}

/* ── FAQ Accordion Item ── */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={18} className={`faq-chevron ${open ? 'rotated' : ''}`} />
      </button>
      <div className="faq-answer-wrapper" style={{ maxHeight: open ? '300px' : '0' }}>
        <p className="faq-answer">{a}</p>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { startSession, setSelectedDomain, setSelectedDifficulty } = useInterview()
  const { isAuthenticated, user, ROLE_HOME, setAuthModalOpen, login } = useAuth()
  const statsRef = useRef(null)
  const mainRef = useRef(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const isInitialMount = useRef(true)

  // Only redirect if user visits landing page while ALREADY authenticated on initial load
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (isAuthenticated && user) {
        navigate(ROLE_HOME[user.role] || '/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, user, ROLE_HOME, navigate])

  // Trigger count-up animation when stats section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  // GSAP ScrollTrigger Animations
  useGSAP(() => {
    // 1. Hero Section reveal
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    heroTl
      .from('.hero-eyebrow', { opacity: 0, y: -20, duration: 0.6, clearProps: 'transform,opacity' })
      .from('.hero-headline', { opacity: 0, y: 30, duration: 0.8, clearProps: 'transform,opacity' }, '-=0.3')
      .from('.hero-sub', { opacity: 0, y: 20, duration: 0.6, clearProps: 'transform,opacity' }, '-=0.4')
      .from('.hero-cta-split > *', { opacity: 0, y: 25, scale: 0.95, duration: 0.6, stagger: 0.15, clearProps: 'transform,opacity' }, '-=0.4')
      .from('.hero-no-credit', { opacity: 0, duration: 0.5, clearProps: 'opacity' }, '-=0.2')

    // 2. Stats Section Reveal on Scroll
    gsap.from('.stat-pill', {
      opacity: 0,
      y: 40,
      scale: 0.9,
      duration: 0.6,
      stagger: 0.12,
      ease: 'back.out(1.2)',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.stats-section',
        start: 'top 90%',
        once: true
      }
    })

    // 3. Feature Cards Stagger Scroll Animation
    gsap.from('.feature-card', {
      opacity: 0,
      y: 50,
      scale: 0.92,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.features-grid',
        start: 'top 85%',
        once: true
      }
    })

    // 4. How It Works Steps Scroll Animation
    gsap.from('.step-card', {
      opacity: 0,
      y: 45,
      x: -20,
      duration: 0.7,
      stagger: 0.2,
      ease: 'back.out(1.1)',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.steps-row',
        start: 'top 85%',
        once: true
      }
    })

    // 5. Testimonial Cards Scroll Reveal
    gsap.from('.testimonial-card', {
      opacity: 0,
      y: 50,
      rotation: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power3.out',
      clearProps: 'transform,opacity,rotate',
      scrollTrigger: {
        trigger: '.testimonials-grid',
        start: 'top 85%',
        once: true
      }
    })

    // 6. FAQ Items Cascade
    gsap.from('.faq-item', {
      opacity: 0,
      y: 30,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.faq-list',
        start: 'top 85%',
        once: true
      }
    })

    // 7. CTA Banner Pulsing Scale Scroll Reveal
    gsap.from('.cta-banner-card', {
      opacity: 0,
      y: 60,
      scale: 0.9,
      duration: 0.9,
      ease: 'back.out(1.2)',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.cta-banner-section',
        start: 'top 85%',
        once: true
      }
    })
  }, { scope: mainRef })

  const sessions   = useCountUp(382,  1600, statsVisible)
  const accuracy   = useCountUp(984,  1800, statsVisible)
  const latency    = useCountUp(14,   1400, statsVisible)
  const avgScore   = useCountUp(884,  1800, statsVisible)

  const openDemoAccess = (role = 'candidate') => {
    login(
      role === 'recruiter' ? 'sarah.chen@techrecruiters.io' : 'alex.rivera@example.com',
      'password',
      role
    )
    navigate(ROLE_HOME[role] || '/simulator')
  }

  const FEATURES = [
    {
      icon: <Mic size={22} />,
      title: 'Speech & Text Capture',
      desc: 'Speak naturally using the browser Web Speech API or type technical answers. Features live audio waveforms and editable transcripts.',
      tag: 'Live Mic',
      color: 'feature-blue'
    },
    {
      icon: <BrainCircuit size={22} />,
      title: 'Evidence-Grounded AI Feedback',
      desc: 'RAG-supported evaluation scores answers on Technical Accuracy, Communication, and Problem Solving with zero hallucinations.',
      tag: 'AI Powered',
      color: 'feature-violet'
    },
    {
      icon: <UserCheck size={22} />,
      title: 'Recruiter Screening Portal',
      desc: 'HR candidate directory with domain-readiness scores, AI summaries, and human decision notes. Decision-support labeled.',
      tag: 'HR Ready',
      color: 'feature-green'
    },
    {
      icon: <Code2 size={22} />,
      title: 'DSA Question Bank',
      desc: 'Arrays, Trees, Graphs, Dynamic Programming, Heaps, and Sorting. Spoken complexity analysis and Time/Space O(N) evaluation.',
      tag: 'DSA',
      color: 'feature-orange'
    },
    {
      icon: <Database size={22} />,
      title: 'DBMS Track',
      desc: 'ACID properties, B+ Tree Indexing, SQL Joins, Transactions, and Normalization with query optimization feedback.',
      tag: 'DBMS',
      color: 'feature-teal'
    },
    {
      icon: <Layers size={22} />,
      title: 'Full Stack Track',
      desc: 'React, Node.js, Express, REST APIs, JWT Auth, microservices, and web performance with architecture evaluation.',
      tag: 'Full Stack',
      color: 'feature-rose'
    },
  ]

  const STEPS = [
    { icon: <Target size={28} />, step: '01', title: 'Choose Your Domain', desc: 'Pick DSA, DBMS, or Full Stack. Select your difficulty level from Easy to Hard.' },
    { icon: <MessageSquare size={28} />, step: '02', title: 'Answer AI Questions', desc: 'Speak or type answers to dynamic, role-relevant technical interview questions.' },
    { icon: <BarChart3 size={28} />, step: '03', title: 'Get Your AI Report', desc: 'Receive grounded feedback on accuracy, clarity, and efficiency. Download your PDF report.' },
  ]

  const TESTIMONIALS = [
    {
      name: 'Love Chauhan',
      role: 'Software Engineer Candidate',
      avatar: 'LC',
      avatarBg: '#2563eb',
      quote: 'The DSA track is incredibly realistic. The AI feedback was specific and grounded — it didn\'t just say "good job", it explained what I missed in my binary search implementation.',
      stars: 5,
      tag: 'Candidate'
    },
    {
      name: 'Sarah Chen',
      role: 'Senior Technical Recruiter',
      avatar: 'SC',
      avatarBg: '#ea580c',
      quote: 'We screened 28 candidates in a fraction of the time. The readiness scores are consistent, objective, and the PDF reports make shortlisting incredibly easy.',
      stars: 5,
      tag: 'Recruiter'
    },
    {
      name: 'Ravi Mehta',
      role: 'Full Stack Engineer Candidate',
      avatar: 'RM',
      avatarBg: '#059669',
      quote: 'I went from 72% to 91% readiness over 6 sessions. The progress chart showed exactly where I improved. Highly recommend before any FAANG interview.',
      stars: 5,
      tag: 'Candidate'
    },
  ]

  const FAQS = [
    {
      q: 'Is this a real AI interview or pre-recorded questions?',
      a: 'Every question is dynamically generated and evaluated using a large language model with RAG grounding. There are no pre-recorded answers — every session is unique.'
    },
    {
      q: 'Can I speak my answers instead of typing?',
      a: 'Yes. The platform supports the browser Web Speech API for live speech recognition with an editable transcript. Text entry is also fully supported as a fallback.'
    },
    {
      q: 'How is the feedback different from other platforms?',
      a: 'Our feedback is evidence-grounded — every claim is traceable to your actual answer. We score Technical Accuracy, Communication Clarity, and Problem-Solving approach with zero hallucinated claims.'
    },
    {
      q: 'Can recruiters see my interview sessions?',
      a: 'Only if your employer has a Recruiter account on the platform. The system uses strict RBAC data isolation — candidates and recruiters have completely separate data views.'
    },
    {
      q: 'Can I export my results?',
      a: 'Yes. Every completed session generates a downloadable PDF report with your scores, feedback, and recommendations. CSV export is available for recruiters.'
    },
  ]

  return (
    <div className="landing-page" ref={mainRef}>
      <Navbar />
      <SectionSidebar />

      {/* ─────────────────────────────────────
          1. HERO
      ───────────────────────────────────── */}
      <section className="hero-section" id="hero">
        <div className="container hero-container">
          <div className="hero-eyebrow">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>AI-Powered Technical Interview Coach</span>
          </div>

          <h1 className="hero-headline">
            Ace technical interviews<br />
            <span className="hero-headline-accent">before the real one.</span>
          </h1>

          <p className="hero-sub">
            Realistic mock interviews across DSA, DBMS, and Full Stack. Speak or type your answers,
            get evidence-grounded AI feedback, and track your readiness over time.
          </p>

          <div className="hero-cta-split">
            <button className="hero-cta-card cta-candidate" onClick={() => openDemoAccess('candidate')}>
              <div className="cta-card-icon cta-icon-blue"><GraduationCap size={20} /></div>
              <div className="cta-card-body">
                <div className="cta-card-title">I'm a Candidate</div>
                <div className="cta-card-sub">Practice, get scored, track progress</div>
              </div>
              <ArrowRight size={18} className="cta-card-arrow" />
            </button>
            <button className="hero-cta-card cta-recruiter" onClick={() => openDemoAccess('recruiter')}>
              <div className="cta-card-icon cta-icon-orange"><Briefcase size={20} /></div>
              <div className="cta-card-body">
                <div className="cta-card-title">I'm a Recruiter</div>
                <div className="cta-card-sub">Screen candidates, view AI summaries</div>
              </div>
              <ArrowRight size={18} className="cta-card-arrow" />
            </button>
          </div>

          <p className="hero-no-credit">No credit card · No setup · Start in 30 seconds</p>
        </div>
      </section>

      {/* ─────────────────────────────────────
          2. STATS TICKER
      ───────────────────────────────────── */}
      <section className="stats-section" ref={statsRef} id="stats">
        <div className="container stats-grid">
          <div className="stat-pill">
            <span className="stat-number">{sessions}<span className="stat-unit">+</span></span>
            <span className="stat-label">Sessions Run Today</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-number">{(accuracy / 10).toFixed(1)}<span className="stat-unit">%</span></span>
            <span className="stat-label">Groundedness Rate</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-number">{(latency / 10).toFixed(1)}<span className="stat-unit">s</span></span>
            <span className="stat-label">Speech-to-Text Latency</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-pill">
            <span className="stat-number">{(avgScore / 10).toFixed(1)}</span>
            <span className="stat-label">Avg Readiness Score</span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          3. FEATURE GRID
      ───────────────────────────────────── */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything you need to prepare smarter</h2>
            <p className="section-sub">Six core capabilities, built for candidates and hiring teams.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className={`feature-card ${f.color}`}>
                <div className="feature-icon-box">{f.icon}</div>
                <span className="feature-tag">{f.tag}</span>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          4. HOW IT WORKS
      ───────────────────────────────────── */}
      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How it works</h2>
            <p className="section-sub">From zero to AI-graded interview feedback in under 3 minutes.</p>
          </div>
          <div className="steps-row">
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div className="step-card">
                  <div className="step-num">{s.step}</div>
                  <div className="step-icon-ring">{s.icon}</div>
                  <h3 className="step-title">{s.title}</h3>
                  <p className="step-desc">{s.desc}</p>
                </div>
                {i < STEPS.length - 1 && <div className="step-connector"><ArrowRight size={20} /></div>}
              </React.Fragment>
            ))}
          </div>
          <div className="how-cta-center">
            <button className="btn-dark-pill" onClick={() => openDemoAccess('candidate')}>
              <Play size={15} fill="currentColor" /> Start Your First Session
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          5. TESTIMONIALS
      ───────────────────────────────────── */}
      <section className="section testimonials-section" id="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What people are saying</h2>
            <p className="section-sub">From candidates who aced their interviews, and recruiters who saved hours.</p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.avatarBg }}>{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                  <span className={`testimonial-tag tag-${t.tag.toLowerCase()}`}>{t.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          6. FAQ
      ───────────────────────────────────── */}
      <section className="section faq-section" id="faq">
        <div className="container faq-container">
          <div className="section-header">
            <h2 className="section-title">Frequently asked questions</h2>
            <p className="section-sub">Everything you need to know before you start.</p>
          </div>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          7. CTA BANNER
      ───────────────────────────────────── */}
      <section className="cta-banner-section">
        <div className="container">
          <div className="cta-banner-card">
            <div className="cta-banner-glow" />
            <Trophy size={36} className="cta-banner-icon" />
            <h2 className="cta-banner-title">Ready to land your dream role?</h2>
            <p className="cta-banner-sub">
              Join candidates already practicing on AI Interview Coach. No cost. No setup. Start now.
            </p>
            <div className="cta-banner-actions">
              <button className="btn-white-solid" onClick={() => openDemoAccess('candidate')}>
                Try Candidate Demo
              </button>
              <button className="btn-white-outline" onClick={() => openDemoAccess('recruiter')}>
                Try Recruiter Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────
          8. FOOTER
      ───────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <Sparkles size={14} />
            </div>
            <span className="footer-brand-name">AI Interview Coach</span>
            <span className="footer-copy">© 2026 EduTech &amp; HR Tech Platform</span>
          </div>
          <div className="footer-links">
            <button onClick={() => openDemoAccess('candidate')} className="footer-link">Candidate Login</button>
            <button onClick={() => openDemoAccess('recruiter')} className="footer-link">Recruiter Login</button>
            <button onClick={() => openDemoAccess('admin')} className="footer-link">Admin</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
