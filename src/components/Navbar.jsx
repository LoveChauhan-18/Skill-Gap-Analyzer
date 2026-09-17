import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Sparkles, ArrowUpRight, Menu, X, LogOut, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
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
  candidate: { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Candidate' },
  recruiter: { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa', label: 'Recruiter' },
  admin:     { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe', label: 'Admin' },
}

const RAINBOW_PALETTE = [
  { hex: '#2563eb', border: '#3b82f6', glow: 'rgba(37, 99, 235, 0.45)' },  // Electric Blue
  { hex: '#9333ea', border: '#a855f7', glow: 'rgba(147, 51, 234, 0.45)' }, // Violet Purple
  { hex: '#ec4899', border: '#f43f5e', glow: 'rgba(236, 72, 153, 0.45)' }, // Pink Magenta
  { hex: '#ef4444', border: '#f87171', glow: 'rgba(239, 68, 68, 0.45)' },  // Red
  { hex: '#f97316', border: '#fb923c', glow: 'rgba(249, 115, 22, 0.45)' }, // Orange
  { hex: '#eab308', border: '#fde047', glow: 'rgba(234, 179, 8, 0.45)' },  // Yellow
  { hex: '#10b981', border: '#34d399', glow: 'rgba(16, 185, 129, 0.45)' }, // Green
  { hex: '#06b6d4', border: '#38bdf8', glow: 'rgba(6, 182, 212, 0.45)' },  // Cyan
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout, login, openAuthModal } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [rainbowIndex, setRainbowIndex] = useState(0)

  // 1-Second Rainbow Color Cycle Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setRainbowIndex((prev) => (prev + 1) % RAINBOW_PALETTE.length)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const currentRainbow = RAINBOW_PALETTE[rainbowIndex]

  const handleGetStartedDemo = () => {
    login('alex.rivera@example.com', 'password', 'candidate')
    navigate('/simulator')
  }
  
  const navRef = useRef(null)
  const navMenuRef = useRef(null)
  const highlightRef = useRef(null)

  const role = user?.role || 'candidate'
  const links = isAuthenticated ? (NAV_LINKS[role] || NAV_LINKS.candidate) : [{ to: '/', label: 'Home' }]
  const roleStyle = ROLE_STYLES[role]

  // Main GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Entrance of floating capsule bar
    tl.from(
      '.cirrus-navbar',
      { y: -60, opacity: 0, scale: 0.92, duration: 0.9, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }
    )

    // 2. Brand logo slide in + sparkle spin
    tl.from(
      '.nav-brand',
      { opacity: 0, x: -25, duration: 0.6, clearProps: 'transform,opacity' },
      '-=0.5'
    )
    tl.from(
      '.sparkle-icon',
      { rotate: -360, scale: 0.2, duration: 0.7, ease: 'back.out(1.8)', clearProps: 'transform,opacity,rotate' },
      '-=0.5'
    )

    // 3. Stagger center navigation tabs
    tl.from(
      '.nav-tab',
      { opacity: 0, y: -12, scale: 0.9, duration: 0.4, stagger: 0.08, clearProps: 'transform,opacity' },
      '-=0.4'
    )

    // 4. Right actions slide in
    tl.from(
      '.nav-actions-right > *',
      { opacity: 0, x: 25, duration: 0.5, stagger: 0.1, clearProps: 'transform,opacity' },
      '-=0.4'
    )

    // Continuous subtle breathing animation on sparkle icon
    gsap.to('.sparkle-icon', {
      scale: 1.15,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.easeInOut'
    })

    // Scroll Shrink / Sleek Navbar effect
    const handleScroll = () => {
      if (window.scrollY > 40) {
        gsap.to('.cirrus-navbar', {
          height: 48,
          paddingLeft: 16,
          paddingRight: 10,
          boxShadow: '0 16px 40px -10px rgba(15, 23, 42, 0.18), 0 0 20px rgba(37, 99, 235, 0.12)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      } else {
        gsap.to('.cirrus-navbar', {
          height: 58,
          paddingLeft: 20,
          paddingRight: 12,
          boxShadow: '0 12px 36px -8px rgba(15, 23, 42, 0.1), 0 2px 8px rgba(15, 23, 42, 0.04)',
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto'
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, { scope: navRef })

  // Sliding Tab Highlight Indicator Position Updates
  const updateHighlight = (targetEl) => {
    if (!targetEl || !highlightRef.current || !navMenuRef.current) return
    const menuRect = navMenuRef.current.getBoundingClientRect()
    const targetRect = targetEl.getBoundingClientRect()

    const left = targetRect.left - menuRect.left
    const width = targetRect.width

    gsap.to(highlightRef.current, {
      left: left,
      width: width,
      opacity: 1,
      duration: 0.35,
      ease: 'power3.out'
    })
  }

  // Update highlight on route change or initial load
  useEffect(() => {
    if (!navMenuRef.current) return
    const activeTab = navMenuRef.current.querySelector('.nav-tab.active')
    if (activeTab) {
      updateHighlight(activeTab)
    } else {
      gsap.to(highlightRef.current, { opacity: 0, duration: 0.2 })
    }
  }, [location.pathname, links])

  const handleTabMouseEnter = (e) => {
    updateHighlight(e.currentTarget)
  }

  const handleTabMouseLeave = () => {
    if (!navMenuRef.current) return
    const activeTab = navMenuRef.current.querySelector('.nav-tab.active')
    if (activeTab) {
      updateHighlight(activeTab)
    } else {
      gsap.to(highlightRef.current, { opacity: 0, duration: 0.2 })
    }
  }

  // Magnetic Button Effect on CTA
  const handleCtaMouseMove = (e) => {
    const btn = e.currentTarget
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    gsap.to(btn, {
      x: x * 0.3,
      y: y * 0.3,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    })

    const icon = btn.querySelector('.cta-icon')
    if (icon) {
      gsap.to(icon, {
        x: 3,
        y: -3,
        rotate: 45,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const signinIcon = btn.querySelector('.signin-icon')
    if (signinIcon) {
      gsap.to(signinIcon, {
        x: 4,
        rotate: -12,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }

  const handleCtaMouseLeave = (e) => {
    const btn = e.currentTarget
    gsap.to(btn, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)'
    })

    const icon = btn.querySelector('.cta-icon')
    if (icon) {
      gsap.to(icon, {
        x: 0,
        y: 0,
        rotate: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const signinIcon = btn.querySelector('.signin-icon')
    if (signinIcon) {
      gsap.to(signinIcon, {
        x: 0,
        rotate: 0,
        duration: 0.4,
        ease: 'power2.out'
      })
    }
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="cirrus-nav-wrapper" ref={navRef}>
      <div className="container nav-container">
        {/* Floating White Pill Navbar */}
        <nav 
          className="cirrus-navbar"
          style={{
            borderColor: currentRainbow.border,
            boxShadow: `0 16px 45px -8px rgba(15, 23, 42, 0.22), 0 0 25px ${currentRainbow.glow}`,
            transition: 'border-color 0.6s ease, box-shadow 0.6s ease'
          }}
        >
          {/* Animated Glow aura border line */}
          <div className="navbar-glow-border" />

          {/* Logo / Brand */}
          <Link to="/" className="nav-brand">
            <div 
              className="cirrus-asterisk-icon"
              style={{
                background: currentRainbow.hex,
                boxShadow: `0 4px 14px ${currentRainbow.glow}`,
                transition: 'background 0.6s ease, box-shadow 0.6s ease'
              }}
            >
              <Sparkles size={16} className="sparkle-icon" />
            </div>
            <span className="brand-name">AI Coach</span>
          </Link>

          {/* Centered Role-Scoped Navigation Links with Sliding Pill Highlight */}
          <div
            className="nav-menu-center desktop-only"
            ref={navMenuRef}
            onMouseLeave={handleTabMouseLeave}
          >
            <div className="nav-tab-highlight" ref={highlightRef} />
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-tab ${location.pathname === to ? 'active' : ''}`}
                onMouseEnter={handleTabMouseEnter}
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
                  <Link
                    to="/simulator"
                    className="btn-black-pill nav-cta magnetic-btn"
                    onMouseMove={handleCtaMouseMove}
                    onMouseLeave={handleCtaMouseLeave}
                  >
                    <span>Start Mock</span>
                    <ArrowUpRight size={15} className="cta-icon" />
                  </Link>
                )}
              </>
            ) : (
              <>
                <button
                  className="sign-in-btn magnetic-btn"
                  onClick={() => openAuthModal('login')}
                  onMouseMove={handleCtaMouseMove}
                  onMouseLeave={handleCtaMouseLeave}
                >
                  <LogIn size={15} className="signin-icon" />
                  <span>Sign In</span>
                </button>
                <button
                  className="btn-black-pill nav-cta magnetic-btn"
                  onClick={handleGetStartedDemo}
                  onMouseMove={handleCtaMouseMove}
                  onMouseLeave={handleCtaMouseLeave}
                >
                  <span>Get Started</span>
                  <ArrowUpRight size={15} className="cta-icon" />
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
                onClick={() => { setMobileMenuOpen(false); openAuthModal('login') }}
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

