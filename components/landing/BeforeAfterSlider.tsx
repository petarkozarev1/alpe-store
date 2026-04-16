'use client'
import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const onMouseDown = () => { dragging.current = true }
  const onMouseUp = () => { dragging.current = false }
  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) updatePosition(e.clientX)
  }
  const onTouchStart = () => { dragging.current = true }
  const onTouchEnd = () => { dragging.current = false }
  const onTouchMove = (e: React.TouchEvent) => {
    if (dragging.current) updatePosition(e.touches[0].clientX)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/9] rounded-xl overflow-hidden cursor-col-resize select-none"
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onTouchMove={onTouchMove}
    >
      {/* Before image (full) */}
      <div className="absolute inset-0">
        <Image src={beforeImage} alt="" fill sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover" />
      </div>

      {/* After image (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <Image src={afterImage} alt="" fill sizes="(min-width: 1200px) 1200px, 100vw" className="object-cover" />
      </div>

      {/* Divider line */}
      <div
        aria-hidden="true"
        className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
        style={{ left: `${position}%` }}
      />

      {/* Handle — keyboard-accessible slider */}
      <div
        role="slider"
        aria-label={`Before/After comparison — ${beforeLabel} vs ${afterLabel}`}
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center gap-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ left: `${position}%` }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') setPosition(p => Math.max(0, p - 1))
          if (e.key === 'ArrowRight') setPosition(p => Math.min(100, p + 1))
        }}
      >
        <span aria-hidden="true" className="text-xs font-bold text-brand-black">‹</span>
        <span aria-hidden="true" className="text-xs font-bold text-brand-black">›</span>
      </div>

      {/* Labels */}
      <span aria-hidden="true" className="absolute top-4 left-4 bg-white/90 text-brand-black text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        {beforeLabel}
      </span>
      <span aria-hidden="true" className="absolute top-4 right-4 bg-white/90 text-brand-black text-xs font-semibold px-3 py-1.5 rounded-full z-10">
        {afterLabel}
      </span>
    </div>
  )
}
