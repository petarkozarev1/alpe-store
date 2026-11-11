'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'

const slides = [
  '/images/customers/02.jpg',
  '/images/customers/05.jpg',
  '/images/how-it-works-selfie.jpg',
  '/images/customers/03.jpg',
]

type Stat = {
  title: string
  caption: string
  value: number
  decimals: number
  prefix: string
}

function statsFor(locale: Locale): Stat[] {
  const en = locale === 'en'
  return [
    {
      title: en ? 'UV blocking' : 'UV блокиране',
      caption: en ? 'UVA + UVB on both lenses' : 'UVA + UVB при двете лещи',
      value: 100,
      decimals: 0,
      prefix: '',
    },
    {
      title: en ? 'Blue light' : 'Синя светлина',
      caption: en ? 'Day lenses, the 450nm peak' : 'Дневни лещи, пикът при 450nm',
      value: 99,
      decimals: 0,
      prefix: en ? 'up to ' : 'до ',
    },
    {
      title: en ? 'Blue-green light' : 'Синьо-зелена',
      caption: en ? 'Evening lenses, 475–650nm' : 'Вечерни лещи, 475–650nm',
      value: 99.21,
      decimals: 2,
      prefix: '',
    },
    {
      title: en ? 'Light transmission' : 'Светлопропускливост',
      caption: en ? 'Day lenses, almost clear' : 'Дневни лещи, почти прозрачни',
      value: 85,
      decimals: 0,
      prefix: '',
    },
  ]
}

function CountUp({ value, decimals, prefix }: { value: number; decimals: number; prefix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(value)
      return
    }
    setShown(0)
    let frame = 0
    let started = false
    const start = () => {
      if (started) return
      started = true
      const began = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - began) / 1100)
        const eased = 1 - (1 - t) ** 3
        setShown(value * eased)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) start()
      },
      { threshold: 0.45 },
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])
  const text = `${prefix}${shown.toFixed(decimals)}%`
  return <span ref={ref}>{text}</span>
}

export default function LabProofSection({ locale }: { locale: Locale }) {
  const en = locale === 'en'
  const stats = statsFor(locale)
  return (
    <section id="lab-proof" className="relative isolate overflow-hidden py-20 text-cream md:py-24">
      <div aria-hidden="true" className="absolute inset-0">
        {slides.map((src, index) => (
          <div key={src} className="lab-proof-slide absolute inset-0" style={{ animationDelay: `${index * 7}s` }}>
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              quality={85}
              className="lab-proof-zoom object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-br from-onyx/90 via-onyx/75 to-iron/80" />
      </div>

      <style>{`
        .lab-proof-slide { opacity: 0; animation: lab-proof-fade 28s infinite; }
        .lab-proof-zoom { animation: lab-proof-zoom 28s ease-in-out infinite alternate; }
        @keyframes lab-proof-fade {
          0%, 22% { opacity: 1; }
          30%, 92% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes lab-proof-zoom {
          from { transform: scale(1.04); }
          to { transform: scale(1.14); }
        }
        @media (prefers-reduced-motion: reduce) {
          .lab-proof-slide { animation: none; opacity: 0; }
          .lab-proof-slide:first-child { opacity: 1; }
          .lab-proof-zoom { animation: none; transform: none; }
        }
      `}</style>

      <div className="relative z-[1] mx-auto max-w-content px-6 md:px-10">
        <h2 className="mx-auto max-w-3xl text-center font-serif text-[clamp(32px,4.4vw,56px)] font-medium leading-tight text-cream">
          {en ? 'Lab Tested. Certified to European Standards.' : 'Лабораторно тествани. Сертифицирани по европейски стандарт.'}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center font-sans text-sm leading-relaxed text-linen/80 md:text-base">
          {en
            ? 'Independent laboratory testing to BS EN ISO 12312-1, ANSI Z80.3 and AS/NZS 1067.1, with UV400 protection.'
            : 'Независимо лабораторно тестване по BS EN ISO 12312-1, ANSI Z80.3 и AS/NZS 1067.1, с UV400 защита.'}
        </p>
        <div className="mt-8 text-center">
          <Link
            href={localizedPath('/certifications', locale)}
            className="inline-flex items-center rounded-full bg-cream px-6 py-3 font-sans text-sm font-semibold text-onyx transition-colors hover:bg-linen"
          >
            {en ? 'See the proof' : 'Виж доказателствата'}
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="rounded-2xl border border-linen/30 bg-onyx/60 px-3 py-5 text-center backdrop-blur-md md:px-4 md:py-6"
            >
              <h3 className="font-serif text-lg italic leading-tight text-linen md:text-xl">{stat.title}</h3>
              <p className="mt-3 font-serif text-[clamp(32px,4vw,52px)] font-medium leading-none text-gold">
                <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix} />
              </p>
              <p className="mt-3 font-sans text-xs leading-snug text-linen/75">{stat.caption}</p>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-2xl text-center font-sans text-[11px] leading-relaxed text-linen/75">
          {en
            ? 'Results from independent laboratory testing (AHD TMS) of JX-Y8016 and JX-Y8008 lenses.'
            : 'Резултати от независимо лабораторно тестване (AHD TMS) на лещи JX-Y8016 и JX-Y8008.'}
        </p>
      </div>
    </section>
  )
}
