import React, { useEffect, useState, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const trailRef = useRef(null)

  const mousePos = useRef({ x: -100, y: -100 })
  const ringPos = useRef({ x: -100, y: -100 })
  const trailPos = useRef({ x: -100, y: -100 })

  const [hoverState, setHoverState] = useState('default') // 'default' | 'clickable' | 'text' | 'view'
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Check if touch device
    const checkTouch = () => {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches
    }

    if (checkTouch()) {
      setIsTouchDevice(true)
      return
    }

    document.body.classList.add('custom-cursor-enabled')

    let animId

    const onMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!isVisible) setIsVisible(true)

      // Direct update dot position for zero lag
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      }

      // Check hover element target
      const target = e.target
      if (target) {
        const interactiveEl = target.closest('button, a, input, select, textarea, [role="button"], .btn-black-pill, .btn-white-pill, .cirrus-card, .interactive')
        const textEl = target.closest('p, h1, h2, h3, h4, h5, h6, blockquote, code')

        if (interactiveEl) {
          setHoverState('clickable')
        } else if (textEl && !interactiveEl) {
          setHoverState('text')
        } else {
          setHoverState('default')
        }
      }
    }

    const onMouseDown = () => setIsMouseDown(true)
    const onMouseUp = () => setIsMouseDown(false)
    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.body.addEventListener('mouseleave', onMouseLeave)
    document.body.addEventListener('mouseenter', onMouseEnter)

    // Smooth Lerp animation loop for ring and outer aura
    const render = () => {
      // Lerp for outer ring (speed 0.18)
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.18
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.18

      // Lerp for trail aura (speed 0.08)
      trailPos.current.x += (mousePos.current.x - trailPos.current.x) * 0.08
      trailPos.current.y += (mousePos.current.y - trailPos.current.y) * 0.08

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)

    return () => {
      document.body.classList.remove('custom-cursor-enabled')
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.removeEventListener('mouseleave', onMouseLeave)
      document.body.removeEventListener('mouseenter', onMouseEnter)
      cancelAnimationFrame(animId)
    }
  }, [isVisible])

  if (isTouchDevice) return null

  return (
    <div className={`custom-cursor-container ${isVisible ? 'is-visible' : ''} ${isMouseDown ? 'is-clicking' : ''} state-${hoverState}`}>
      {/* Outer Soft Ambient Glow Trail */}
      <div ref={trailRef} className="cursor-trail" />

      {/* Main Smooth Follower Ring */}
      <div ref={ringRef} className="cursor-ring">
        <div className="cursor-ring-inner" />
      </div>

      {/* Crisp Precision Center Pointer Dot */}
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
