import React, { useState } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  Eye, 
  ShieldAlert, 
  Sparkles,
  FileSpreadsheet,
  Award,
  ChevronRight,
  Send
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { MOCK_RECRUITER_POOL } from '../data/mockInterviewData'
import { downloadCandidatesCSV, downloadSessionPDF } from '../utils/pdfExport'
import './RecruiterDashboard.css'

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState(MOCK_RECRUITER_POOL)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [decisionNote, setDecisionNote] = useState('')

  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.targetRole.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleOpenCandidateDrawer = (candidate) => {
    setSelectedCandidate(candidate)
    setDecisionNote(candidate.summaryNote || '')
  }

  const handleSaveDecisionNote = () => {
    if (!selectedCandidate) return
    setCandidates(prev => prev.map(c => c.id === selectedCandidate.id ? { ...c, summaryNote: decisionNote } : c))
    alert('Recruiter screening note updated successfully!')
  }

  return (
    <div className="recruiter-page-wrapper">
      <Navbar />

      <div className="container recruiter-container">
        {/* DISCLAIMER BANNER */}
        <div className="disclaimer-banner cirrus-card">
          <div className="banner-icon">
            <ShieldAlert size={24} />
          </div>
          <div className="banner-text">
            <h3>HR Tech Decision-Support System Notice</h3>
            <p>
              AI Interview Coach provides evidence-grounded performance evaluation summaries to assist HR screeners. 
              <strong> The platform never makes autonomous hiring or rejection decisions</strong> — final hiring judgment remains exclusively with recruiters and hiring managers.
            </p>
          </div>
        </div>

        {/* RECRUITER METRICS OVERVIEW */}
        <div className="recruiter-stats">
          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper cand"><Users size={22} /></div>
            <div>
              <span className="stat-value">{candidates.length} Applicants</span>
              <span className="stat-label">In Active Screening Pool</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper rec"><Award size={22} /></div>
            <div>
              <span className="stat-value">85.0%</span>
              <span className="stat-label">Average Pool Readiness Score</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper export"><FileSpreadsheet size={22} /></div>
            <div>
              <span className="stat-value">66 Sessions</span>
              <span className="stat-label">Evaluated Across Domains</span>
            </div>
          </div>
        </div>

        {/* CANDIDATE DIRECTORY TABLE */}
        <div className="directory-card cirrus-card">
          <div className="directory-header">
            <div>
              <h2>Candidate Screening Directory</h2>
              <p>Filter candidates by role readiness score, domain breakdown, and AI summary notes</p>
            </div>

            <div className="directory-actions">
              <div className="search-box">
                <Search size={16} className="icon" />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Search candidate, role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Screening Statuses</option>
                <option value="RECOMMENDED_FOR_INTERVIEW">Recommended for Interview</option>
                <option value="NEEDS_PRACTICE">Needs Additional Practice</option>
              </select>

              <button type="button" className="btn-black-pill" onClick={() => downloadCandidatesCSV(candidates)}>
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="recruiter-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Target Role</th>
                  <th>Readiness Score</th>
                  <th>Domain Breakdown</th>
                  <th>Sessions</th>
                  <th>Screening Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.map((cand) => (
                  <tr key={cand.id}>
                    <td>
                      <div className="candidate-name-cell">
                        <span className="cand-name">{cand.name}</span>
                        <span className="cand-email">{cand.email}</span>
                      </div>
                    </td>
                    <td>{cand.targetRole}</td>
                    <td>
                      <div className="score-cell">
                        <span className={`readiness-pill ${cand.readinessScore >= 80 ? 'recommended' : 'review'}`}>
                          {cand.readinessScore}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="mini-domain-scores">
                        <span className="mini-chip dsa">DSA: {cand.domainScores.DSA}%</span>
                        <span className="mini-chip dbms">DBMS: {cand.domainScores.DBMS}%</span>
                        <span className="mini-chip fs">FS: {cand.domainScores.FullStack}%</span>
                      </div>
                    </td>
                    <td>{cand.sessionsRun}</td>
                    <td>
                      {cand.status === 'RECOMMENDED_FOR_INTERVIEW' ? (
                        <span className="status-badge recommended"><CheckCircle size={13} /> Ready for Human Round</span>
                      ) : (
                        <span className="status-badge practice"><AlertCircle size={13} /> Needs Prep</span>
                      )}
                    </td>
                    <td>
                      <button type="button" className="btn-table-action" onClick={() => handleOpenCandidateDrawer(cand)}>
                        <Eye size={15} />
                        <span>Inspect & Note</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CANDIDATE DETAIL DRAWER */}
      {selectedCandidate && (
        <div className="modal-backdrop">
          <div className="drawer-card">
            <button type="button" className="modal-close-btn" onClick={() => setSelectedCandidate(null)}>✕</button>
            
            <div className="drawer-header">
              <div className="cand-avatar-placeholder">{selectedCandidate.name[0]}</div>
              <div>
                <h2>{selectedCandidate.name}</h2>
                <p>{selectedCandidate.targetRole} &nbsp;|&nbsp; {selectedCandidate.email}</p>
              </div>
            </div>

            <div className="drawer-body">
              <div className="score-summary-box">
                <div className="box-item">
                  <span className="box-val text-accent">{selectedCandidate.readinessScore}%</span>
                  <span className="box-lbl">Overall Readiness</span>
                </div>
                <div className="box-item">
                  <span className="box-val">{selectedCandidate.domainScores.DSA}%</span>
                  <span className="box-lbl">DSA Score</span>
                </div>
                <div className="box-item">
                  <span className="box-val">{selectedCandidate.domainScores.DBMS}%</span>
                  <span className="box-lbl">DBMS Score</span>
                </div>
                <div className="box-item">
                  <span className="box-val">{selectedCandidate.domainScores.FullStack}%</span>
                  <span className="box-lbl">Full Stack Score</span>
                </div>
              </div>

              <div className="ai-summary-box">
                <h4><Sparkles size={16} /> AI Evidence Performance Summary</h4>
                <p>{selectedCandidate.summaryNote}</p>
              </div>

              <div className="decision-note-form">
                <label className="input-label">Recruiter Screening Notes & Recommendations</label>
                <textarea 
                  className="input-field note-textarea"
                  value={decisionNote}
                  onChange={(e) => setDecisionNote(e.target.value)}
                  placeholder="Add notes for hiring manager review..."
                  rows={4}
                />
                <button type="button" className="btn-black-pill" onClick={handleSaveDecisionNote}>
                  <Send size={15} />
                  <span>Save Recruiter Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
