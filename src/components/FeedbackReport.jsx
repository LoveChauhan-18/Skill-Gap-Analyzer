import React, { useState } from 'react'
import { 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  BookOpen, 
  Download, 
  FileText, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'
import { downloadSessionPDF } from '../utils/pdfExport'
import { useAuth } from '../context/AuthContext'
import './FeedbackReport.css'

export default function FeedbackReport({ session, onRestart }) {
  const { user } = useAuth()
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeTab, setActiveTab] = useState('evaluation') // 'evaluation' | 'modelAnswer' | 'resources'

  const feedback = session?.feedback || {
    score: 88,
    breakdown: { technicalAccuracy: 90, communication: 85, problemSolving: 92, codeEfficiency: 85 },
    strengths: ['Identified Hash Map + Doubly Linked List pattern correctly.', 'Clear explanation of O(1) time complexity.'],
    gaps: ['Omitted zero capacity edge check.'],
    resources: [{ title: 'LeetCode 146 Guide', url: 'https://leetcode.com' }]
  }

  const toggleSpeechAudio = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel()
      setIsPlayingAudio(false)
    } else {
      if ('speechSynthesis' in window) {
        const textToSpeak = `Overall interview score is ${feedback.score} out of 100. Strengths: ${feedback.strengths.join('. ')}. Areas for improvement: ${feedback.gaps.join('. ')}.`
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.onend = () => setIsPlayingAudio(false)
        window.speechSynthesis.speak(utterance)
        setIsPlayingAudio(true)
      } else {
        alert('Text-to-speech audio player is not supported in this browser.')
      }
    }
  }

  const handleExportPDF = () => {
    downloadSessionPDF(session, user?.name || 'Candidate')
  }

  return (
    <div className="feedback-report-card cirrus-card">
      {/* Report Header */}
      <div className="report-header">
        <div className="header-left">
          <div className="ai-badge">
            <Sparkles size={16} />
            <span>GenAI Evidence-Grounded Feedback</span>
          </div>
          <h2 className="report-title">{session.questionTitle}</h2>
          <div className="report-meta">
            <span className="domain-pill">{session.domain}</span>
            <span className="diff-pill">{session.difficulty}</span>
            <span className="mode-pill">{session.inputMode === 'speech' ? 'Spoken Speech Capture' : 'Text Input'}</span>
          </div>
        </div>

        <div className="score-ring-container">
          <div className="score-number">{feedback.score}</div>
          <div className="score-max">/ 100</div>
          <div className="score-label">Overall Readiness</div>
        </div>
      </div>

      {/* Quick Action Controls */}
      <div className="report-action-bar">
        <button type="button" className="btn-white-pill" onClick={toggleSpeechAudio}>
          {isPlayingAudio ? <VolumeX size={16} /> : <Volume2 size={16} />}
          <span>{isPlayingAudio ? 'Stop Audio Feedback' : 'Play Spoken AI Summary'}</span>
        </button>

        <button type="button" className="btn-black-pill" onClick={handleExportPDF}>
          <Download size={16} />
          <span>Export PDF Report</span>
        </button>

        {onRestart && (
          <button type="button" className="btn-white-pill" onClick={onRestart}>
            <RotateCcw size={16} />
            <span>Practice Another Question</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="report-tabs">
        <button 
          type="button"
          className={`report-tab ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluation')}
        >
          <Award size={16} />
          <span>Evaluation & Evidence Breakdown</span>
        </button>
        <button 
          type="button"
          className={`report-tab ${activeTab === 'modelAnswer' ? 'active' : ''}`}
          onClick={() => setActiveTab('modelAnswer')}
        >
          <FileText size={16} />
          <span>Model Answer & Rubric</span>
        </button>
        <button 
          type="button"
          className={`report-tab ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <BookOpen size={16} />
          <span>Suggested Next Steps</span>
        </button>
      </div>

      {/* TAB CONTENT: EVALUATION */}
      {activeTab === 'evaluation' && (
        <div className="tab-content-area">
          {/* Competency Metric Progress Bars */}
          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-header">
                <span>Technical Accuracy</span>
                <span className="metric-val">{feedback.breakdown?.technicalAccuracy || feedback.score}%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${feedback.breakdown?.technicalAccuracy || feedback.score}%` }} 
                />
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <span>Communication & Clarity</span>
                <span className="metric-val">{feedback.breakdown?.communication || 85}%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${feedback.breakdown?.communication || 85}%` }} 
                />
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <span>Problem Solving Approach</span>
                <span className="metric-val">{feedback.breakdown?.problemSolving || feedback.score}%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${feedback.breakdown?.problemSolving || feedback.score}%` }} 
                />
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <span>Code & Complexity Efficiency</span>
                <span className="metric-val">{feedback.breakdown?.codeEfficiency || 82}%</span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${feedback.breakdown?.codeEfficiency || 82}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Strengths & Gaps Dual Grid */}
          <div className="feedback-dual-grid">
            <div className="feedback-card strengths-card">
              <h3 className="card-title text-success">
                <CheckCircle size={18} />
                <span>Demonstrated Strengths</span>
              </h3>
              <ul className="feedback-list">
                {feedback.strengths?.map((str, idx) => (
                  <li key={idx}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="feedback-card gaps-card">
              <h3 className="card-title text-warning">
                <AlertTriangle size={18} />
                <span>Areas for Improvement / Gaps</span>
              </h3>
              <ul className="feedback-list">
                {feedback.gaps?.map((gap, idx) => (
                  <li key={idx}>{gap}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evidence Grounding Traceability Box */}
          <div className="evidence-box">
            <div className="evidence-title">
              <ShieldCheck size={16} />
              <span>Transcript Evidence Traceability</span>
            </div>
            <p className="evidence-text">
              "{session.transcript || session.userAnswerText || 'To optimize this solution, we combine a Hash Map with a Doubly Linked List for O(1) operations.'}"
            </p>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MODEL ANSWER */}
      {activeTab === 'modelAnswer' && (
        <div className="tab-content-area model-answer-wrapper">
          <h3>Ideal Technical Solution & Answer Structure</h3>
          <p className="model-desc">Reference implementation and key architectural points expected for top tier performance:</p>
          
          <pre className="model-code-block">
            <code>{session.modelAnswer || `// Reference LRU Cache O(1) Implementation
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val);
    return val;
  }
}`}</code>
          </pre>

          <div className="ideal-points-box">
            <h4>Key Scoring Criteria Checked:</h4>
            <ul>
              {session.expectedKeywords?.map((kw, i) => (
                <li key={i}><CheckCircle size={15} className="icon-green" /> Concept: <strong>{kw}</strong></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB CONTENT: RESOURCES */}
      {activeTab === 'resources' && (
        <div className="tab-content-area resources-wrapper">
          <h3>Recommended Preparation Resources</h3>
          <p className="resources-sub">Curated references based on identified technical gaps in your session:</p>

          <div className="resources-grid">
            {feedback.resources?.map((res, i) => (
              <a key={i} href={res.url} target="_blank" rel="noreferrer" className="resource-link-card">
                <BookOpen size={20} className="res-icon" />
                <div className="res-info">
                  <span className="res-title">{res.title}</span>
                  <span className="res-url">{res.url}</span>
                </div>
                <ExternalLink size={16} className="ext-icon" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
