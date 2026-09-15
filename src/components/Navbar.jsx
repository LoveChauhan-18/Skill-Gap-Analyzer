import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, ChevronDown, User, Shield, Terminal, ArrowUpRight, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const location = useLocation()
  const { role, user, isAuthenticated, logout, switchRole, openAuthModal } = useAuth()
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const roles = [
    { id: 'candidate', name: 'Candidate', label: 'Practice & Feedback', color: '#10b981' },
    { id: 'recruiter', name: 'Recruiter', label: 'Candidate Screening', color: '#f97316' },
    { id: 'admin', name: 'Admin', label: 'Platform Analytics', color: '#2563eb' }
  ]

  const handleRoleChange = (roleId) => {
    switchRole(roleId)
    setRoleDropdownOpen(false)
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

          {/* Centered Segmented Navigation Links */}
          <div className="nav-menu-center desktop-only">
            <Link to="/" className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}>
              Overview
            </Link>
            <Link to="/simulator" className={`nav-tab ${location.pathname === '/simulator' ? 'active' : ''}`}>
              Simulator
            </Link>
            <Link to="/dashboard" className={`nav-tab ${location.pathname === '/dashboard' ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/recruiter" className={`nav-tab ${location.pathname === '/recruiter' ? 'active' : ''}`}>
              Recruiter
            </Link>
            <Link to="/admin" className={`nav-tab ${location.pathname === '/admin' ? 'active' : ''}`}>
              Analytics
            </Link>
          </div>

          {/* Right Actions */}
          <div className="nav-actions-right desktop-only">
            {/* Role Switcher Pill */}
            <div className="role-dropdown-container">
              <button
                className="role-pill-btn"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              >
                <span className="role-dot" style={{ backgroundColor: roles.find(r => r.id === role)?.color }} />
                <span className="role-text">{role}</span>
                <ChevronDown size={14} className={`chevron ${roleDropdownOpen ? 'open' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <div className="role-menu-card">
                  <div className="menu-header">SWITCH ROLE VIEW</div>
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      className={`menu-item ${role === r.id ? 'active' : ''}`}
                      onClick={() => handleRoleChange(r.id)}
                    >
                      <span className="item-dot" style={{ backgroundColor: r.color }} />
                      <div>
                        <div className="item-name">{r.name}</div>
                        <div className="item-label">{r.label}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="user-badge-pill">
                <span className="user-name">{user?.name}</span>
                <button className="logout-btn" onClick={logout} title="Sign Out">
                  ✕
                </button>
              </div>
            ) : (
              <button className="sign-in-btn" onClick={() => openAuthModal('login')}>
                Sign in
              </button>
            )}

            <Link to="/simulator" className="btn-black-pill nav-cta">
              <span>Start Mock</span>
              <ArrowUpRight size={15} />
            </Link>
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
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Overview</Link>
            <Link to="/simulator" onClick={() => setMobileMenuOpen(false)}>Simulator</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
            <Link to="/recruiter" onClick={() => setMobileMenuOpen(false)}>Recruiter</Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>Analytics</Link>
            
            <div className="mobile-divider" />
            
            <Link to="/simulator" className="btn-black-pill" onClick={() => setMobileMenuOpen(false)}>
              Start Mock Interview
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
