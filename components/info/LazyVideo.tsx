'use client'

import { useEffect, useRef } from 'react'

export default function LazyVideo({
  src,
  poster,
  label,
}: {
  src: string
  poster: string
  label: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video || typeof IntersectionObserver === 'undefined') return
    video.defaultMuted = true
    video.muted = true
    video.setAttribute('muted', '')
    video.playsInline = true
    video.setAttribute('playsinline', '')
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    }, { threshold: 0.55 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      poster={poster}
      muted
      playsInline
      loop
      preload="none"
      aria-label={label}
    >
      <source src={src} type="video/mp4" />
    </video>
  )
}
