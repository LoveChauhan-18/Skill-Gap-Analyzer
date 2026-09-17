import React, { useState, useEffect } from 'react'
import './ScrollProgressBar.css'

export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight)
        setScrollProgress(Math.min(1, Math.max(0, currentProgress)))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-progress-container">
      <div 
        className="scroll-progress-bar"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    </div>
  )
}
