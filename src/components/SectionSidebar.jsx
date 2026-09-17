import React, { useState, useEffect, useRef } from 'react'
import {
  Sparkles,
  BarChart3,
  Zap,
  Target,
  Star,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLenis } from './SmoothScroll'
import './SectionSidebar.css'

const SECTIONS = [
  { id: 'hero',         label: 'Hero',          icon: Sparkles,    colorClass: 'sec-blue',     accent: '#2563eb' },
  { id: 'stats',        label: 'Platform Stats', icon: BarChart3,   colorClass: 'sec-amber',    accent: '#ea580c' },
  { id: 'features',     label: 'Features',      icon: Zap,         colorClass: 'sec-violet',   accent: '#9333ea' },
  { id: 'how-it-works', label: 'How It Works',  icon: Target,      colorClass: 'sec-emerald',  accent: '#059669' },
  { id: 'testimonials', label: 'Reviews',       icon: Star,        colorClass: 'sec-rose',     accent: '#e11d48' },
  { id: 'faq',          label: 'FAQ',           icon: HelpCircle,  colorClass: 'sec-cyan',     accent: '#0891b2' },
]

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

export default function SectionSidebar() {
  const [activeSection, setActiveSection] = useState('hero')
  const [collapsed, setCollapsed] = useState(false)
  const [rainbowIndex, setRainbowIndex] = useState(0)
  const sidebarRef = useRef(null)
  const navListRef = useRef(null)
  const indicatorRef = useRef(null)
  const lenis = useLenis()

  // 1-Second Rainbow Color Cycle Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setRainbowIndex((prev) => (prev + 1) % RAINBOW_PALETTE.length)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const currentRainbow = RAINBOW_PALETTE[rainbowIndex]

  // GSAP Entrance animation sequence
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    // 1. Sidebar Card entrance
    tl.fromTo(
      sidebarRef.current,
      { x: -70, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.4)', delay: 0.3, clearProps: 'transform,opacity' }
    )

    // 2. Stagger items reveal
    tl.from(
      '.sidebar-nav-item',
      { x: -20, opacity: 0, duration: 0.4, stagger: 0.06, clearProps: 'transform,opacity' },
      '-=0.4'
    )
  }, { scope: sidebarRef })

  // Update sliding active indicator position
  useEffect(() => {
    if (!navListRef.current || !indicatorRef.current) return
    const activeItem = navListRef.current.querySelector('.sidebar-nav-item.active')
    if (activeItem) {
      const listRect = navListRef.current.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const top = itemRect.top - listRect.top
      const height = itemRect.height

      gsap.to(indicatorRef.current, {
        top: top,
        height: height,
        opacity: 1,
        duration: 0.35,
        ease: 'power3.out'
      })

      // Icon pop effect on active section
      const icon = activeItem.querySelector('.sidebar-icon-box')
      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 0.8, rotate: -15 },
          { scale: 1, rotate: 0, duration: 0.4, ease: 'back.out(2)' }
        )
      }
    }
  }, [activeSection, collapsed])

  // Highlight active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (lenis && el) {
      lenis.scrollTo(el, { offset: -60, duration: 1.2 })
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Magnetic Item Hover Effect
  const handleItemMouseMove = (e) => {
    const item = e.currentTarget
    const rect = item.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width / 2)
    const y = e.clientY - (rect.top + rect.height / 2)

    gsap.to(item, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleItemMouseLeave = (e) => {
    const item = e.currentTarget
    gsap.to(item, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'elastic.out(1, 0.4)'
    })
  }

  return (
    <aside
      className={`section-sidebar-wrapper ${collapsed ? 'collapsed' : ''}`}
      ref={sidebarRef}
    >
      <div 
        className="section-sidebar-card"
        style={{
          borderColor: currentRainbow.border,
          boxShadow: `0 20px 50px -10px rgba(15, 23, 42, 0.25), 0 0 25px ${currentRainbow.glow}`,
          transition: 'border-color 0.6s ease, box-shadow 0.6s ease'
        }}
      >
        {/* Glow Shimmer Overlay */}
        <div className="sidebar-glow-border" />

        {/* Toggle Collapse Button */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Quick Nav" : "Collapse Quick Nav"}
          style={{
            background: currentRainbow.hex,
            boxShadow: `0 4px 14px ${currentRainbow.glow}`,
            transition: 'background 0.6s ease, box-shadow 0.6s ease'
          }}
        >
          {collapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        <div className="sidebar-header">
          <span className="sidebar-title">Navigation</span>
        </div>

        {/* Section Links */}
        <nav className="sidebar-nav-list" ref={navListRef}>
          <div className="sidebar-active-indicator" ref={indicatorRef} />
          {SECTIONS.map(({ id, label, icon: Icon, colorClass, accent }) => {
            const isActive = activeSection === id
            return (
              <button
                key={id}
                className={`sidebar-nav-item ${colorClass} ${isActive ? 'active' : ''}`}
                onClick={() => scrollToSection(id)}
                onMouseMove={handleItemMouseMove}
                onMouseLeave={handleItemMouseLeave}
              >
                <div className="sidebar-icon-box" style={{ color: isActive ? '#ffffff' : accent }}>
                  <Icon size={16} />
                </div>
                <span className="sidebar-label">{label}</span>
                {isActive && (
                  <div 
                    className="active-dot" 
                    style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} 
                  />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
