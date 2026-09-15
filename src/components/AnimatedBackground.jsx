import React, { useState, useEffect, useRef } from 'react'
import './AnimatedBackground.css'

export const SKY_THEMES = [
  {
    id: 'sky-blue',
    name: 'Cirrus Sky Blue',
    gradient: 'linear-gradient(180deg, #4194d6 0%, #5aa4e0 35%, #7bbceb 65%, #a2d1f4 85%, #d1ebff 100%)',
    sunGlow: 'radial-gradient(circle, rgba(255, 255, 255, 0.45) 0%, rgba(255, 245, 220, 0.2) 40%, transparent 70%)',
    badgeBg: '#2563eb'
  },
  {
    id: 'sunset-violet',
    name: 'Sunset Twilight',
    gradient: 'linear-gradient(180deg, #4c2882 0%, #6b359c 35%, #9d4ead 65%, #d16bb6 85%, #fce1e4 100%)',
    sunGlow: 'radial-gradient(circle, rgba(255, 200, 150, 0.5) 0%, rgba(255, 120, 180, 0.25) 40%, transparent 70%)',
    badgeBg: '#9333ea'
  },
  {
    id: 'aurora-teal',
    name: 'Aurora Cyan',
    gradient: 'linear-gradient(180deg, #0b5563 0%, #117888 35%, #1fa5a7 65%, #56cfbe 85%, #cef7ee 100%)',
    sunGlow: 'radial-gradient(circle, rgba(160, 255, 240, 0.5) 0%, rgba(50, 220, 200, 0.2) 40%, transparent 70%)',
    badgeBg: '#0d9488'
  },
  {
    id: 'twilight-amber',
    name: 'Golden Amber Dusk',
    gradient: 'linear-gradient(180deg, #7a3a18 0%, #a45025 35%, #ce6f32 65%, #ee994c 85%, #ffe6c7 100%)',
    sunGlow: 'radial-gradient(circle, rgba(255, 230, 170, 0.55) 0%, rgba(255, 160, 80, 0.25) 40%, transparent 70%)',
    badgeBg: '#ea580c'
  },
  {
    id: 'dusk-rose',
    name: 'Dusk Rose Bloom',
    gradient: 'linear-gradient(180deg, #6c2243 0%, #94345d 35%, #bf4d7d 65%, #df789c 85%, #fde2ec 100%)',
    sunGlow: 'radial-gradient(circle, rgba(255, 210, 230, 0.5) 0%, rgba(240, 130, 180, 0.25) 40%, transparent 70%)',
    badgeBg: '#db2777'
  },
  {
    id: 'midnight-indigo',
    name: 'Midnight Indigo',
    gradient: 'linear-gradient(180deg, #1e295b 0%, #2f3e79 35%, #475aa4 65%, #768cd3 85%, #dbeafe 100%)',
    sunGlow: 'radial-gradient(circle, rgba(190, 210, 255, 0.45) 0%, rgba(130, 160, 240, 0.2) 40%, transparent 70%)',
    badgeBg: '#4f46e5'
  },
  {
    id: 'emerald-aurora',
    name: 'Emerald Aurora',
    gradient: 'linear-gradient(180deg, #154c37 0%, #227052 35%, #319871 65%, #64ca9b 85%, #d1fae5 100%)',
    sunGlow: 'radial-gradient(circle, rgba(180, 255, 210, 0.5) 0%, rgba(80, 220, 150, 0.25) 40%, transparent 70%)',
    badgeBg: '#059669'
  }
]

export default function AnimatedBackground() {
  const canvasRef = useRef(null)
  const [activeThemeIndex, setActiveThemeIndex] = useState(0)

  // 2-Second Color Transition Interval (runs silently in background)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveThemeIndex((prev) => (prev + 1) % SKY_THEMES.length)
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationFrameId
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    /* Drifting cloud particle clusters */
    class Cloud {
      constructor() {
        this.reset(true)
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * width : -300
        this.y = Math.random() * (height * 0.75)
        this.speed = 0.15 + Math.random() * 0.25
        this.scale = 0.6 + Math.random() * 0.8
        this.opacity = 0.25 + Math.random() * 0.35

        this.puffs = []
        const numPuffs = 5 + Math.floor(Math.random() * 5)
        for (let i = 0; i < numPuffs; i++) {
          this.puffs.push({
            dx: (Math.random() - 0.5) * 140 * this.scale,
            dy: (Math.random() - 0.5) * 60 * this.scale,
            radius: (40 + Math.random() * 55) * this.scale,
          })
        }
      }

      update() {
        this.x += this.speed
        if (this.x > width + 300) {
          this.reset(false)
        }
      }

      draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`

        this.puffs.forEach((puff) => {
          ctx.beginPath()
          ctx.arc(puff.dx, puff.dy, puff.radius, 0, Math.PI * 2)
          ctx.fill()
        })

        ctx.restore()
      }
    }

    const clouds = Array.from({ length: 14 }, () => new Cloud())

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      clouds.forEach((cloud) => {
        cloud.update()
        cloud.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="cirrus-sky-background">
      {/* Dynamic Painterly Sky Gradient Layers for 2s Crossfade */}
      {SKY_THEMES.map((theme, index) => (
        <div
          key={theme.id}
          className={`sky-gradient-base-layer ${index === activeThemeIndex ? 'active' : ''}`}
          style={{ background: theme.gradient }}
        />
      ))}

      {/* Dynamic Sun Ray Glow */}
      {SKY_THEMES.map((theme, index) => (
        <div
          key={`glow-${theme.id}`}
          className={`sky-sun-glow-layer ${index === activeThemeIndex ? 'active' : ''}`}
          style={{ background: theme.sunGlow }}
        />
      ))}

      {/* Painterly Fluffy Cloud Layers */}
      <div className="painterly-cloud cloud-layer-1" />
      <div className="painterly-cloud cloud-layer-2" />
      <div className="painterly-cloud cloud-layer-3" />

      {/* Canvas for fine drifting clouds */}
      <canvas ref={canvasRef} className="sky-cloud-canvas" />
    </div>
  )
}
