import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, BarChart, Bar, Cell
} from 'recharts'
import {
  ArrowRight, Download, Share2, TrendingUp, Target,
  BookOpen, CheckCircle, AlertCircle, Clock, Star,
  ChevronRight, Zap, BarChart2
} from 'lucide-react'
import Navbar from '../components/Navbar'
import AnimatedBackground from '../components/AnimatedBackground'
import './Results.css'

/* ── Mock data generator (based on selected skills) ── */
function generateGapData(selectedSkills = [], role = 'Senior Frontend Engineer') {
  const allRequired = {
    'Senior Frontend Engineer': [
      { skill: 'React', weight: 95 },
      { skill: 'TypeScript', weight: 90 },
      { skill: 'Node.js', weight: 80 },
      { skill: 'Testing (Jest)', weight: 85 },
      { skill: 'AWS / Cloud', weight: 70 },
      { skill: 'CI/CD', weight: 75 },
      { skill: 'GraphQL', weight: 65 },
      { skill: 'Performance Opt.', weight: 80 },
    ],
    'Full Stack Developer': [
      { skill: 'React', weight: 90 },
      { skill: 'Node.js', weight: 90 },
      { skill: 'PostgreSQL', weight: 85 },
      { skill: 'TypeScript', weight: 80 },
      { skill: 'REST APIs', weight: 85 },
      { skill: 'Docker', weight: 70 },
      { skill: 'AWS', weight: 65 },
      { skill: 'Testing', weight: 75 },
    ],
  }

  const required = allRequired[role] || allRequired['Senior Frontend Engineer']

  return required.map(req => {
    const have = selectedSkills.some(s =>
      s.toLowerCase().includes(req.skill.toLowerCase().split(' ')[0].toLowerCase()) ||
      req.skill.toLowerCase().includes(s.toLowerCase().split(' ')[0].toLowerCase())
    )
    const yourLevel = have ? Math.floor(Math.random() * 30) + 60 : Math.floor(Math.random() * 30) + 10
    return {
      skill: req.skill,
      required: req.weight,
      you: yourLevel,
      gap: Math.max(0, req.weight - yourLevel),
      have,
    }
  })
}

const RESOURCES = {
  'TypeScript': [
    { title: 'TypeScript Deep Dive', type: 'Book', time: '20h', url: '#' },
    { title: 'TypeScript for React Devs', type: 'Course', time: '8h', url: '#' },
  ],
  'AWS / Cloud': [
    { title: 'AWS Solutions Architect', type: 'Certification', time: '40h', url: '#' },
    { title: 'Cloud Practitioner Essentials', type: 'Course', time: '12h', url: '#' },
  ],
  'CI/CD': [
    { title: 'GitHub Actions in Practice', type: 'Course', time: '6h', url: '#' },
    { title: 'DevOps Fundamentals', type: 'Course', time: '15h', url: '#' },
  ],
  'Testing (Jest)': [
    { title: 'Testing React Applications', type: 'Course', time: '10h', url: '#' },
  ],
}

const TREND_DATA = [
  { month: 'Apr', score: 42 },
  { month: 'May', score: 51 },
  { month: 'Jun', score: 58 },
  { month: 'Jul', score: 63 },
  { month: 'Aug', score: 72 },
  { month: 'Sep', score: 78 },
]

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <BarChart2 size={15} /> },
  { id: 'gaps', label: 'Skill Gaps', icon: <Target size={15} /> },
  { id: 'resources', label: 'Learning Path', icon: <BookOpen size={15} /> },
  { id: 'progress', label: 'Progress', icon: <TrendingUp size={15} /> },
]

export default function Results() {
  const { state } = useLocation()
  const skills = state?.skills || ['React', 'JavaScript', 'HTML/CSS', 'Node.js']
  const role = state?.role || 'Senior Frontend Engineer'
  const experience = state?.experience || 'Mid-Level (2-5 yrs)'

  const [activeNav, setActiveNav] = useState('overview')
  const [gapData] = useState(() => generateGapData(skills, role))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400)
    return () => clearTimeout(t)
  }, [])

  const matchScore = Math.round(
    gapData.reduce((acc, d) => acc + Math.min(d.you / d.required, 1), 0) / gapData.length * 100
  )
  const gapsCount = gapData.filter(d => d.gap > 20).length
  const skillsMatched = gapData.filter(d => d.have).length

  const radarData = gapData.map(d => ({
    skill: d.skill.split(' ')[0],
    you: d.you,
    required: d.required,
  }))

  return (
    <div className="results-page">
      <AnimatedBackground variant="dark" particles={true} grid={true} />
      <Navbar />

      {/* Loading screen */}
      {loading && (
        <div className="results-loading">
          <div className="results-loading-inner">
            <div className="loading-spinner" />
            <h2>Analyzing your skill profile…</h2>
            <p>Comparing against {role} requirements</p>
            <div className="loading-bar-track">
              <div className="loading-bar-fill" />
            </div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="results-layout">
          {/* ── SIDEBAR ─────────────────────────────── */}
          <aside className="results-sidebar">
            <div className="results-sidebar-inner">
              {/* User card */}
              <div className="results-user-card">
                <div className="results-avatar">
                  {(skills[0] || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <div className="results-user-name">Your Profile</div>
                  <div className="results-user-role">{role}</div>
                </div>
              </div>

              {/* Score ring */}
              <div className="results-score-ring">
                <svg viewBox="0 0 100 100" className="score-svg">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
                  <circle
                    cx="50" cy="50" r="38"
                    fill="none"
                    stroke="#a8e63d"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={`${matchScore * 2.39} 239`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: 'stroke-dasharray 1.2s ease' }}
                  />
                </svg>
                <div className="score-label">
                  <div className="score-value">{matchScore}%</div>
                  <div className="score-sub">Match</div>
                </div>
              </div>

              <div className="results-mini-stats">
                <div className="results-mini-stat">
                  <CheckCircle size={14} color="#a8e63d" />
                  <span>{skillsMatched} skills matched</span>
                </div>
                <div className="results-mini-stat">
                  <AlertCircle size={14} color="#ff7070" />
                  <span>{gapsCount} critical gaps</span>
                </div>
                <div className="results-mini-stat">
                  <Clock size={14} color="#ffb43c" />
                  <span>~{gapsCount * 15}h to close gaps</span>
                </div>
              </div>

              {/* Nav */}
              <div className="results-sidebar-label">Navigation</div>
              <nav className="results-nav">
                {NAV_ITEMS.map(item => (
                  <button
                    key={item.id}
                    className={`results-nav-item ${activeNav === item.id ? 'active' : ''}`}
                    onClick={() => setActiveNav(item.id)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div style={{ marginTop: 'auto', paddingTop: 24 }}>
                <Link to="/analyze" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                  ← Re-analyze
                </Link>
              </div>
            </div>
          </aside>

          {/* ── MAIN ────────────────────────────────── */}
          <main className="results-main">

            {/* Header */}
            <div className="results-main-header">
              <div>
                <h1 className="results-main-title">Gap Analysis Report</h1>
                <p className="results-main-subtitle">Target: <strong>{role}</strong> · {experience}</p>
              </div>
              <div className="results-header-actions">
                <button className="btn-ghost-sm"><Share2 size={15} /> Share</button>
                <button className="btn-ghost-sm"><Download size={15} /> Export PDF</button>
              </div>
            </div>

            {/* ── OVERVIEW ──────────────────────────── */}
            {activeNav === 'overview' && (
              <div className="results-section">
                {/* Top stat cards */}
                <div className="results-stats-grid">
                  {[
                    { label: 'Overall Match', value: `${matchScore}%`, trend: '+12.5%', up: true, sub: 'vs. industry average' },
                    { label: 'Skills You Have', value: `${skills.length}`, trend: `+${skillsMatched} matched`, up: true, sub: 'out of required' },
                    { label: 'Gaps Identified', value: `${gapData.length - skillsMatched}`, trend: `${gapsCount} critical`, up: false, sub: 'skills to acquire' },
                    { label: 'Est. Time to Ready', value: `${gapsCount * 15}h`, trend: 'Realistic', up: true, sub: 'self-paced learning' },
                  ].map((s, i) => (
                    <div className="results-stat-card" key={i}>
                      <div className="results-stat-header">
                        <span className="results-stat-label">{s.label}</span>
                        <span className={`results-stat-trend ${s.up ? 'up' : 'down'}`}>{s.trend}</span>
                      </div>
                      <div className="results-stat-value">{s.value}</div>
                      <div className="results-stat-sub">{s.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Charts row */}
                <div className="results-charts-row">
                  {/* Radar chart */}
                  <div className="results-chart-card">
                    <div className="results-chart-title">Skill Coverage Radar</div>
                    <ResponsiveContainer width="100%" height={240}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="rgba(255,255,255,0.07)" />
                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} />
                        <Radar name="Required" dataKey="required" stroke="rgba(255,255,255,0.2)" fill="rgba(255,255,255,0.05)" fillOpacity={1} />
                        <Radar name="You" dataKey="you" stroke="#a8e63d" fill="#a8e63d" fillOpacity={0.2} />
                        <Tooltip
                          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                          labelStyle={{ color: '#fff' }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                    <div className="radar-legend">
                      <span className="radar-legend-item"><span style={{ background: 'rgba(255,255,255,0.3)' }} />Required</span>
                      <span className="radar-legend-item"><span style={{ background: '#a8e63d' }} />You</span>
                    </div>
                  </div>

                  {/* Area chart */}
                  <div className="results-chart-card">
                    <div className="results-chart-title">Readiness Score Trend</div>
                    <ResponsiveContainer width="100%" height={210}>
                      <AreaChart data={TREND_DATA} margin={{ top: 8, right: 0, left: -28, bottom: 0 }}>
                        <defs>
                          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a8e63d" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#a8e63d" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                          labelStyle={{ color: '#fff' }}
                          itemStyle={{ color: '#a8e63d' }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#a8e63d" strokeWidth={2.5} fill="url(#trendGrad)" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ── SKILL GAPS ────────────────────────── */}
            {activeNav === 'gaps' && (
              <div className="results-section">
                <div className="results-chart-card" style={{ marginBottom: 20 }}>
                  <div className="results-chart-title">Skill Gap Breakdown</div>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={gapData} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="skill" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Bar dataKey="you" name="Your Level" radius={[4, 4, 0, 0]}>
                        {gapData.map((d, i) => (
                          <Cell key={i} fill={d.have ? '#a8e63d' : '#ff6464'} opacity={0.85} />
                        ))}
                      </Bar>
                      <Bar dataKey="required" name="Required" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="gaps-list">
                  {gapData
                    .sort((a, b) => b.gap - a.gap)
                    .map((d, i) => (
                      <div className="gap-row" key={i}>
                        <div className="gap-row-left">
                          <div className={`gap-row-icon ${d.have ? 'have' : 'missing'}`}>
                            {d.have ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                          </div>
                          <div>
                            <div className="gap-row-skill">{d.skill}</div>
                            <div className="gap-row-meta">
                              Your level: {d.you}% · Required: {d.required}%
                            </div>
                          </div>
                        </div>
                        <div className="gap-row-right">
                          <div className="gap-bar-wrap">
                            <div className="progress-bar-track" style={{ width: 160 }}>
                              <div
                                className={`progress-bar-fill ${d.have ? '' : 'gap'}`}
                                style={{ width: `${d.you}%` }}
                              />
                            </div>
                            <span className={`gap-badge ${d.gap > 30 ? 'high' : d.gap > 15 ? 'medium' : 'low'}`}>
                              {d.gap > 30 ? 'High Gap' : d.gap > 15 ? 'Medium' : 'Minimal'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ── LEARNING PATH ─────────────────────── */}
            {activeNav === 'resources' && (
              <div className="results-section">
                <div className="resources-header">
                  <h2 className="resources-title">Your Personalized Learning Path</h2>
                  <p className="resources-subtitle">
                    Curated resources to close your top skill gaps. Complete in order for the fastest results.
                  </p>
                </div>

                {gapData
                  .filter(d => d.gap > 15)
                  .map((d, i) => (
                    <div className="resource-section" key={i}>
                      <div className="resource-section-header">
                        <div className="resource-priority">{String(i + 1).padStart(2, '0')}</div>
                        <div>
                          <div className="resource-section-title">{d.skill}</div>
                          <div className="resource-section-meta">Gap: {d.gap}% · {d.gap > 30 ? 'High priority' : 'Medium priority'}</div>
                        </div>
                      </div>
                      <div className="resource-cards">
                        {(RESOURCES[d.skill] || [
                          { title: `Master ${d.skill} — Complete Guide`, type: 'Course', time: '12h', url: '#' },
                          { title: `${d.skill} in Practice`, type: 'Project', time: '5h', url: '#' },
                        ]).map((r, j) => (
                          <a key={j} href={r.url} className="resource-card">
                            <div className="resource-card-type">{r.type}</div>
                            <div className="resource-card-title">{r.title}</div>
                            <div className="resource-card-footer">
                              <span className="resource-card-time"><Clock size={12} /> {r.time}</span>
                              <ChevronRight size={15} />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* ── PROGRESS ──────────────────────────── */}
            {activeNav === 'progress' && (
              <div className="results-section">
                <div className="results-chart-card">
                  <div className="results-chart-title">6-Month Readiness Score</div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={TREND_DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="prog-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a8e63d" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#a8e63d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13 }}
                        labelStyle={{ color: '#fff' }}
                        itemStyle={{ color: '#a8e63d' }}
                        formatter={(v) => [`${v}%`, 'Readiness Score']}
                      />
                      <Area type="monotone" dataKey="score" stroke="#a8e63d" strokeWidth={2.5} fill="url(#prog-grad)" dot={{ fill: '#a8e63d', r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="milestones">
                  <div className="milestones-title">Upcoming Milestones</div>
                  {[
                    { label: 'Complete TypeScript foundations', done: true },
                    { label: 'Build a CI/CD pipeline project', done: true },
                    { label: 'AWS Cloud Practitioner certification', done: false },
                    { label: 'Pass a mock Senior Frontend interview', done: false },
                    { label: 'Reach 85% readiness score', done: false },
                  ].map((m, i) => (
                    <div key={i} className={`milestone-item ${m.done ? 'done' : ''}`}>
                      <div className="milestone-check">{m.done ? <CheckCircle size={16} /> : <div className="milestone-empty" />}</div>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  )
}
