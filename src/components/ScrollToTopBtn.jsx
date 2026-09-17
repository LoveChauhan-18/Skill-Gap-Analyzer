import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { useLenis } from './SmoothScroll'
import './ScrollToTopBtn.css'

export default function ScrollToTopBtn() {
  const [visible, setVisible] = useState(false)
  const lenis = useLenis()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 320) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className={`scroll-top-wrapper ${visible ? 'visible' : ''}`}>
      <button 
        type="button"
        className="scroll-top-btn" 
        onClick={scrollToTop}
        title="Scroll to Top"
      >
        <ArrowUp size={16} className="scroll-top-icon" />
        <span>Back to Top</span>
      </button>
    </div>
  )
}
