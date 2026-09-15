import React from 'react'
import { 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Mic, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Database,
  Layers,
  Sparkles
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { MOCK_ADMIN_METRICS } from '../data/mockInterviewData'
import './AdminAnalytics.css'

export default function AdminAnalytics() {
  const metrics = MOCK_ADMIN_METRICS

  return (
    <div className="admin-page-wrapper">
      <Navbar />

      <div className="container admin-container">
        {/* ADMIN HEADER */}
        <div className="admin-header cirrus-card">
          <div className="header-left">
            <div className="admin-icon">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2>Platform System Metrics & Model Health Monitor</h2>
              <p>Aggregate platform usage, speech-to-text latency, and LLM groundedness statistics</p>
            </div>
          </div>
          <div className="status-pill-live">
            <span className="live-dot"></span>
            <span>All Microservices Operational</span>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="admin-stats">
          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper sessions"><Activity size={22} /></div>
            <div>
              <span className="stat-value">{metrics.totalMockSessions}</span>
              <span className="stat-label">Total Mock Sessions Run</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper speech"><Mic size={22} /></div>
            <div>
              <span className="stat-value">{metrics.speechToTextUsage}</span>
              <span className="stat-label">Speech Input Capture Ratio</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper llm"><Cpu size={22} /></div>
            <div>
              <span className="stat-value">{metrics.llmFeedbackGroundedness}</span>
              <span className="stat-label">AI Feedback Groundedness Rate</span>
            </div>
          </div>

          <div className="stat-card cirrus-card">
            <div className="stat-icon-wrapper users"><Users size={22} /></div>
            <div>
              <span className="stat-value">{metrics.activeCandidates + metrics.activeRecruiters}</span>
              <span className="stat-label">Active Users (Candidates + HR)</span>
            </div>
          </div>
        </div>

        {/* AI MODEL PIPELINE MONITOR */}
        <div className="model-monitor-card cirrus-card">
          <div className="card-header">
            <h3><Cpu size={18} /> Microservices & AI Model Pipeline Health</h3>
            <p>Monitors LLM question generation, speech transcribing, and answer evaluation latency</p>
          </div>

          <div className="model-grid">
            {metrics.modelVersions.map((mod, idx) => (
              <div key={idx} className="model-item-card">
                <div className="mod-info">
                  <span className="mod-name">{mod.name}</span>
                  <span className="mod-domain">{mod.domain}</span>
                </div>
                <div className="mod-meta">
                  <span className="mod-latency">Latency: {mod.latency}</span>
                  <span className="mod-status healthy"><CheckCircle size={14} /> {mod.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
