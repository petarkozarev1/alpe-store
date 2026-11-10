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
    <section className="relative isolate min-h-[32rem] overflow-hidden bg-onyx text-linen md:min-h-[40rem]">
      <Image
        src="/media/laptop-lifestyle-poster.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-[78%_30%] md:object-[70%_18%]"
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
        className="absolute inset-0 h-full w-full object-cover object-[78%_30%] motion-reduce:hidden md:object-[70%_18%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/85 via-onyx/55 to-onyx/15" />
      <div className="relative z-10 mx-auto max-w-content px-6 py-16 md:px-10 md:py-24">
        <p className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
          {en ? 'Screen time' : 'Време пред екрана'}
        </p>
        <h2 className="mt-3 max-w-md font-serif text-4xl leading-tight text-linen md:text-5xl">
          {en ? 'Made for hours in front of a screen.' : 'Направени за часовете пред екрана.'}
        </h2>
        <ul className="mt-6 max-w-sm space-y-2">
          {(en ? POINTS.en : POINTS.bg).map(point => (
            <li key={point} className="font-sans text-sm text-linen/90">
              <span className="text-gold" aria-hidden="true">✓ </span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
