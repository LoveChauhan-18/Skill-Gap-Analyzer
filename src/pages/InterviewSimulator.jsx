import React, { useState } from 'react'
import { 
  PlayCircle, 
  Code2, 
  Database, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  RefreshCw, 
  ShieldCheck,
  CheckCircle2,
  Mic,
  BrainCircuit,
  FileSpreadsheet
} from 'lucide-react'
import Navbar from '../components/Navbar'
import SpeechRecorder from '../components/SpeechRecorder'
import FeedbackReport from '../components/FeedbackReport'
import { useInterview } from '../context/InterviewContext'
import { MOCK_QUESTIONS } from '../data/mockInterviewData'
import './InterviewSimulator.css'

export default function InterviewSimulator() {
  const { 
    selectedDomain, 
    setSelectedDomain, 
    selectedDifficulty, 
    setSelectedDifficulty, 
    activeSession, 
    startSession, 
    submitAnswer,
    resetSession
  } = useInterview()

  const [showHint, setShowHint] = useState(false)

  // Get current active or sample question
  const currentQuestion = activeSession 
    ? {
        title: activeSession.questionTitle,
        prompt: activeSession.prompt,
        starterCode: activeSession.starterCode,
        expectedKeywords: activeSession.expectedKeywords,
      }
    : MOCK_QUESTIONS.find(q => q.domain === selectedDomain && q.difficulty === selectedDifficulty) || MOCK_QUESTIONS[0]

  const handleDomainChange = (domain) => {
    setSelectedDomain(domain)
    if (activeSession) resetSession()
  }

  const handleDifficultyChange = (diff) => {
    setSelectedDifficulty(diff)
    if (activeSession) resetSession()
  }

  const handleStartNewSession = () => {
    startSession(selectedDomain, selectedDifficulty)
    setShowHint(false)
  }

  return (
    <div className="simulator-page-wrapper">
      <Navbar />

      <div className="container simulator-container">
        {/* SETUP HEADER BAR */}
        <div className="simulator-setup-card cirrus-card">
          <div className="setup-title-box">
            <Sparkles size={20} className="sparkle" />
            <div>
              <h2>AI Technical Mock Interview Simulator</h2>
              <p>Dynamic GenAI Question Generation & Spoken Answer Evaluation (DSA, DBMS, Full Stack)</p>
            </div>
          </div>

          <div className="setup-controls-grid">
            {/* Domain Tabs */}
            <div className="control-group">
              <label className="input-label">Select Domain Track</label>
              <div className="domain-pill-group">
                <button 
                  type="button"
                  className={`domain-pill-btn dsa ${selectedDomain === 'DSA' ? 'active' : ''}`}
                  onClick={() => handleDomainChange('DSA')}
                >
                  <Code2 size={16} />
                  <span>DSA</span>
                </button>
                <button 
                  type="button"
                  className={`domain-pill-btn dbms ${selectedDomain === 'DBMS' ? 'active' : ''}`}
                  onClick={() => handleDomainChange('DBMS')}
                >
                  <Database size={16} />
                  <span>DBMS</span>
                </button>
                <button 
                  type="button"
                  className={`domain-pill-btn fullstack ${selectedDomain === 'Full Stack' ? 'active' : ''}`}
                  onClick={() => handleDomainChange('Full Stack')}
                >
                  <Layers size={16} />
                  <span>Full Stack</span>
                </button>
              </div>
            </div>

            {/* Difficulty Tabs */}
            <div className="control-group">
              <label className="input-label">Select Difficulty</label>
              <div className="diff-pill-group">
                {['Easy', 'Medium', 'Hard'].map((diff) => (
                  <button 
                    type="button"
                    key={diff}
                    className={`diff-pill-btn ${selectedDifficulty === diff ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Start / Reset Action */}
            <div className="control-group action-group">
              <button type="button" className="btn-black-pill btn-start-session" onClick={handleStartNewSession}>
                <PlayCircle size={18} />
                <span>{activeSession ? 'Restart Session' : 'Start Mock Session'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN INTERVIEW LIFECYCLE AREA */}
        {activeSession?.status === 'COMPLETED' ? (
          <FeedbackReport session={activeSession} onRestart={handleStartNewSession} />
        ) : activeSession?.status === 'PROCESSING_FEEDBACK' ? (
          <div className="processing-state-card cirrus-card text-center">
            <div className="spinner-large">
              <RefreshCw size={48} className="spin" />
            </div>
            <h2>GenAI Evaluating Your Spoken Answer...</h2>
            <p className="processing-sub">Running RAG LLM pipeline for evidence-grounded evaluation</p>

            <div className="processing-steps">
              <div className="step-item active"><CheckCircle2 size={16} /> Transcribing Spoken Audio & Speech Input</div>
              <div className="step-item active"><CheckCircle2 size={16} /> Analyzing Technical Concepts & Code Efficiency</div>
              <div className="step-item active"><CheckCircle2 size={16} /> Grounding Claims against Model Answer Rubric</div>
              <div className="step-item active"><CheckCircle2 size={16} /> Formulating Strengths, Gaps & Next Steps</div>
            </div>
          </div>
        ) : (
          <div className="simulator-grid">
            {/* LEFT COLUMN: QUESTION PROMPT & CONSTRAINTS */}
            <div className="question-panel cirrus-card">
              <div className="question-header">
                <div className="badge-row">
                  <span className="domain-badge">{selectedDomain}</span>
                  <span className="diff-badge">{selectedDifficulty}</span>
                  <span className="status-badge"><Clock size={12} /> Target: 15 mins</span>
                </div>
                <h3 className="question-title">{currentQuestion.title}</h3>
              </div>

              <div className="question-body">
                <p className="prompt-text">{currentQuestion.prompt}</p>

                {currentQuestion.starterCode && (
                  <div className="starter-code-box">
                    <div className="code-header">Starter Template / Context</div>
                    <pre><code>{currentQuestion.starterCode}</code></pre>
                  </div>
                )}

                {/* Rubric Keywords */}
                <div className="rubric-keywords-box">
                  <div className="rubric-title">Evaluation Key Concept Focus:</div>
                  <div className="keywords-flex">
                    {currentQuestion.expectedKeywords?.map((kw, i) => (
                      <span key={i} className="kw-tag">{kw}</span>
                    ))}
                  </div>
                </div>

                {/* Hint Dropdown */}
                <div className="hint-container">
                  <button type="button" className="hint-toggle-btn" onClick={() => setShowHint(!showHint)}>
                    <HelpCircle size={15} />
                    <span>{showHint ? 'Hide Approach Hint' : 'Show Approach Hint'}</span>
                  </button>
                  {showHint && (
                    <div className="hint-body">
                      Consider what data structures allow simultaneous O(1) lookup and O(1) item removal or repositioning.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SPEECH & TEXT ANSWER RECORDER */}
            <div className="answer-panel">
              <SpeechRecorder 
                questionTitle={currentQuestion.title}
                defaultCode={currentQuestion.starterCode || ''}
                onAnswerSubmit={(code, transcript, mode, flagged) => {
                  if (!activeSession) {
                    startSession(selectedDomain, selectedDifficulty)
                  }
                  submitAnswer(code, transcript, mode, flagged)
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
