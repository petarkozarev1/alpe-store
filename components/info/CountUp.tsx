'use client'

import { useEffect, useRef, useState } from 'react'

export default function CountUp({
  value,
  decimals = 0,
  className = '',
}: {
  value: number
  decimals?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') return
    const el = ref.current
    if (!el) return
    let frame = 0
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / 900)
        const eased = 1 - (1 - progress) ** 3
        setShown(value * eased)
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      setShown(0)
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  const text = decimals > 0 ? shown.toFixed(decimals) : String(Math.round(shown))
  return <span ref={ref} className={className}>{text}</span>
}
