import React, { useState } from 'react'
import { 
  LineChart as LineChartIcon, 
  Award, 
  Clock, 
  Calendar, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  TrendingUp, 
  FileText,
  Sparkles,
  PlayCircle
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import Navbar from '../components/Navbar'
import FeedbackReport from '../components/FeedbackReport'
import { useAuth } from '../context/AuthContext'
import { useInterview } from '../context/InterviewContext'
import { MOCK_CANDIDATE_STATS, MOCK_QUESTIONS } from '../data/mockInterviewData'
import { downloadSessionPDF, downloadCandidatesCSV } from '../utils/pdfExport'
import './CandidateDashboard.css'

export default function CandidateDashboard() {
  const { user } = useAuth()
  const { sessionHistory } = useInterview()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomainFilter, setSelectedDomainFilter] = useState('ALL')
  const [activeReviewSession, setActiveReviewSession] = useState(null)

  const stats = MOCK_CANDIDATE_STATS

  // Filter history sessions
  const filteredSessions = sessionHistory.filter(s => {
    const matchesDomain = selectedDomainFilter === 'ALL' || s.domain === selectedDomainFilter
    const matchesSearch = s.questionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.domain.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDomain && matchesSearch
  })

  const handleOpenReviewModal = (sessionItem) => {
    const fullQuestion = MOCK_QUESTIONS.find(q => q.title === sessionItem.questionTitle) || MOCK_QUESTIONS[0]
    const fullSessionData = {
      id: sessionItem.id,
      questionTitle: sessionItem.questionTitle,
      domain: sessionItem.domain,
      difficulty: sessionItem.difficulty,
      prompt: fullQuestion.prompt,
      modelAnswer: fullQuestion.modelAnswer,
      expectedKeywords: fullQuestion.expectedKeywords,
      userAnswerText: 'Spoken and text answer evaluated for ' + sessionItem.questionTitle,
      transcript: 'To optimize this solution, we combine a Hash Map with a Doubly Linked List for O(1) operations.',
      inputMode: sessionItem.inputMode.includes('Speech') ? 'speech' : 'text',
      feedback: {
        score: sessionItem.score,
        breakdown: { technicalAccuracy: sessionItem.score, communication: Math.max(70, sessionItem.score - 5), problemSolving: sessionItem.score, codeEfficiency: Math.max(70, sessionItem.score - 4) },
        strengths: fullQuestion.sampleFeedback?.strengths || ['Identified primary algorithmic pattern correctly.'],
        gaps: fullQuestion.sampleFeedback?.gaps || ['Could address boundary conditions more explicitly.'],
        resources: fullQuestion.sampleFeedback?.resources || []
      }
    }
    setActiveReviewSession(fullSessionData)
  }

  return (
    <div className="dashboard-page-wrapper">
      <Navbar />

      <div className="container dashboard-container section">
        {/* HEADER BAR */}
        <div className="dashboard-header cirrus-card">
          <div className="user-welcome">
            <img src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'} alt="Avatar" className="header-avatar" />
            <div>
              <h2>Welcome Back, {user?.name || 'Candidate'}</h2>
              <p>Target Role: <strong>{user?.targetRole || 'Full Stack Engineer'}</strong> &nbsp;|&nbsp; Member since Jan 2026</p>
            </div>
          </div>

          <div className="header-actions">
            <button type="button" className="btn-black-pill" onClick={() => downloadCandidatesCSV([
              {
                id: 'cand_101',
                name: user?.name || 'Alex Rivera',
                email: user?.email || 'alex@example.com',
                targetRole: user?.targetRole || 'Full Stack Engineer',
                readinessScore: stats.overallScore,
                domainScores: { DSA: 88, DBMS: 82, FullStack: 91 },
                sessionsRun: sessionHistory.length,
                status: 'RECOMMENDED_FOR_INTERVIEW',
                summaryNote: 'Strong technical foundations across DSA and Full Stack.'
              }
            ])}>
              <Download size={14} />
              <span>Export History CSV</span>
            </button>
          </div>
        </div>

        {/* STATS OVERVIEW GRID */}
        <div className="stats-grid">
          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper score"><Award size={22} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.overallScore}%</span>
              <span className="stat-label">Overall Readiness Score</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper sessions"><LineChartIcon size={22} /></div>
            <div className="stat-info">
              <span className="stat-value">{sessionHistory.length}</span>
              <span className="stat-label">Mock Sessions Completed</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper time"><Clock size={22} /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.practiceHours} hrs</span>
              <span className="stat-label">Total Practice Time</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper trend"><TrendingUp size={22} /></div>
            <div className="stat-info">
              <span className="stat-value">+14%</span>
              <span className="stat-label">30-Day Score Growth</span>
            </div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="charts-grid">
          {/* Performance Trend Line Chart */}
          <div className="chart-card cirrus-card">
            <div className="chart-header">
              <h3>Performance Score History</h3>
              <p>Domain score progression over recent mock sessions</p>
            </div>
            <div className="chart-render-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={stats.scoreHistory} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="session" stroke="#64748b" fontSize={12} />
                  <YAxis domain={[50, 100]} stroke="#64748b" fontSize={12} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: 12, borderColor: '#cbd5e1', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="dsa" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} name="DSA Track" />
                  <Line type="monotone" dataKey="dbms" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} name="DBMS Track" />
                  <Line type="monotone" dataKey="fullstack" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Full Stack" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Competency Radar Chart */}
          <div className="chart-card cirrus-card">
            <div className="chart-header">
              <h3>Technical Competency Radar</h3>
              <p>Evaluated skill strengths vs domain benchmarks</p>
            </div>
            <div className="chart-render-wrapper">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={stats.competencies} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="subject" stroke="#0f172a" fontSize={12} fontWeight={600} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                  <Radar name="Candidate Skill" dataKey="score" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* SESSION HISTORY TABLE */}
        <div className="history-section cirrus-card">
          <div className="history-header">
            <div>
              <h3>Session History & AI Feedback Logs</h3>
              <p>Review questions, user transcripts, and AI feedback score reports</p>
            </div>

            <div className="filter-controls">
              <div className="search-input-wrapper">
                <Search size={15} className="search-icon" />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Search question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="domain-select-filter"
                value={selectedDomainFilter}
                onChange={(e) => setSelectedDomainFilter(e.target.value)}
              >
                <option value="ALL">All Domains</option>
                <option value="DSA">DSA</option>
                <option value="DBMS">DBMS</option>
                <option value="Full Stack">Full Stack</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Question Title</th>
                  <th>Domain</th>
                  <th>Input Mode</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((sessionItem) => (
                  <tr key={sessionItem.id}>
                    <td className="font-mono text-muted">{sessionItem.date}</td>
                    <td className="font-weight-600">{sessionItem.questionTitle}</td>
                    <td>
                      <span className={`domain-chip ${sessionItem.domain.toLowerCase().replace(/\s+/g, '')}`}>
                        {sessionItem.domain}
                      </span>
                    </td>
                    <td>
                      <span className="mode-tag">{sessionItem.inputMode}</span>
                    </td>
                    <td>
                      <span className={`score-badge ${sessionItem.score >= 80 ? 'high' : 'medium'}`}>
                        {sessionItem.score}%
                      </span>
                    </td>
                    <td>
                      <button type="button" className="btn-table-action" onClick={() => handleOpenReviewModal(sessionItem)}>
                        <Eye size={14} />
                        <span>View Report</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* REVIEW SESSION MODAL */}
      {activeReviewSession && (
        <div className="modal-backdrop">
          <div className="modal-card-xl">
            <button type="button" className="modal-close-btn" onClick={() => setActiveReviewSession(null)}>✕</button>
            <FeedbackReport session={activeReviewSession} onRestart={() => setActiveReviewSession(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
