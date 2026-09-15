import React, { useState } from 'react'
import { X, Lock, Mail, User, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, login, signup } = useAuth()
  const [tab, setTab] = useState('login') // 'login' or 'signup'
  const [role, setRole] = useState('candidate')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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

    if (tab === 'login') {
      login(email, password, role)
    } else {
      signup(name, email, password, role)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-card anim-fade-up">
        <button className="modal-close-btn" onClick={() => setAuthModalOpen(false)}>
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            <ShieldCheck size={26} />
          </div>
          <h2>{tab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p>Access AI Interview Coach & RBAC Portals</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${tab === 'signup' ? 'active' : ''}`}
            onClick={() => { setTab('signup'); setError('') }}
          >
            Sign Up
          </button>
        </div>

        {/* Role Selector */}
        <div className="role-selector-box">
          <label className="input-label">Select Account Role</label>
          <div className="role-btn-group">
            <button 
              type="button"
              className={`role-btn ${role === 'candidate' ? 'active' : ''}`}
              onClick={() => setRole('candidate')}
            >
              Candidate
            </button>
            <button 
              type="button"
              className={`role-btn ${role === 'recruiter' ? 'active' : ''}`}
              onClick={() => setRole('recruiter')}
            >
              Recruiter / HR
            </button>
            <button 
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              Admin
            </button>
          </div>
        </div>

        {error && <div className="auth-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="btn btn-accent auth-submit-btn">
            {tab === 'login' ? 'Authenticate (JWT)' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer-note">
          <CheckCircle2 size={14} /> Passwords hashed with bcrypt; Session secured via JWT token.
        </div>
      </div>
    </div>
  )
}
