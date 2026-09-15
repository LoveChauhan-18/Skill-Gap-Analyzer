import React, { useEffect, useRef } from 'react'
import './AnimatedBackground.css'

export default function AnimatedBackground() {
  const canvasRef = useRef(null)

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

        // Create random puff circles for this cloud
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

      // Draw soft cloud particles
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
      {/* Painterly Sky Gradient Backdrop */}
      <div className="sky-gradient-base" />

      {/* Sun Ray Glow */}
      <div className="sky-sun-glow" />

      {/* Painterly Fluffy Cloud Layers */}
      <div className="painterly-cloud cloud-layer-1" />
      <div className="painterly-cloud cloud-layer-2" />
      <div className="painterly-cloud cloud-layer-3" />

      {/* Canvas for fine drifting clouds */}
      <canvas ref={canvasRef} className="sky-cloud-canvas" />
    </div>
  )
}
