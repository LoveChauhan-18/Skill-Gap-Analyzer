import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { InterviewProvider } from './context/InterviewContext'
import { SmoothScroll } from './components/SmoothScroll'
import ScrollProgressBar from './components/ScrollProgressBar'
import ScrollToTopBtn from './components/ScrollToTopBtn'
import AuthModal from './components/AuthModal'
import Toast from './components/Toast'
import ProtectedRoute from './components/ProtectedRoute'

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
          <SmoothScroll>
            <div className="app-root">
              <ScrollProgressBar />
              <AnimatedBackground />
              <Routes>
                {/* Public */}
                <Route path="/" element={<Landing />} />

                {/* Candidate only */}
                <Route
                  path="/simulator"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <InterviewSimulator />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['candidate']}>
                      <CandidateDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Recruiter + Admin */}
                <Route
                  path="/recruiter"
                  element={
                    <ProtectedRoute allowedRoles={['recruiter', 'admin']}>
                      <RecruiterDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Admin only */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <AuthModal />
              <Toast />
              <ScrollToTopBtn />
            </div>
          </SmoothScroll>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
