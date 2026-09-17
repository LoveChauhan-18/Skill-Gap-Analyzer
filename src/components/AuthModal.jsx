import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import './AuthModal.css'

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authModalTab, login, signup, ROLE_HOME } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState(authModalTab || 'login') // 'login' or 'signup'
  const [role, setRole] = useState('candidate')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const modalRef = useRef(null)
  const formRef = useRef(null)

  // Sync tab when modal opens
  React.useEffect(() => {
    if (authModalOpen && authModalTab) {
      setTab(authModalTab)
    }
  }, [authModalOpen, authModalTab])

  // Entrance animations for Modal Card & elements
  useGSAP(() => {
    if (!authModalOpen) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Backdrop fade
    tl.fromTo(
      '.modal-backdrop',
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )

    // 2. Card entrance with spring ease
    tl.fromTo(
      '.modal-card',
      { y: 50, scale: 0.88, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.4)' },
      '-=0.2'
    )

    // 3. Shield Icon Spin
    tl.fromTo(
      '.modal-icon',
      { scale: 0, rotate: -180 },
      { scale: 1, rotate: 0, duration: 0.5, ease: 'back.out(1.8)' },
      '-=0.4'
    )

    // 4. Header & Form elements stagger
    tl.fromTo(
      ['.modal-header h2', '.modal-header p', '.auth-tabs', '.role-selector-box', '.input-group', '.auth-submit-btn'],
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.06 },
      '-=0.3'
    )
  }, { scope: modalRef, dependencies: [authModalOpen] })

  // Animate tab switch
  const handleTabSwitch = (newTab) => {
    if (newTab === tab) return
    setTab(newTab)
    setError('')

    gsap.fromTo(
      '.auth-form',
      { opacity: 0, y: 10, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
    )
  }

  // Animate role selection pop
  const handleRoleSelect = (newRole, e) => {
    setRole(newRole)
    gsap.fromTo(
      e.currentTarget,
      { scale: 0.92 },
      { scale: 1, duration: 0.4, ease: 'back.out(2)' }
    )
  }

  // Animated Close handler
  const handleClose = () => {
    gsap.to('.modal-card', {
      scale: 0.9,
      y: 20,
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => setAuthModalOpen(false)
    })
    gsap.to('.modal-backdrop', {
      opacity: 0,
      duration: 0.25
    })
  }

  if (!authModalOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (tab === 'signup' && !name) {
      setError('Please enter your full name.')
      return
    }

    let result
    if (tab === 'login') {
      result = login(email, password, role)
    } else {
      result = signup(name, email, password, role)
    }

    // Redirect to role's home page after successful auth
    if (result?.success) {
      handleClose()
      const destination = ROLE_HOME[result.user.role] || '/'
      navigate(destination, { replace: true })
    }
  }

  return (
    <div
      className="modal-backdrop"
      ref={modalRef}
      onClick={(e) => { if (e.target.classList.contains('modal-backdrop')) handleClose() }}
    >
      <div className="modal-card">
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            {tab === 'login' ? <Lock size={26} /> : <Sparkles size={26} />}
          </div>
          <h2>{tab === 'login' ? 'Welcome Back' : 'Get Started with AI Coach'}</h2>
          <p>{tab === 'login' ? 'Sign in to access your interview reports & portal' : 'Start your mock interview practice session in seconds'}</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('signup')}
          >
            Get Started
          </button>
        </div>

        {/* Instant Demo Quick-Access Pill Bar */}
        <div className="quick-demo-banner">
          <div className="quick-demo-label">1-Click Instant Demo Access:</div>
          <div className="quick-demo-btns">
            <button
              type="button"
              className="quick-demo-pill demo-candidate"
              onClick={() => { login('alex.rivera@example.com', 'pass', 'candidate'); setAuthModalOpen(false); navigate('/simulator') }}
            >
              Try Candidate
            </button>
            <button
              type="button"
              className="quick-demo-pill demo-recruiter"
              onClick={() => { login('sarah.chen@techrecruiters.io', 'pass', 'recruiter'); setAuthModalOpen(false); navigate('/recruiter') }}
            >
              Try Recruiter
            </button>
          </div>
        </div>

        {/* Role Selector */}
        <div className="role-selector-box">
          <label className="input-label">Account Type</label>
          <div className="role-btn-group">
            <button
              type="button"
              className={`role-btn ${role === 'candidate' ? 'active' : ''}`}
              onClick={(e) => handleRoleSelect('candidate', e)}
            >
              Candidate
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'recruiter' ? 'active' : ''}`}
              onClick={(e) => handleRoleSelect('recruiter', e)}
            >
              Recruiter
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={(e) => handleRoleSelect('admin', e)}
            >
              Admin
            </button>
          </div>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form" ref={formRef}>
          {tab === 'signup' && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={18} className="icon" />
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="icon" />
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="icon" />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className={`auth-submit-btn ${tab === 'signup' ? 'btn-signup-accent' : ''}`}>
            {tab === 'login' ? 'Sign In & Continue' : 'Create Free Account & Start ↗'}
          </button>
        </form>

        <div className="auth-footer-note">
          <CheckCircle2 size={14} /> Passwords hashed with bcrypt · Session secured via JWT token.
        </div>
      </div>
    </div>
  )
}
