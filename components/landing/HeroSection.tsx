'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'
import { pairOfferCopy } from '@/lib/sale'
import { FACE_AVATARS } from '@/lib/proof-media'
import { getLandingContent } from '@/lib/data'

const HERO_VIDEO = '/media/product-film.mp4'
const HERO_POSTER = '/media/product-film-poster.jpg'

function dailyItem(pairs: number, price: number, locale: 'bg' | 'en') {
  const lenses = Array.from({ length: pairs }, () => 'daily').join('-')
  const count = locale === 'en' ? (pairs === 1 ? '1 pair' : `${pairs} pairs`) : (pairs === 1 ? '1 чифт' : `${pairs} чифта`)
  return {
    productId: 'AMPÉ-daily',
    variantId: `AMPÉ-${lenses}-bundle-${pairs}`,
    name: 'AMPÉ',
    variantLabel: locale === 'en' ? `Daily · ${count}` : `За всеки ден · ${count}`,
    price,
    quantity: 1,
    image: '/images/shop/shop-daily-1.png',
    slug: 'AMPÉ-glasses',
  }
}

export default function HeroSection({ locale }: { locale?: string }) {
  const lang = locale === 'en' ? 'en' : 'bg'
  const { heroContent: hero } = getLandingContent(lang)
  const pricing = usePricingSnapshot()
  const offer = pairOfferCopy(pricing, lang)
  const addItem = useCartStore(s => s.addItem)
  const openDrawer = useCartStore(s => s.openDrawer)
  const en = lang === 'en'

  const ctaRef = useRef<HTMLButtonElement>(null)
  const [stickyCta, setStickyCta] = useState(false)
  useEffect(() => {
    const el = ctaRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => {
      setStickyCta(!entry.isIntersecting)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const addPairs = (pairs: number) => {
    addItem(dailyItem(pairs, pairs >= 2 ? pricing.double : pricing.single, lang))
    openDrawer()
  }

  const trust = en
    ? ['Free delivery on 2+ pairs', 'Cash on delivery', '14-day returns', 'Ships within 48 hours']
    : ['Безплатна доставка за 2+ чифта', 'Наложен платеж', '14 дни връщане', 'Изпращаме до 48 часа']

  return (
    <section className="relative isolate flex min-h-[calc(100svh-97px)] items-end overflow-hidden bg-onyx text-linen">
      <Image
        src={HERO_POSTER}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[68%_center] md:object-center"
      />
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={HERO_POSTER}
        preload="metadata"
        src={HERO_VIDEO}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[68%_center] motion-reduce:hidden md:object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-onyx/80 via-onyx/45 to-onyx/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-transparent to-onyx/25" />

      <div data-testid="hero-content" className="relative z-10 mx-auto grid w-full max-w-content items-end gap-8 px-6 pb-10 pt-24 md:grid-cols-[minmax(0,1fr)_280px] md:px-10 md:pb-14">
        <div className="max-w-xl">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {FACE_AVATARS.map(face => (
                <Image
                  key={face.src}
                  src={face.src}
                  alt=""
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border-2 border-onyx object-cover"
                />
              ))}
            </div>
            <p className="font-sans text-xs leading-snug text-linen">
              <span className="text-gold" aria-hidden="true">★★★★★</span>{' '}
              {en ? '1,000+ customers' : '1000+ клиенти'}
            </p>
          </div>

          <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            {offer.eyebrow}
          </p>
          <h1 className="font-serif text-[2.35rem] font-medium leading-[0.95] text-linen sm:text-5xl">
            {hero.headlinePart1}{' '}
            <em className="italic">{hero.headlinePart2Before} {hero.headlinePart2After}</em>
          </h1>
          <p className="mt-4 max-w-md font-sans text-sm leading-relaxed text-linen/80">
            {hero.subtext}
          </p>

          <p className="mt-6 font-serif text-4xl font-medium text-linen">€{pricing.double.toFixed(2)}</p>
          <p className="mt-1 font-sans text-sm text-linen/75">{en ? '2 pairs · free delivery' : '2 чифта · безплатна доставка'}</p>
          <button
            ref={ctaRef}
            type="button"
            onClick={() => addPairs(2)}
            className="mt-5 w-full rounded-full bg-linen px-6 py-4 font-sans text-sm font-semibold text-onyx hover:bg-parchment sm:w-auto"
          >
            {en ? 'Get 2 pairs' : 'Вземи 2 чифта'}
          </button>
          <button
            type="button"
            onClick={() => addPairs(1)}
            className="mt-3 inline-flex min-h-11 items-center font-sans text-sm font-medium text-linen/80 underline underline-offset-4"
          >
            {offer.secondary}
          </button>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trust.map(item => (
              <li key={item} className="font-sans text-[12px] font-medium leading-snug text-linen/90">
                {item}
              </li>
            ))}
          </ul>
          {stickyCta && (
            <div className="fixed inset-x-0 z-40 border-t border-iron/10 bg-parchment p-3 md:hidden" style={{ bottom: 'var(--cookie-banner-offset, 0px)' }}>
              <button type="button" onClick={() => addPairs(2)} className="w-full rounded-full bg-onyx py-4 font-sans text-sm font-semibold text-linen">
                {en ? 'Get 2 pairs' : 'Вземи 2 чифта'} · €{pricing.double.toFixed(2)}
              </button>
            </div>
          )}
        </div>

        <figure className="hidden overflow-hidden rounded-2xl border border-linen/20 shadow-2xl md:block">
          <Image
            src="/media/lifestyle-sofa.jpg"
            alt={en ? 'Customer wearing the yellow AMPÉ pair' : 'Клиентка с жълтия чифт AMPÉ'}
            width={720}
            height={960}
            sizes="280px"
            className="h-[340px] w-full object-cover"
          />
        </figure>
      </div>
    </section>
  )
}
