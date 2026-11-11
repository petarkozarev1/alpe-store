'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { clipSource, pdpUgcClips, type PdpUgcClip } from '@/lib/pdp-ugc'

function Icon({ name }: { name: 'play' | 'pause' | 'muted' | 'sound' | 'close' | 'prev' | 'next' }) {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true as const }
  if (name === 'play') {
    return <svg {...common}><path d="M5 3.5v9l8-4.5-8-4.5z" fill="currentColor" /></svg>
  }
  if (name === 'pause') {
    return <svg {...common}><path d="M4.5 3h2.2v10H4.5V3zm4.8 0H11.5v10H9.3V3z" fill="currentColor" /></svg>
  }
  if (name === 'muted') {
    return <svg {...common}><path d="M3 6.2h2.2L8.2 3.5v9L5.2 9.8H3V6.2zM11 6.2l2.4 2.4M13.4 6.2L11 8.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
  }
  if (name === 'sound') {
    return <svg {...common}><path d="M3 6.2h2.2L8.2 3.5v9L5.2 9.8H3V6.2zM10 6.1a2.6 2.6 0 010 3.8M11.6 4.6a4.6 4.6 0 010 6.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
  }
  if (name === 'close') {
    return <svg {...common}><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  }
  if (name === 'prev') {
    return <svg {...common}><path d="M10 3.5L5 8l5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  }
  return <svg {...common}><path d="M6 3.5L11 8l-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function applyStart(video: HTMLVideoElement, clip: PdpUgcClip) {
  if (clip.startAt == null || clip.startAt <= 0) return
  if (video.currentTime < clip.startAt - 0.2) video.currentTime = clip.startAt
}

export default function PdpUgcReel({ locale }: { locale: Locale }) {
  const en = locale === 'en'
  const scroller = useRef<HTMLDivElement>(null)
  const videos = useRef<Array<HTMLVideoElement | null>>([])
  const pausedByUser = useRef<Set<string>>(new Set())
  const [bar, setBar] = useState({ thumb: 40, offset: 0 })
  const [playing, setPlaying] = useState<Record<string, boolean>>({})
  const [muted, setMuted] = useState<Record<string, boolean>>({})
  const [open, setOpen] = useState<number | null>(null)
  const touchX = useRef<number | null>(null)
  const swiped = useRef(false)

  const copy = {
    eyebrow: en ? 'Worn on Instagram' : 'Носят ги в Instagram',
    open: en ? 'Open video' : 'Отвори видеото',
    play: en ? 'Play' : 'Пусни',
    pause: en ? 'Pause' : 'Пауза',
    mute: en ? 'Mute' : 'Без звук',
    unmute: en ? 'Unmute' : 'Със звук',
    close: en ? 'Close' : 'Затвори',
    prev: en ? 'Previous video' : 'Предишно видео',
    next: en ? 'Next video' : 'Следващо видео',
  }

  function measure() {
    const node = scroller.current
    if (!node) return
    const thumb = Math.min(100, (node.clientWidth / Math.max(node.scrollWidth, 1)) * 100)
    const max = node.scrollWidth - node.clientWidth
    const offset = max <= 1 ? 0 : (node.scrollLeft / node.scrollWidth) * 100
    setBar({ thumb, offset })
  }

  function resumeVisible() {
    const root = scroller.current
    if (!root) return
    videos.current.forEach((video) => {
      if (!video) return
      const id = video.dataset.clipId
      if (!id || pausedByUser.current.has(id)) return
      const rect = video.getBoundingClientRect()
      const rootRect = root.getBoundingClientRect()
      const overlap = Math.min(rect.right, rootRect.right) - Math.max(rect.left, rootRect.left)
      if (overlap > rect.width * 0.55) video.play().catch(() => {})
    })
  }

  useEffect(() => {
    const root = scroller.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    const nodes = videos.current.filter((node): node is HTMLVideoElement => Boolean(node))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement
        const id = video.dataset.clipId
        const clip = pdpUgcClips.find((item) => item.id === id)
        if (!clip) return
        if (entry.intersectionRatio >= 0.15 && !video.getAttribute('src')) {
          video.preload = 'metadata'
          video.src = clipSource(clip)
        }
        if (entry.intersectionRatio >= 0.55 && !pausedByUser.current.has(clip.id)) {
          video.play().catch(() => {})
        } else if (entry.intersectionRatio < 0.2) {
          video.pause()
        }
      })
    }, { root, threshold: [0.15, 0.55] })
    nodes.forEach((node) => observer.observe(node))
    measure()
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (open == null) {
      resumeVisible()
      return
    }
    videos.current.forEach((video) => video?.pause())
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') setOpen((index) => (index == null ? index : (index + 1) % pdpUgcClips.length))
      if (event.key === 'ArrowLeft') setOpen((index) => (index == null ? index : (index - 1 + pdpUgcClips.length) % pdpUgcClips.length))
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function togglePlay(clip: PdpUgcClip, index: number) {
    const video = videos.current[index]
    if (!video) return
    if (video.paused) {
      pausedByUser.current.delete(clip.id)
      if (!video.getAttribute('src')) {
        video.preload = 'metadata'
        video.src = clipSource(clip)
      }
      video.play().catch(() => {})
    } else {
      pausedByUser.current.add(clip.id)
      video.pause()
    }
  }

  function toggleMute(clip: PdpUgcClip, index: number) {
    const video = videos.current[index]
    if (!video) return
    const willUnmute = muted[clip.id] !== false
    video.muted = !willUnmute
    if (willUnmute) {
      videos.current.forEach((other, otherIndex) => {
        if (other && otherIndex !== index) other.muted = true
      })
      const updated: Record<string, boolean> = {}
      pdpUgcClips.forEach((item) => { updated[item.id] = item.id !== clip.id })
      setMuted(updated)
    } else {
      setMuted((current) => ({ ...current, [clip.id]: true }))
    }
  }

  const active = open == null ? null : pdpUgcClips[open]

  return (
    <section aria-label={copy.eyebrow}>
      <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-gold">{copy.eyebrow}</p>
      <div
        ref={scroller}
        onScroll={measure}
        className="pdp-ugc-row mt-3 flex gap-2.5 overflow-x-auto overscroll-x-contain"
      >
        {pdpUgcClips.map((clip, index) => {
          const isPlaying = playing[clip.id] === true
          const isMuted = muted[clip.id] !== false
          return (
            <article
              key={clip.id}
              className="pdp-ugc-card relative shrink-0 snap-start overflow-hidden rounded-[18px] bg-onyx bg-cover bg-center"
              style={{ backgroundImage: `url(${clip.poster})` }}
            >
              <button
                type="button"
                className="absolute inset-0 z-[1]"
                aria-label={`${copy.open} ${index + 1}`}
                onClick={() => setOpen(index)}
              />
              <video
                ref={(node) => { videos.current[index] = node }}
                data-clip-id={clip.id}
                poster={clip.poster}
                muted
                playsInline
                loop={clip.startAt == null}
                preload="none"
                width={540}
                height={960}
                className="absolute inset-0 h-full w-full object-cover"
                onLoadedMetadata={(event) => applyStart(event.currentTarget, clip)}
                onEnded={(event) => {
                  if (clip.startAt == null) return
                  event.currentTarget.currentTime = clip.startAt
                  event.currentTarget.play().catch(() => {})
                }}
                onPlay={() => setPlaying((current) => ({ ...current, [clip.id]: true }))}
                onPause={() => setPlaying((current) => ({ ...current, [clip.id]: false }))}
              />
              <div className="absolute bottom-2 left-2 right-2 z-[2] flex items-center justify-between">
                <button
                  type="button"
                  aria-label={isPlaying ? copy.pause : copy.play}
                  onClick={() => togglePlay(clip, index)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-onyx/75 text-linen"
                >
                  <Icon name={isPlaying ? 'pause' : 'play'} />
                </button>
                <button
                  type="button"
                  aria-label={isMuted ? copy.unmute : copy.mute}
                  aria-pressed={!isMuted}
                  onClick={() => toggleMute(clip, index)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-onyx/75 text-linen"
                >
                  <Icon name={isMuted ? 'muted' : 'sound'} />
                </button>
              </div>
            </article>
          )
        })}
      </div>
      <div className="relative mt-3 h-0.5 overflow-hidden rounded-full bg-iron/15" aria-hidden="true">
        <div className="absolute top-0 h-full rounded-full bg-gold" style={{ width: `${bar.thumb}%`, left: `${bar.offset}%` }} />
      </div>
      <style>{`
        .pdp-ugc-row { scrollbar-width: none; scroll-snap-type: x mandatory; }
        .pdp-ugc-row::-webkit-scrollbar { display: none; }
        .pdp-ugc-card {
          width: calc((100% - 10px) / 1.6);
          aspect-ratio: 9 / 16;
        }
        @media (min-width: 768px) {
          .pdp-ugc-card { width: calc((100% - 20px) / 2.3); }
        }
      `}</style>

      {active && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-onyx/92 px-4"
          role="dialog"
          aria-modal="true"
          aria-label={copy.eyebrow}
          onClick={() => {
            if (swiped.current) {
              swiped.current = false
              return
            }
            setOpen(null)
          }}
          onTouchStart={(event) => { touchX.current = event.changedTouches[0]?.clientX ?? null }}
          onTouchEnd={(event) => {
            if (touchX.current == null || open == null) return
            const delta = (event.changedTouches[0]?.clientX ?? touchX.current) - touchX.current
            if (Math.abs(delta) > 48) {
              swiped.current = true
              setOpen((open + (delta < 0 ? 1 : -1) + pdpUgcClips.length) % pdpUgcClips.length)
            }
            touchX.current = null
          }}
        >
          <button
            type="button"
            aria-label={copy.close}
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-linen/15 text-linen"
          >
            <Icon name="close" />
          </button>
          <button
            type="button"
            aria-label={copy.prev}
            onClick={(event) => {
              event.stopPropagation()
              setOpen((open! - 1 + pdpUgcClips.length) % pdpUgcClips.length)
            }}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-linen/15 text-linen"
          >
            <Icon name="prev" />
          </button>
          <video
            key={active.id}
            src={clipSource(active)}
            poster={active.poster}
            autoPlay
            playsInline
            controls
            loop={active.startAt == null}
            width={540}
            height={960}
            className="h-[min(86vh,860px)] w-auto max-w-full rounded-[18px] bg-onyx object-contain"
            onClick={(event) => event.stopPropagation()}
            onLoadedMetadata={(event) => applyStart(event.currentTarget, active)}
            onEnded={(event) => {
              if (active.startAt == null) return
              event.currentTarget.currentTime = active.startAt
              event.currentTarget.play().catch(() => {})
            }}
          />
          <button
            type="button"
            aria-label={copy.next}
            onClick={(event) => {
              event.stopPropagation()
              setOpen((open! + 1) % pdpUgcClips.length)
            }}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-linen/15 text-linen"
          >
            <Icon name="next" />
          </button>
        </div>
      )}
    </section>
  )
}
