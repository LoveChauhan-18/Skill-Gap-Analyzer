import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, ArrowUpRight, Menu, X, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

// Role-based navigation link definitions
const NAV_LINKS = {
  candidate: [
    { to: '/',           label: 'Home' },
    { to: '/simulator',  label: 'Simulator' },
    { to: '/dashboard',  label: 'My Dashboard' },
  ],
  recruiter: [
    { to: '/',           label: 'Home' },
    { to: '/recruiter',  label: 'Recruiter Portal' },
  ],
  admin: [
    { to: '/',           label: 'Home' },
    { to: '/admin',      label: 'Analytics' },
    { to: '/recruiter',  label: 'Candidate Screening' },
  ],
}

// Role badge colours
const ROLE_STYLES = {
  candidate: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: '🎓 Candidate' },
  recruiter: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa', label: '🧑‍💼 Recruiter' },
  admin:     { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: '🛡️ Admin' },
}

export default function Navbar() {
  const location = useLocation()
  const { user, isAuthenticated, logout, setAuthModalOpen } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const role = user?.role || 'candidate'
  const links = isAuthenticated ? (NAV_LINKS[role] || NAV_LINKS.candidate) : [{ to: '/', label: 'Home' }]
  const roleStyle = ROLE_STYLES[role]

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="cirrus-nav-wrapper">
      <div className="container nav-container">
        {/* Floating White Pill Navbar */}
        <nav className="cirrus-navbar">
          {/* Logo / Brand */}
          <Link to="/" className="nav-brand">
            <div className="cirrus-asterisk-icon">
              <Sparkles size={16} className="sparkle-icon" />
            </div>
            <span className="brand-name">AI Coach</span>
          </Link>

          {/* Centered Role-Scoped Navigation Links */}
          <div className="nav-menu-center desktop-only">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-tab ${location.pathname === to ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="nav-actions-right desktop-only">
            {isAuthenticated ? (
              <>
                {/* Role Badge */}
                <span
                  className="nav-role-badge"
                  style={{
                    background: roleStyle.bg,
                    color: roleStyle.color,
                    border: `1px solid ${roleStyle.border}`,
                  }}
                >
                  {roleStyle.label}
                </span>

                {/* User Pill */}
                <div className="user-badge-pill">
                  <span className="user-name">{user?.name}</span>
                  <button className="logout-btn" onClick={handleLogout} title="Sign Out">
                    <LogOut size={13} />
                  </button>
                </div>

                {/* CTA for candidates only */}
                {role === 'candidate' && (
                  <Link to="/simulator" className="btn-black-pill nav-cta">
                    <span>Start Mock</span>
                    <ArrowUpRight size={15} />
                  </Link>
                )}
              </>
            ) : (
              <>
                <button
                  className="sign-in-btn"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <LogIn size={15} />
                  Sign In
                </button>
                <button
                  className="btn-black-pill nav-cta"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <span>Get Started</span>
                  <ArrowUpRight size={15} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="mobile-hamburger-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay">
          <div className="mobile-drawer-card">
            {links.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}>
                {label}
              </Link>
            ))}

            <div className="mobile-divider" />

            {isAuthenticated ? (
              <>
                <div className="mobile-user-info">
                  <span className="mobile-user-name">{user?.name}</span>
                  <span
                    className="nav-role-badge"
                    style={{
                      background: roleStyle.bg,
                      color: roleStyle.color,
                      border: `1px solid ${roleStyle.border}`,
                    }}
                  >
                    {roleStyle.label}
                  </span>
                </div>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <LogOut size={15} /> Sign Out
                </button>
              </>
            ) : (
              <button
                className="btn-black-pill"
                onClick={() => { setMobileMenuOpen(false); setAuthModalOpen(true) }}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
