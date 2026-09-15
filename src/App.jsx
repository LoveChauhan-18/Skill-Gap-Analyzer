import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { InterviewProvider } from './context/InterviewContext'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'

import Landing from './pages/Landing'
import InterviewSimulator from './pages/InterviewSimulator'
import CandidateDashboard from './pages/CandidateDashboard'
import RecruiterDashboard from './pages/RecruiterDashboard'
import AdminAnalytics from './pages/AdminAnalytics'
import AnimatedBackground from './components/AnimatedBackground'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <div className="app-root">
            <AnimatedBackground />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/simulator" element={<InterviewSimulator />} />
              <Route path="/dashboard" element={<CandidateDashboard />} />
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/admin" element={<AdminAnalytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <AuthModal />
            <Toast />
          </div>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
