'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { heroContent } from '@/lib/data/content'

type TileName = 'iliyana' | 'creator' | 'customer' | 'geri' | 'kaloyan' | 'home'

type Tile =
  | { kind: 'talk'; name: TileName; src: string; poster: string }
  | { kind: 'loop'; name: TileName; src: string; poster: string }
  | { kind: 'photo'; name: TileName | 'selfie' | 'brand'; src: string; alt: string }

const TILES: Tile[] = [
  { kind: 'talk', name: 'iliyana', src: '/media/iliyana-testimonial.mp4', poster: '/media/iliyana-poster.jpg' },
  { kind: 'talk', name: 'creator', src: '/media/circadian-creator.mp4', poster: '/media/circadian-creator-poster.jpg' },
  { kind: 'talk', name: 'customer', src: '/media/changed-my-life.mp4', poster: '/media/changed-my-life-poster.jpg' },
  { kind: 'talk', name: 'geri', src: '/media/geri-kitchen.mp4', poster: '/media/geri-kitchen-poster.jpg' },
  { kind: 'talk', name: 'geri', src: '/media/geri-sofa.mp4', poster: '/media/geri-sofa-poster.jpg' },
  { kind: 'loop', name: 'geri', src: '/media/geri-broll.mp4', poster: '/media/geri-broll-poster.jpg' },
  { kind: 'talk', name: 'kaloyan', src: '/media/kaloyan-ugc.mp4', poster: '/media/kaloyan-poster.jpg' },
  { kind: 'photo', name: 'home', src: '/media/lifestyle-sofa.jpg', alt: 'Жена с жълтия чифт AMPÉ на дивана' },
  { kind: 'photo', name: 'selfie', src: '/media/influencer-selfie-01.jpg', alt: 'Селфи с жълтия чифт AMPÉ' },
  { kind: 'photo', name: 'selfie', src: '/media/influencer-selfie-02.jpg', alt: 'Селфи с дневния чифт AMPÉ' },
  { kind: 'photo', name: 'selfie', src: '/media/influencer-selfie-03.jpg', alt: 'Селфи с жълтите стъкла AMPÉ' },
  { kind: 'photo', name: 'selfie', src: '/media/influencer-selfie-04.jpg', alt: 'Селфи с чифт AMPÉ' },
  ...heroContent.heroFaceImages.map(face => ({
    kind: 'photo' as const,
    name: 'brand' as const,
    src: face.src,
    alt: face.alt,
  })),
]

function tileLabel(name: Tile['name'], en: boolean) {
  if (name === 'iliyana') return en ? 'Iliyana' : 'Илияна'
  if (name === 'creator') return en ? 'Creator review' : 'Отзив от създател'
  if (name === 'customer') return en ? 'Customer' : 'Клиент'
  if (name === 'geri') return en ? 'Geri' : 'Гери'
  if (name === 'kaloyan') return en ? 'Kaloyan' : 'Калоян'
  if (name === 'home') return en ? 'At home' : 'Вкъщи'
  if (name === 'selfie') return en ? 'Selfie' : 'Селфи'
  return 'AMPÉ'
}

function LoopTile({ tile, label }: { tile: Extract<Tile, { kind: 'loop' }>; label: string }) {
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
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

function TalkTile({ tile, playLabel }: { tile: Extract<Tile, { kind: 'talk' }>; playLabel: string }) {
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  const play = () => {
    const el = ref.current
    if (!el) return
    el.muted = false
    setPlaying(true)
    el.play().catch(() => undefined)
  }

  return (
    <button type="button" onClick={play} className="absolute inset-0 text-left" aria-label={playLabel}>
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
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-linen/95 text-onyx shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </span>
      )}
    </button>
  )
}

export default function UgcRail({ locale = 'bg' }: { locale?: string }) {
  const en = locale === 'en'
  const scroller = useRef<HTMLDivElement>(null)
  const scrollBy = (direction: number) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: direction * 280, behavior: 'smooth' })
  }

  return (
    <section aria-label={en ? 'Customer videos and photos' : 'Видеа и снимки от клиенти'} className="bg-parchment py-12 md:py-16">
      <div className="mx-auto mb-5 flex max-w-content items-end justify-between px-5 md:px-10">
        <h2 className="font-serif text-2xl font-medium text-iron md:text-3xl">
          {en ? 'Worn by real customers' : 'Носени от реални клиенти'}
        </h2>
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => scrollBy(-1)} aria-label={en ? 'Previous' : 'Назад'} className="flex h-11 w-11 items-center justify-center rounded-full border border-iron/15 text-iron hover:bg-white">‹</button>
          <button type="button" onClick={() => scrollBy(1)} aria-label={en ? 'Next' : 'Напред'} className="flex h-11 w-11 items-center justify-center rounded-full border border-iron/15 text-iron hover:bg-white">›</button>
        </div>
      </div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {TILES.map(tile => {
          const name = tileLabel(tile.name, en)
          return (
          <article
            key={`${tile.kind}-${tile.src}`}
            className="relative aspect-[9/16] w-[42vw] max-w-[210px] shrink-0 snap-start overflow-hidden rounded-2xl bg-onyx"
          >
            {tile.kind === 'photo' ? (
              <Image src={tile.src} alt={tile.alt} fill sizes="210px" className="object-cover" />
            ) : tile.kind === 'loop' ? (
              <LoopTile tile={tile} label={name} />
            ) : (
              <TalkTile tile={tile} playLabel={en ? `Play ${name}` : `Пусни видеото на ${name}`} />
            )}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-onyx/75 to-transparent px-3 pb-3 pt-8 font-sans text-sm font-medium text-linen">
              {name}
            </span>
          </article>
          )
        })}
      </div>
    </section>
  )
}
