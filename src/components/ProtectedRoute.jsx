import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ShieldX, ArrowLeft, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './ProtectedRoute.css'

// Role → default home page mapping
export const ROLE_HOME = {
  candidate: '/dashboard',
  recruiter: '/recruiter',
  admin: '/admin',
}

/**
 * ProtectedRoute
 * @param {string[]} allowedRoles - roles permitted to access this route
 * @param {React.ReactNode} children - the page to render if access granted
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated, setAuthModalOpen } = useAuth()
  const location = useLocation()

  // Not logged in → open auth modal and redirect to landing
  if (!isAuthenticated) {
    return <RedirectToLogin setAuthModalOpen={setAuthModalOpen} from={location.pathname} />
  }

  // Logged in but wrong role → Access Denied
  if (!allowedRoles.includes(user.role)) {
    return <AccessDenied userRole={user.role} allowedRoles={allowedRoles} />
  }

  // Authorised ✓
  return children
}

// Helper: redirect to landing + open auth modal
function RedirectToLogin({ setAuthModalOpen, from }) {
  useEffect(() => {
    setAuthModalOpen(true)
  }, [setAuthModalOpen])

  return <Navigate to="/" replace state={{ from }} />
}

// Access Denied page
function AccessDenied({ userRole, allowedRoles }) {
  const { user } = useAuth()

  const roleLabels = {
    candidate: 'Candidate',
    recruiter: 'Recruiter / HR',
    admin: 'Admin',
  }

  const homeRoute = ROLE_HOME[userRole] || '/'

  return (
    <div className="access-denied-page">
      <div className="access-denied-card">
        <div className="denied-icon-ring">
          <ShieldX size={36} className="denied-icon" />
        </div>

        <h1 className="denied-title">Access Restricted</h1>
        <p className="denied-sub">
          Your account role <strong>{roleLabels[userRole]}</strong> does not have
          permission to view this page.
        </p>

        <div className="denied-role-info">
          <span className="denied-role-label">Required role:</span>
          <div className="denied-role-badges">
            {allowedRoles.map((r) => (
              <span key={r} className={`denied-badge badge-${r}`}>
                {roleLabels[r]}
              </span>
            ))}
          </div>
        </div>

        <div className="denied-actions">
          <a href={homeRoute} className="denied-btn-primary">
            <ArrowLeft size={15} />
            Go to My Dashboard
          </a>
          <a href="/" className="denied-btn-secondary">
            <LogIn size={15} />
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
