'use client'

import { useState } from 'react'

const CLIPS = [
  { name: 'customer', src: '/media/changed-my-life.mp4', poster: '/media/changed-my-life-poster.jpg' },
  { name: 'geri', src: '/media/geri-sofa.mp4', poster: '/media/geri-sofa-poster.jpg' },
] as const

function clipLabel(name: typeof CLIPS[number]['name'], en: boolean) {
  if (name === 'customer') return en ? 'Customer' : 'Клиент'
  return en ? 'Geri' : 'Гери'
}

export default function ProofClips({ locale = 'bg' }: { locale?: string }) {
  const en = locale === 'en'
  return (
    <div className="flex gap-2">
      {CLIPS.map(clip => (
        <Clip key={clip.src} clip={clip} label={en ? 'Play' : 'Пусни'} name={clipLabel(clip.name, en)} />
      ))}
    </div>
  )
}

function Clip({ clip, label, name }: { clip: typeof CLIPS[number]; label: string; name: string }) {
  const [playing, setPlaying] = useState(false)
  return (
    <button
      type="button"
      onClick={event => {
        const video = event.currentTarget.querySelector('video')
        if (!video || playing) return
        video.muted = false
        setPlaying(true)
        video.play().catch(() => undefined)
      }}
      className="relative h-24 w-16 overflow-hidden rounded-xl bg-onyx"
      aria-label={`${label} ${name}`}
    >
      <video
        src={clip.src}
        poster={clip.poster}
        playsInline
        preload="none"
        controls={playing}
        className="h-full w-full object-cover"
      />
      {!playing && (
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/80 to-transparent px-1 pb-1 text-left font-sans text-[9px] font-semibold text-linen">
          ▶ {name}
        </span>
      )}
    </button>
  )
}
