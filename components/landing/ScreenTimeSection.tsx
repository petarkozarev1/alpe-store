'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

const POINTS = {
  bg: ['По-малко парене след дълъг ден на лаптоп', 'Вечерният чифт идва с новата наличност', 'Лека рамка, която не притиска'],
  en: ['Less burning after a long day on a laptop', 'The Evening pair arrives with the new stock', 'A light frame that does not pinch'],
}

export default function ScreenTimeSection({ locale = 'bg' }: { locale?: string }) {
  const en = locale === 'en'
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => undefined)
      else el.pause()
    }, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl">
      <Image
        src="/media/laptop-lifestyle-poster.jpg"
        alt=""
        fill
        sizes="(min-width: 768px) 1120px, 100vw"
        className="object-cover object-center"
      />
      <video
        ref={ref}
        src="/media/laptop-lifestyle.mp4"
        poster="/media/laptop-lifestyle-poster.jpg"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(118deg, rgba(45,14,4,0.70) 0%, rgba(45,14,4,0.40) 30%, rgba(45,14,4,0.08) 52%, transparent 70%)',
        }}
      />
      <div className="absolute left-0 top-0 z-10 max-w-[64%] px-3 pb-1 pt-2 sm:max-w-[56%] sm:p-6 md:max-w-[46%] md:p-8">
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-gold sm:text-[11px] sm:tracking-[0.16em]">
          {en ? 'Screen time' : 'Време пред екрана'}
        </p>
        <h2 className="mt-1 font-serif text-[15px] leading-tight text-cream sm:mt-3 sm:text-3xl md:text-4xl lg:text-5xl">
          {en ? 'Made for hours in front of a screen.' : 'Направени за часовете пред екрана.'}
        </h2>
        <ul className="mt-1 space-y-0.5 sm:mt-5 sm:space-y-2">
          {(en ? POINTS.en : POINTS.bg).map(point => (
            <li key={point} className="font-sans text-[10px] leading-snug text-linen sm:text-sm">
              <span className="text-gold" aria-hidden="true">✓ </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
