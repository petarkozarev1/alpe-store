'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import type { Locale } from '@/lib/i18n/config'
import { translate } from '@/lib/i18n/translations'
import { variantIdFor } from '@/lib/order-lines'
import { isEveningPurchasable } from '@/lib/preview-stock'
import { priceForPairs, regularPriceForPairs } from '@/lib/sale'
import type { BundleCount, Lens } from '@/lib/shop-selection'
import { useCartStore } from '@/lib/store/cartStore'
import { clipSource, pdpUgcClips, type PdpUgcClip } from '@/lib/pdp-ugc'

const images: Record<Lens, { src: string; alt: string }[]> = {
  daily: [
    { src: '/images/shop/shop-daily-1.png', alt: 'AMPÉ Daily очила за компютър с жълти стъкла' },
    { src: '/images/shop/shop-daily-2.png', alt: 'Жълти очила за синя светлина AMPÉ Daily' },
    { src: '/images/shop/shop-daily-3.png', alt: 'Кутия AMPÉ Daily blue light glasses за работа пред екран' },
  ],
  evening: [
    { src: '/images/shop/shop-evening-1.png', alt: 'AMPÉ Evening очила за синя светлина с оранжеви стъкла' },
    { src: '/images/shop/shop-evening-2.png', alt: 'Оранжеви blue light blocking glasses AMPÉ Evening' },
    { src: '/images/shop/shop-evening-3.png', alt: 'Кутия AMPÉ Evening очила против синя светлина' },
  ],
}

function applyStart(video: HTMLVideoElement, clip: PdpUgcClip) {
  if (clip.startAt == null || clip.startAt <= 0) return
  if (video.currentTime < clip.startAt - 0.2) video.currentTime = clip.startAt
}

function Icon({ name }: { name: 'close' | 'prev' | 'next' | 'muted' | 'sound' }) {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true as const }
  if (name === 'close') return <svg {...common}><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
  if (name === 'prev') return <svg {...common}><path d="M10 3.5L5 8l5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  if (name === 'next') return <svg {...common}><path d="M6 3.5L11 8l-5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  if (name === 'muted') return <svg {...common}><path d="M3 6.2h2.2L8.2 3.5v9L5.2 9.8H3V6.2zM11 6.2l2.4 2.4M13.4 6.2L11 8.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
  return <svg {...common}><path d="M3 6.2h2.2L8.2 3.5v9L5.2 9.8H3V6.2zM10 6.1a2.6 2.6 0 010 3.8M11.6 4.6a4.6 4.6 0 010 6.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
}

export default function ShoppableVideoModal({
  locale,
  index,
  onClose,
  onIndex,
}: {
  locale: Locale
  index: number | null
  onClose: () => void
  onIndex: (index: number) => void
}) {
  const t = (value: string) => translate(locale, value)
  const reduced = useReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const swipe = useRef<number | null>(null)
  const [muted, setMuted] = useState(false)
  const [lens, setLens] = useState<Lens>('daily')
  const [bundle, setBundle] = useState<BundleCount>(1)
  const [slots, setSlots] = useState<Lens[]>(['daily'])
  const [thumb, setThumb] = useState(0)
  const eveningBlocked = !isEveningPurchasable()
  const addItem = useCartStore(state => state.addItem)
  const openDrawer = useCartStore(state => state.openDrawer)
  const pairLimit = useCartStore(state => state.pairLimit)
  const clip = index == null ? null : pdpUgcClips[index]
  const price = priceForPairs(slots.length)
  const compare = regularPriceForPairs(slots.length)
  const showCompare = compare - price > 0.009
  const blocked = eveningBlocked && slots.includes('evening')
  const gallery = images[slots[0] ?? lens]
  const motionTime = reduced ? 0 : 0.35

  useEffect(() => {
    if (index == null) return
    const node = closeRef.current
    node?.focus()
    const root = dialogRef.current
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !root) return
      const items = [...root.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
        .filter(item => !item.hasAttribute('disabled') && item.tabIndex !== -1)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [index])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !clip) return
    video.muted = muted
    const start = () => {
      applyStart(video, clip)
      video.play().catch(() => {
        if (video.muted) return
        video.muted = true
        setMuted(true)
        video.play().catch(() => {})
      })
    }
    if (video.readyState >= 1) start()
    else video.addEventListener('loadedmetadata', start, { once: true })
  }, [clip, muted])

  function chooseLens(next: Lens) {
    if (next === 'evening' && eveningBlocked) return
    setLens(next)
    setThumb(0)
    if (bundle === 1) setSlots([next])
  }

  function chooseBundle(next: BundleCount) {
    setBundle(next)
    setSlots(Array(next).fill(lens) as Lens[])
  }

  function addToCart() {
    if (!clip || blocked) return
    const lenses = slots
    const added = addItem({
      productId: `AMPÉ-${lens}`,
      variantId: variantIdFor(lenses),
      name: 'AMPÉ',
      variantLabel: locale === 'en'
        ? `${lenses.map(item => item === 'evening' ? '🟠 Evening' : '🟡 Daily').join(' · ')} · ${lenses.length} ${lenses.length === 1 ? 'pair' : 'pairs'}`
        : `${lenses.map(item => item === 'evening' ? '🟠 Вечер' : '🟡 За всеки ден').join(' · ')} · ${lenses.length} чифт${lenses.length > 1 ? 'а' : ''}`,
      price: priceForPairs(lenses.length),
      quantity: 1,
      image: images[lens][0].src,
      slug: 'AMPÉ-glasses',
    })
    if (!added) return
    fireTrackedEvent('AddToCart', {
      data: {
        content_name: 'AMPÉ',
        content_ids: [`AMPÉ-${lens}`],
        content_type: 'product',
        value: priceForPairs(lenses.length),
        currency: 'EUR',
      },
      value: priceForPairs(lenses.length),
      currency: 'EUR',
      contentIds: [`AMPÉ-${lens}`],
      numItems: lenses.length,
    })
    onClose()
    openDrawer()
  }

  function step(delta: number) {
    if (index == null) return
    onIndex((index + delta + pdpUgcClips.length) % pdpUgcClips.length)
  }

  return (
    <AnimatePresence>
      {clip && index != null && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="shoppable-video-title"
          className="fixed inset-0 z-[80] flex items-end justify-center md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: motionTime }}
        >
          <motion.button
            type="button"
            aria-label={t('Затвори')}
            className="absolute inset-0 bg-onyx/80"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: motionTime }}
          />
          <motion.div
            className="relative z-[1] flex h-[100dvh] w-full flex-col overflow-hidden bg-onyx md:h-auto md:max-h-[92vh] md:max-w-5xl md:flex-row md:rounded-[28px]"
            initial={reduced ? false : { opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: motionTime, ease: 'easeOut' }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="relative min-h-0 flex-1"
              onPointerDown={(event) => {
                if ((event.target as HTMLElement).closest('button')) return
                swipe.current = event.clientX
              }}
              onPointerUp={(event) => {
                if (swipe.current == null) return
                const delta = event.clientX - swipe.current
                swipe.current = null
                if (Math.abs(delta) > 48) step(delta < 0 ? 1 : -1)
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={clip.id}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.28 }}
                >
                  <video
                    ref={videoRef}
                    src={clipSource(clip)}
                    poster={clip.poster}
                    autoPlay
                    playsInline
                    muted={muted}
                    loop={clip.startAt == null}
                    width={540}
                    height={960}
                    className="h-full w-full bg-onyx object-cover md:object-contain"
                    onLoadedMetadata={(event) => applyStart(event.currentTarget, clip)}
                    onEnded={(event) => {
                      if (clip.startAt == null) return
                      event.currentTarget.currentTime = clip.startAt ?? 0
                      event.currentTarget.play().catch(() => {})
                    }}
                  />
                </motion.div>
              </AnimatePresence>
              <button
                ref={closeRef}
                type="button"
                aria-label={t('Затвори')}
                onClick={onClose}
                className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-onyx/75 text-linen"
              >
                <Icon name="close" />
              </button>
              <button
                type="button"
                aria-label={muted ? t('Със звук') : t('Без звук')}
                aria-pressed={!muted}
                onClick={() => setMuted(current => !current)}
                className="absolute left-3 top-16 flex h-11 w-11 items-center justify-center rounded-full bg-onyx/75 text-linen md:bottom-4 md:top-auto"
              >
                <Icon name={muted ? 'muted' : 'sound'} />
              </button>
              <button type="button" aria-label={t('Предишно видео')} onClick={() => step(-1)} className="absolute left-3 top-1/3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#B8906A] text-linen md:top-1/2">
                <Icon name="prev" />
              </button>
              <button type="button" aria-label={t('Следващо видео')} onClick={() => step(1)} className="absolute right-3 top-1/3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#B8906A] text-linen md:top-1/2">
                <Icon name="next" />
              </button>
            </div>

            <aside className="absolute inset-x-0 bottom-0 flex max-h-[62vh] flex-col rounded-t-[24px] bg-parchment text-iron shadow-[0_-12px_40px_rgba(45,14,4,0.18)] md:static md:max-h-[92vh] md:w-[360px] md:shrink-0 md:rounded-none">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 md:px-5 md:pt-6">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#B8906A]/70 md:hidden" aria-hidden="true" />
              <div className="grid grid-cols-3 gap-2">
                {gallery.map((image, imageIndex) => (
                  <button
                    key={image.src}
                    type="button"
                    onClick={() => setThumb(imageIndex)}
                    aria-label={`${t('Снимка')} ${imageIndex + 1}`}
                    aria-pressed={thumb === imageIndex}
                    className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-sand ${thumb === imageIndex ? 'ring-2 ring-[#B8906A]' : ''}`}
                  >
                    <img src={image.src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
              <h2 id="shoppable-video-title" className="mt-4 font-serif text-3xl leading-none">
                AMPÉ <em className="font-normal">{lens === 'evening' ? 'Evening' : 'Daily'}</em>
              </h2>
              <p className="mt-2 flex items-baseline gap-2 font-serif text-2xl">
                <span>€{price.toFixed(2)}</span>
                {showCompare && <span className="font-sans text-sm text-stone line-through">€{compare.toFixed(2)}</span>}
              </p>

              <p className="mt-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-stone">{t('Изберете очилата')}</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['daily', 'evening'] as Lens[]).map(option => {
                  const disabled = option === 'evening' && eveningBlocked
                  const selected = lens === option
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      onClick={() => chooseLens(option)}
                      className={`rounded-2xl border px-3 py-2 text-left font-sans text-sm ${selected ? 'border-[#B8906A] bg-sand' : 'border-iron/15 bg-cream'} ${disabled ? 'cursor-not-allowed opacity-45' : ''}`}
                    >
                      <span className="block font-serif text-lg">{option === 'evening' ? t('Вечер') : t('За всеки ден')}</span>
                      <span className="block text-xs text-stone">{option === 'evening' ? t('Оранжеви · за вечерта') : t('Жълти · за деня')}</span>
                      {disabled && <span className="mt-1 block text-[10px] uppercase tracking-wider text-stone">{t('Временно изчерпано')}</span>}
                    </button>
                  )
                })}
              </div>

              <p className="mt-4 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-stone">{t('Колко чифта?')}</p>
              <div role="radiogroup" aria-label={t('Колко чифта?')} className="mt-2 grid grid-cols-2 gap-2">
                {([1, 2] as const).map(count => (
                  <button
                    key={count}
                    type="button"
                    role="radio"
                    aria-checked={bundle === count}
                    onClick={() => chooseBundle(count)}
                    className={`rounded-2xl border px-3 py-2 text-left font-sans ${bundle === count ? 'border-[#B8906A] bg-sand' : 'border-iron/15 bg-cream'}`}
                  >
                    <span className="block text-sm">{count === 1 ? t('1 чифт') : t('2 чифта')}</span>
                    <span className="block font-serif text-xl">€{(count === 1 ? priceForPairs(1) : priceForPairs(2)).toFixed(2)}</span>
                    {count === 2 && <span className="mt-1 inline-block rounded-full bg-[#B8906A] px-2 py-0.5 text-[10px] uppercase tracking-wider text-linen">{t('Най-популярни')}</span>}
                  </button>
                ))}
              </div>

              {bundle > 1 && (
                <div className="mt-3 space-y-2">
                  {slots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      <span className="w-14 font-sans text-xs text-stone">{t('Чифт')} {slotIndex + 1}</span>
                      {(['daily', 'evening'] as Lens[]).map(option => {
                        const disabled = option === 'evening' && eveningBlocked
                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={disabled}
                            aria-pressed={slot === option}
                            onClick={() => setSlots(current => current.map((item, itemIndex) => itemIndex === slotIndex ? option : item))}
                            className={`rounded-full px-3 py-1.5 font-sans text-xs ${slot === option ? 'bg-onyx text-linen' : 'bg-cream text-iron'} ${disabled ? 'cursor-not-allowed opacity-40' : ''}`}
                          >
                            {option === 'evening' ? t('Вечер') : t('За всеки ден')}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}

              </div>
              <div className="shrink-0 border-t border-iron/10 bg-parchment px-4 py-3 md:px-5">
              <button
                type="button"
                onClick={addToCart}
                disabled={blocked}
                className="w-full rounded-lg bg-onyx px-4 py-4 font-sans text-sm font-medium tracking-wide text-linen hover:bg-iron disabled:cursor-not-allowed disabled:bg-iron/35 disabled:text-linen/60"
              >
                {blocked ? t('Изчерпано') : `${t('Добави в количката')} — €${price.toFixed(2)}`}
              </button>
              {pairLimit === 'cap' && <p role="alert" className="mt-2 text-center font-sans text-sm text-iron">{t('Може да поръчате до 10 чифта.')}</p>}
              </div>
            </aside>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
