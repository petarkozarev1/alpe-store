'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { heroContent } from '@/lib/data/content'

type Tile =
  | { kind: 'talk'; name: string; src: string; poster: string }
  | { kind: 'loop'; name: string; src: string; poster: string }
  | { kind: 'clip'; name: string; src: string; poster: string }
  | { kind: 'photo'; name: string; src: string; alt: string }

const TILES: Tile[] = [
  { kind: 'talk', name: 'Илияна', src: '/media/iliyana-testimonial.mp4', poster: '/media/iliyana-poster.jpg' },
  { kind: 'talk', name: 'Creator review', src: '/media/circadian-creator.mp4', poster: '/media/circadian-creator-poster.jpg' },
  { kind: 'talk', name: 'Клиент', src: '/media/changed-my-life.mp4', poster: '/media/changed-my-life-poster.jpg' },
  { kind: 'talk', name: 'Гери · кухня', src: '/media/geri-kitchen.mp4', poster: '/media/geri-kitchen-poster.jpg' },
  { kind: 'talk', name: 'Гери · диван', src: '/media/geri-sofa.mp4', poster: '/media/geri-sofa-poster.jpg' },
  { kind: 'loop', name: 'Гери', src: '/media/geri-broll.mp4', poster: '/media/geri-broll-poster.jpg' },
  { kind: 'photo', name: 'Вкъщи', src: '/media/lifestyle-sofa.jpg', alt: 'Жена с жълтия чифт AMPÉ на дивана' },
  { kind: 'clip', name: 'Калоян', src: '/media/kaloyan-ugc.mp4', poster: '/media/kaloyan-poster.jpg' },
  { kind: 'photo', name: 'Селфи', src: '/media/influencer-selfie-01.jpg', alt: 'Селфи с жълтия чифт AMPÉ' },
  { kind: 'photo', name: 'Селфи', src: '/media/influencer-selfie-02.jpg', alt: 'Селфи с дневния чифт AMPÉ' },
  { kind: 'photo', name: 'Селфи', src: '/media/influencer-selfie-03.jpg', alt: 'Селфи с жълтите стъкла AMPÉ' },
  { kind: 'photo', name: 'Селфи', src: '/media/influencer-selfie-04.jpg', alt: 'Селфи с чифт AMPÉ' },
  ...heroContent.heroFaceImages.map(face => ({
    kind: 'photo' as const,
    name: 'AMPÉ',
    src: face.src,
    alt: face.alt,
  })),
]

function LoopTile({ tile }: { tile: Extract<Tile, { kind: 'loop' }> }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => undefined)
      else el.pause()
    }, { rootMargin: '160px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return (
    <video
      ref={ref}
      src={tile.src}
      poster={tile.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={tile.name}
      className="h-full w-full object-cover"
    />
    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/70 to-transparent p-3 font-sans text-sm font-semibold text-linen">{tile.name}</span>
  )
}

function TalkTile({ tile }: { tile: Extract<Tile, { kind: 'talk' | 'clip' }> }) {
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)
  const featured = tile.kind === 'talk'

  const play = () => {
    const el = ref.current
    if (!el) return
    el.muted = !featured
    setPlaying(true)
    el.play().catch(() => undefined)
  }

  return (
    <button type="button" onClick={play} className="relative h-full w-full text-left" aria-label={featured ? `Пусни видеото на ${tile.name}` : tile.name}>
      <video
        ref={ref}
        src={tile.src}
        poster={tile.poster}
        playsInline
        preload="none"
        controls={playing}
        className="h-full w-full object-cover"
      />
      {!playing && (
        <span className="absolute inset-0 flex items-end bg-gradient-to-t from-onyx/70 to-transparent p-3">
          <span className="font-sans text-sm font-semibold text-linen">
            {featured ? '▶ ' : ''}{tile.name}
          </span>
        </span>
      )}
    </button>
  )
}

export default function UgcRail({ locale = 'bg' }: { locale?: string }) {
  const en = locale === 'en'
  return (
    <section aria-label={en ? 'Customer videos and photos' : 'Видеа и снимки от клиенти'} className="bg-parchment py-8 md:py-10">
      <div className="mx-auto max-w-content px-6 md:px-10">
        <p className="mb-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-iron">
          {en ? 'Worn by real customers' : 'Носени от реални клиенти'}
        </p>
      </div>
      <div className="flex snap-x gap-3 overflow-x-auto px-6 pb-2 md:px-10">
        {TILES.map(tile => (
          <article
            key={`${tile.kind}-${tile.src}`}
            className={`relative shrink-0 snap-start overflow-hidden rounded-2xl bg-onyx ${tile.kind === 'clip' ? 'h-56 w-36' : 'h-72 w-44'}`}
          >
            {tile.kind === 'photo' ? (
              <>
                <Image src={tile.src} alt={tile.alt} fill sizes="176px" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/70 to-transparent p-3 font-sans text-xs text-linen">{tile.name}</span>
              </>
            ) : tile.kind === 'loop' ? (
              <LoopTile tile={tile} />
            ) : (
              <TalkTile tile={tile} />
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
