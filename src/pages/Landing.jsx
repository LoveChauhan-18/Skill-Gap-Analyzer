import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Play,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Mic,
  BrainCircuit,
  LineChart,
  UserCheck,
  CheckCircle2,
  Search,
  Bell,
  Share2,
  Download,
  Calendar,
  Code2,
  Database,
  Layers,
  ShieldCheck,
  FileSpreadsheet,
  Terminal,
  Activity,
  Award
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { useInterview } from '../context/InterviewContext'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const { startSession, setSelectedDomain, setSelectedDifficulty } = useInterview()
  const { switchRole } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')

  const handleStartQuickSession = (domain) => {
    setSelectedDomain(domain)
    setSelectedDifficulty('Medium')
    startSession(domain, 'Medium')
    navigate('/simulator')
  }

  return (
    <div className="cirrus-landing-page">
      <Navbar />

      {/* ============================================================
          HERO SECTION (PRD Compliant AI Interview Coach)
      ============================================================ */}
      <section className="cirrus-hero-section">
        <div className="container hero-container">
          {/* Main Headline */}
          <h1 className="hero-display-title">
            Master technical interviews <br className="desktop-only" />
            with <span className="serif-accent">an</span> AI Coach.
          </h1>

          {/* Subtitle */}
          <p className="hero-display-sub">
            AI Interview Coach simulates realistic mock technical interviews across <strong>DSA</strong>,{' '}
            <strong>DBMS</strong>, and <strong>Full Stack</strong> domains. Evaluate spoken or typed answers, 
            receive actionable feedback, and streamline recruiter candidate screening.
          </p>

          {/* Pill CTA Group */}
          <div className="hero-cta-pill-group">
            <Link to="/simulator" className="btn-black-pill hero-primary-btn">
              <Play size={15} fill="currentColor" />
              <span>Start Mock Interview</span>
            </Link>
            <Link to="/dashboard" className="btn-white-pill hero-secondary-btn">
              <LineChart size={17} />
              <span>View Score Dashboard</span>
            </Link>
          </div>

          {/* ============================================================
              HERO EMBEDDED DASHBOARD CARD PREVIEW (PRD Metrics)
          ============================================================ */}
          <div className="hero-dashboard-preview-card cirrus-card">
            {/* Top Dashboard Header Navigation */}
            <div className="dash-card-header">
              <div className="dash-tabs-pill">
                {['Overview', 'Simulator', 'Candidate Screening', 'Analytics'].map((tab) => (
                  <button
                    key={tab}
                    className={`dash-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'Overview' && <span className="tab-icon">⊞</span>}
                    {tab}
                    {tab === 'Candidate Screening' && <span className="tab-count font-mono">28</span>}
                  </button>
                ))}
              </div>

              <div className="dash-search-right">
                <div className="dash-search-input-box">
                  <Search size={14} className="search-ic" />
                  <input type="text" placeholder="Search sessions, candidates..." readOnly />
                </div>
                <button className="dash-icon-btn"><Bell size={15} /></button>
                <div className="dash-avatar-badge">AI</div>
              </div>
            </div>

            {/* Main Dashboard Body */}
            <div className="dash-card-body">
              {/* Left Column: Interview Overview */}
              <div className="dash-main-column">
                <div className="dash-section-title-row">
                  <div>
                    <h2 className="dash-title">Interview readiness overview</h2>
                    <p className="dash-sub">Real-time evaluation signals across DSA, DBMS, and Full Stack rounds.</p>
                  </div>
                  <div className="dash-action-pills">
                    <button className="pill-sub-btn"><Calendar size={13} /> 7 days</button>
                    <button className="pill-sub-btn"><Download size={13} /> Export PDF</button>
                    <button className="pill-black-sm"><Share2 size={13} /> Share</button>
                  </div>
                </div>

                {/* Metric Strip (4 Stat Cards from PRD) */}
                <div className="dash-metrics-strip">
                  <div className="dash-stat-box">
                    <div className="stat-hdr">⚡ Sessions Run Today</div>
                    <div className="stat-val font-display">382</div>
                    <div className="stat-trend trend-up">↑ 18% wow</div>
                  </div>
                  <div className="dash-stat-box">
                    <div className="stat-hdr">🎯 Groundedness Rate</div>
                    <div className="stat-val font-display">98.4%</div>
                    <div className="stat-trend trend-up">↑ Zero hallucinated claims</div>
                  </div>
                  <div className="dash-stat-box">
                    <div className="stat-hdr">⏱ Speech-to-Text Latency</div>
                    <div className="stat-val font-display">1.4s</div>
                    <div className="stat-trend trend-up">↑ 12% faster</div>
                  </div>
                  <div className="dash-stat-box">
                    <div className="stat-hdr">🏆 Avg Readiness Score</div>
                    <div className="stat-val font-display">88.4</div>
                    <div className="stat-trend trend-up">↑ 14% improvement</div>
                  </div>
                </div>

                {/* Multi Progress Bar (Domain Coverage) */}
                <div className="dash-multi-progress-bar">
                  <div className="bar-seg seg-blue" style={{ width: '45%' }} title="DSA" />
                  <div className="bar-seg seg-orange" style={{ width: '30%' }} title="DBMS" />
                  <div className="bar-seg seg-green" style={{ width: '25%' }} title="Full Stack" />
                </div>

                {/* Stacked Bar Chart Section (Candidate Score Trends) */}
                <div className="dash-chart-container">
                  <div className="chart-header-row">
                    <div>
                      <h3 className="chart-title">Candidate Performance Trends</h3>
                      <span className="chart-subtitle trend-up">↑ 18% score growth over repeated sessions</span>
                    </div>
                    <div className="chart-legend">
                      <span className="legend-item"><span className="leg-dot dot-blue" /> DSA</span>
                      <span className="legend-item"><span className="leg-dot dot-orange" /> DBMS</span>
                      <span className="legend-item"><span className="leg-dot dot-green" /> Full Stack</span>
                      <button className="view-chart-btn" onClick={() => navigate('/dashboard')}>View Full ↗</button>
                    </div>
                  </div>

                  {/* Visual Bar Chart */}
                  <div className="chart-bars-wrapper">
                    {[
                      { month: 'Session 1', blue: 35, orange: 15 },
                      { month: 'Session 2', blue: 45, orange: 20 },
                      { month: 'Session 3', blue: 55, orange: 22 },
                      { month: 'Session 4', blue: 68, orange: 25 },
                      { month: 'Session 5', blue: 82, orange: 28 },
                      { month: 'Session 6', blue: 95, orange: 32, tooltip: true },
                      { month: 'Session 7', blue: 90, orange: 30 },
                      { month: 'Session 8', blue: 110, orange: 35 },
                      { month: 'Session 9', blue: 125, orange: 38 },
                      { month: 'Next', dashed: true },
                    ].map((item, idx) => (
                      <div key={idx} className="chart-col">
                        {item.tooltip && (
                          <div className="chart-tooltip-box">
                            <div className="tt-date font-mono">Session #6 Evaluation</div>
                            <div className="tt-row"><span className="leg-dot dot-blue" /> DSA Score: <strong>92/100</strong></div>
                            <div className="tt-row"><span className="leg-dot dot-orange" /> DBMS Score: <strong>88/100</strong></div>
                          </div>
                        )}
                        <div className="bar-stack">
                          {item.dashed ? (
                            <div className="bar-dashed-placeholder" style={{ height: '90px' }} />
                          ) : (
                            <>
                              <div className="bar-seg-orange" style={{ height: `${item.orange * 1.2}px` }} />
                              <div className="bar-seg-blue" style={{ height: `${item.blue * 1.2}px` }} />
                            </>
                          )}
                        </div>
                        <span className="col-month font-mono">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: AI Suggestion & Candidate Readiness */}
              <div className="dash-side-column">
                {/* AI Evidence Feedback Card */}
                <div className="side-card ai-suggestions-panel">
                  <div className="chat-bubbles-stack">
                    <div className="chat-bubble left-bubble">"Your explanation of B+ tree indexing is accurate."</div>
                    <div className="chat-bubble right-bubble">"Consider mentioning node splitting time complexity O(log N)."</div>
                    <div className="chat-bubble ai-generating-pill">
                      <Sparkles size={12} className="sparkle-ic" /> Grounding feedback with LLM...
                    </div>
                  </div>
                  <div className="side-card-footer">
                    <h4 className="side-card-title">Evidence-Grounded Feedback</h4>
                    <p className="side-card-desc">Evaluates speech transcript & text answers with zero hallucination. Traceable to actual answer content.</p>
                  </div>
                </div>

                {/* Candidate Readiness Gauge */}
                <div className="side-card lead-quality-panel">
                  <div className="gauge-header">
                    <span className="gauge-title">Candidate Readiness Index</span>
                    <span className="gauge-dots">•••</span>
                  </div>
                  <div className="gauge-visual-container">
                    <svg viewBox="0 0 100 55" className="gauge-svg">
                      <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                      <path d="M 10 50 A 40 40 0 0 1 85 40" fill="none" stroke="url(#gaugeGradient)" strokeWidth="8" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="gauge-center-text">
                      <span className="gauge-val font-display">1,420</span>
                      <span className="gauge-lbl">sessions completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          3-CARD FEATURE GRID SECTION (PRD Features)
      ============================================================ */}
      <section className="cirrus-section section">
        <div className="container">
          <div className="three-cards-grid">
            {/* Card 1: Speech & Text Answer Capture */}
            <div className="cirrus-feature-card cirrus-card">
              <div className="card-badge-icon">
                <Mic size={18} />
              </div>
              <h3 className="card-title">Speech & Text Answer Capture</h3>
              <p className="card-description">
                Speak naturally using the browser <em>Web Speech API</em> or type technical code answers. Features live audio waveforms, editable transcripts, and text fallback.
              </p>
              <div className="card-inner-preview">
                <div className="preview-channel-item">
                  <span className="ch-icon">🎙️</span> Speech Recognition <span className="pill-live-green">live mic</span>
                </div>
                <div className="preview-channel-item">
                  <span className="ch-icon">✏️</span> Editable Transcript <span className="pill-live-green">active</span>
                </div>
                <div className="preview-channel-item muted">
                  <span className="ch-icon">💻</span> Text & Code Fallback <span className="pill-syncing">ready</span>
                </div>
              </div>
            </div>

            {/* Card 2: Evidence-Grounded LLM Feedback */}
            <div className="cirrus-feature-card cirrus-card">
              <div className="card-badge-icon">
                <BrainCircuit size={18} />
              </div>
              <h3 className="card-title">Evidence-Grounded AI Feedback</h3>
              <p className="card-description">
                RAG-supported evaluation scores answers on <em>Technical Accuracy</em>, <em>Communication</em>, and <em>Problem Solving</em> with zero unsupported claims.
              </p>
              <div className="card-inner-preview">
                <div className="progress-bar-line">
                  <span className="lbl">Accuracy</span>
                  <div className="bar-track"><div className="bar-fill blue" style={{ width: '88%' }} /></div>
                  <span className="val font-mono">88%</span>
                </div>
                <div className="progress-bar-line">
                  <span className="lbl">Clarity</span>
                  <div className="bar-track"><div className="bar-fill orange" style={{ width: '92%' }} /></div>
                  <span className="val font-mono">92%</span>
                </div>
                <div className="progress-bar-line">
                  <span className="lbl">Efficiency</span>
                  <div className="bar-track"><div className="bar-fill green" style={{ width: '84%' }} /></div>
                  <span className="val font-mono">84%</span>
                </div>
              </div>
            </div>

            {/* Card 3: Recruiter Screening & Decision Support */}
            <div className="cirrus-feature-card cirrus-card">
              <div className="card-badge-icon">
                <UserCheck size={18} />
              </div>
              <h3 className="card-title">Recruiter Screening Portal</h3>
              <p className="card-description">
                HR candidate directory with domain-readiness scores, AI summaries, and human decision notes. <em>Decision-support labeled</em> (human review required).
              </p>
              <div className="card-inner-preview">
                <div className="metric-row-sm">
                  <span className="lbl font-mono">👤 Candidate Screening</span>
                  <span className="val font-mono">28 candidates</span>
                </div>
                <div className="metric-row-sm">
                  <span className="lbl font-mono">🛡 RBAC Data Isolation</span>
                  <span className="val font-mono font-weight-600">Enforced</span>
                </div>
                <div className="metric-row-sm">
                  <span className="lbl font-mono">📄 PDF / CSV Export</span>
                  <span className="val font-mono">Supported</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SPLIT FEATURE BLOCK (Session Lifecycle & PRD Requirements)
      ============================================================ */}
      <section className="cirrus-split-section section">
        <div className="container">
          <div className="split-layout-grid">
            {/* Left Column Text */}
            <div className="split-text-col">
              <h2 className="split-headline font-display">
                Mock interview prep stops <br />
                being stressful and expensive.
              </h2>
              <p className="split-sub">
                Practice technical questions anytime with objective, repeatable feedback. Human mock interviews are expensive and hard to schedule at scale—AI Interview Coach provides structured preparation in seconds.
              </p>

              <div className="bullet-points-list">
                <div className="bullet-item">
                  <div className="check-badge"><CheckCircle2 size={16} /></div>
                  <div>
                    <h4 className="bullet-title">Structured 3-Domain Question Bank</h4>
                    <p className="bullet-desc">Tuned for Data Structures & Algorithms, DBMS, and Full Stack Web Development.</p>
                  </div>
                </div>

                <div className="bullet-item">
                  <div className="check-badge"><CheckCircle2 size={16} /></div>
                  <div>
                    <h4 className="bullet-title">Session State Lifecycle Management</h4>
                    <p className="bullet-desc">Tracked states: SCHEDULED → IN_PROGRESS → PROCESSING_FEEDBACK → COMPLETED.</p>
                  </div>
                </div>

                <div className="bullet-item">
                  <div className="check-badge"><CheckCircle2 size={16} /></div>
                  <div>
                    <h4 className="bullet-title">Downloadable Reports & Analytics</h4>
                    <p className="bullet-desc">Export comprehensive PDF/CSV session summaries for archiving or sharing with hiring managers.</p>
                  </div>
                </div>
              </div>

              <div className="split-cta-row">
                <Link to="/simulator" className="btn-black-pill">
                  <Play size={15} /> Start Mock Simulator
                </Link>
                <Link to="/recruiter" className="btn-white-pill">
                  Explore Recruiter Portal <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right Column Floating Session Preview Card */}
            <div className="split-card-col">
              <div className="floating-inbox-card cirrus-card">
                <div className="inbox-card-hdr">
                  <div className="inbox-title font-display">Candidate Directory <span className="pill-badge-black font-mono">28 candidates</span></div>
                  <div className="inbox-search"><Search size={13} /> Filter candidates</div>
                </div>

                <div className="inbox-threads-stack">
                  <div className="thread-item active">
                    <div className="thread-avatar">LC</div>
                    <div className="thread-content">
                      <div className="thread-top">
                        <span className="thread-name">Love Chauhan</span>
                        <span className="status-pill-black font-mono">92/100 Recommended</span>
                      </div>
                      <p className="thread-snippet">DSA: 92% · DBMS: 88% · Full Stack: 94%. Strong problem solving in graph traversal.</p>
                    </div>
                  </div>

                  <div className="thread-item">
                    <div className="thread-avatar">MR</div>
                    <div className="thread-content">
                      <div className="thread-top">
                        <span className="thread-name">Maya Roussel</span>
                        <span className="status-pill-outline font-mono">88/100 Recommended</span>
                      </div>
                      <p className="thread-snippet">DBMS: 90% · Full Stack: 86%. Clear explanation of ACID transactions & isolation levels.</p>
                    </div>
                  </div>

                  <div className="thread-item">
                    <div className="thread-avatar">JT</div>
                    <div className="thread-content">
                      <div className="thread-top">
                        <span className="thread-name">Jonas T.</span>
                        <span className="status-pill-outline font-mono">84/100 Review</span>
                      </div>
                      <p className="thread-snippet">DSA: 84% · Good understanding of dynamic programming memoization.</p>
                    </div>
                  </div>

                  <div className="thread-item">
                    <div className="thread-avatar">AO</div>
                    <div className="thread-content">
                      <div className="thread-top">
                        <span className="thread-name">Aiko Ono</span>
                        <span className="status-pill-orange font-mono">Needs Practice</span>
                      </div>
                      <p className="thread-snippet">Full Stack: 76% · Needs review on React hooks closure scope & dependency arrays.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          TECHNICAL DOMAIN TRACKS SECTION (PRD Compliant)
      ============================================================ */}
      <section className="cirrus-pricing-section section">
        <div className="container">
          <div className="pricing-header-center">
            <h2 className="pricing-title font-display">Select Your Technical Practice Domain</h2>
            <p className="pricing-sub">Practice dynamic questions generated and evaluated across three core engineering tracks.</p>
          </div>

          <div className="pricing-cards-grid">
            {/* Track 1: DSA */}
            <div className="pricing-card cirrus-card">
              <div className="card-badge-icon">
                <Code2 size={20} />
              </div>
              <div className="pricing-card-name font-display">Data Structures & Algorithms</div>
              <p className="pricing-desc">Arrays, Trees, Graphs, Dynamic Programming, Heaps, and Sorting algorithms.</p>
              <ul className="pricing-features-list">
                <li><CheckCircle2 size={15} className="ic-check" /> 6 Curated questions</li>
                <li><CheckCircle2 size={15} className="ic-check" /> Spoken complexity analysis</li>
                <li><CheckCircle2 size={15} className="ic-check" /> Time/Space O(N) evaluation</li>
              </ul>
              <button className="btn-white-pill full-width-btn" onClick={() => handleStartQuickSession('DSA')}>
                Practice DSA Track
              </button>
            </div>

            {/* Track 2: DBMS */}
            <div className="pricing-card cirrus-card recommended-pricing-card">
              <div className="pricing-badge-row">
                <div className="card-badge-icon">
                  <Database size={20} />
                </div>
                <span className="badge-black-sm font-mono">Popular</span>
              </div>
              <div className="pricing-card-name font-display">Database Management</div>
              <p className="pricing-desc">ACID properties, B+ Tree Indexing, SQL Joins, Transactions, and Normalization.</p>
              <ul className="pricing-features-list">
                <li><CheckCircle2 size={15} className="ic-check" /> 6 Curated questions</li>
                <li><CheckCircle2 size={15} className="ic-check" /> Query optimization feedback</li>
                <li><CheckCircle2 size={15} className="ic-check" /> Transaction isolation levels</li>
              </ul>
              <button className="btn-black-pill full-width-btn" onClick={() => handleStartQuickSession('DBMS')}>
                Practice DBMS Track
              </button>
            </div>

            {/* Track 3: Full Stack */}
            <div className="pricing-card cirrus-card">
              <div className="card-badge-icon">
                <Layers size={20} />
              </div>
              <div className="pricing-card-name font-display">Full Stack Web Development</div>
              <p className="pricing-desc">React, Node.js, Express, REST APIs, JWT Auth, microservices, and web performance.</p>
              <ul className="pricing-features-list">
                <li><CheckCircle2 size={15} className="ic-check" /> 6 Curated questions</li>
                <li><CheckCircle2 size={15} className="ic-check" /> Architecture & API design</li>
                <li><CheckCircle2 size={15} className="ic-check" /> State management evaluation</li>
              </ul>
              <button className="btn-white-pill full-width-btn" onClick={() => handleStartQuickSession('Full Stack')}>
                Practice Full Stack Track
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="cirrus-footer">
        <div className="container footer-container">
          <div className="footer-left">
            <div className="cirrus-asterisk-icon sm"><Sparkles size={13} /></div>
            <span className="font-display footer-brand">AI Interview Coach</span>
            <span className="footer-copy font-mono">© 2026 EduTech & HR Tech Platform. GenAI Technical Decision Support.</span>
          </div>
          <div className="footer-links-row">
            <Link to="/simulator">Simulator</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/recruiter">Recruiter</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
