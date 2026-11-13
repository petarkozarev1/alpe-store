'use client'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { localizeContent } from '@/components/i18n/LocalizedContent'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import {
  getInitialShopSelection,
  type BundleCount,
  type Lens,
  type ShopSelection,
} from '@/lib/shop-selection'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'
import { ReviewQuotes } from '@/components/proof/ReviewQuotes'
import PdpUgcReel from '@/components/product/PdpUgcReel'
import BusinessSection from '@/components/layout/BusinessSection'
import LabProofSection from '@/components/shop/LabProofSection'
import { PaymentMarks } from '@/components/shop/PaymentMarks'
import { isEveningPurchasable } from '@/lib/preview-stock'
import PairSelector from '@/components/shop/PairSelector'

type Tab = 'description' | 'science' | 'reviews'

const lensData = {
  evening: {
    name: 'AMPÉ',
    nameItalic: 'Evening',
    tagline: 'Оранжев филтър за вечерта. Блокира 98% от синята светлина (415–455 nm) и 98% от зелената (500–560 nm).',
    benefitBg: '#fff5eb',
    benefitBorder: 'rgba(196,154,108,0.3)',
    benefitDot: 'linear-gradient(135deg,#ff6a00,#c0392b)',
    benefitText: 'Оптимално да се носят след залез слънце и преди сън.',
    benefitColor: '#7a4e1a',
    descText: "Пластмасовите стъкла AMPÉ Evening са за вечерта. Носени след залез и поне 2 часа преди лягане, филтрират 98% от синята светлина в 415–455 nm и 98% от зелената в 500–560 nm. Не са медицинско изделие и не обещаваме по-дълъг сън.",
    images: [
      { src: '/images/shop/shop-evening-1.png', alt: 'AMPÉ Evening очила за синя светлина с оранжеви пластмасови стъкла' },
      { src: '/images/shop/shop-evening-2.png', alt: 'Оранжеви blue light blocking glasses AMPÉ Evening' },
      { src: '/images/shop/shop-evening-3.png', alt: 'Кутия AMPÉ Evening очила против синя светлина' },
    ],
  },
  daily: {
    name: 'AMPÉ',
    nameItalic: 'Daily',
    tagline: 'Прозрачно-жълти пластмасови стъкла за целодневна работа пред екрана. Филтрират най-агресивните дължини на вълните, без да изкривяват цветовете, за да можете да работите комфортно от 9:00 до 18:00ч.',
    benefitBg: '#fffbe0',
    benefitBorder: 'rgba(200,180,0,0.25)',
    benefitDot: 'linear-gradient(135deg,#f9e94e,#e6b800)',
    benefitText: 'Идеални за целодневна работа пред екран.',
    benefitColor: '#7a6200',
    descText: "Очилата AMPÉ Daily са за продължителна работа пред екрана. Кехлибарено-жълтият филтър спира 65% от синята светлина и пази цветовете достатъчно точни за дизайн, снимки и видеоразговори. Рамката е за носене 8+ часа.",
    images: [
      { src: '/images/shop/shop-daily-hero.webp', alt: 'AMPÉ Daily очила за компютър с жълти пластмасови стъкла' },
      { src: '/images/shop/shop-daily-2.png', alt: 'Жълти очила за синя светлина AMPÉ Daily' },
      { src: '/images/shop/shop-daily-3.png', alt: 'Кутия AMPÉ Daily blue light glasses за работа пред екран' },
    ],
  },
}

const EVENING_OUT_OF_STOCK = !isEveningPurchasable()

export default function ProductPage({
  initialSelection = getInitialShopSelection(),
}: { initialSelection?: ShopSelection } = {}) {
  const locale = useLocale()
  const pricing = usePricingSnapshot()
  const pairPrice = (n: 1 | 2) => (n === 1 ? pricing.single : pricing.double)
  const [lens, setLens] = useState<Lens>(initialSelection.lens)
  const [bundle, setBundle] = useState(initialSelection.bundle)
  const [thumbIdx, setThumbIdx] = useState({ evening: 0, daily: 0 })
  const [slots, setSlots] = useState<Lens[]>(initialSelection.slots)
  const [tab, setTab] = useState<Tab>('description')
  const [stickyVisible, setStickyVisible] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const ctaRef = useRef<HTMLDivElement>(null)
  const addToCart = useCartStore(s => s.addItem)
  const openDrawer = useCartStore(s => s.openDrawer)
  const pairLimit = useCartStore(s => s.pairLimit)

  useEffect(() => {
    if (!ctaRef.current) return
    const obs = new IntersectionObserver(([entry]) => {
      setStickyVisible(!entry.isIntersecting)
    }, { threshold: 0 })
    obs.observe(ctaRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    fireTrackedEvent('ViewContent', {
      data: {
        content_name: 'AMPÉ Glasses',
        content_ids: ['AMPÉ-glasses'],
        content_type: 'product',
        value: pricing.single,
        currency: 'EUR',
      },
      value: pricing.single,
      currency: 'EUR',
      contentIds: ['AMPÉ-glasses'],
    })
  }, [])

  function handleLens(l: Lens) {
    setLens(l)
    setThumbIdx(prev => ({ ...prev }))
    if (bundle === 1) setSlots([l])
  }

  function handleBundle(n: BundleCount) {
    setBundle(n)
    if (n > 1) setSlots(Array(n).fill(lens) as Lens[])
    else setSlots([lens])
  }

  function handleSlot(i: number, l: Lens) {
    setSlots(prev => prev.map((s, idx) => (idx === i ? l : s)))
  }

  function handleAddToCart() {
    if (EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening'))) return
    const d = lensData[lens]
    const added = addToCart({
      productId: `AMPÉ-${lens}`,
      variantId: `AMPÉ-${slots.join('-')}-bundle-${bundle}`,
      name: d.name,
      variantLabel: locale === 'en'
        ? `${slots.map(s => s === 'evening' ? '🟠 Evening' : '🟡 Daily').join(' · ')} · ${bundle} ${bundle === 1 ? 'pair' : 'pairs'}`
        : `${slots.map(s => s === 'evening' ? '🟠 Вечер' : '🟡 За всеки ден').join(' · ')} · ${bundle} чифт${bundle > 1 ? 'а' : ''}`,
      price: pairPrice(bundle),
      quantity: 1,
      image: d.images[0].src,
      slug: 'AMPÉ-glasses',
    })
    if (!added) return
    fireTrackedEvent('AddToCart', {
      data: {
        content_name: d.name,
        content_ids: [`AMPÉ-${lens}`],
        content_type: 'product',
        value: pairPrice(bundle),
        currency: 'EUR',
      },
      value: pairPrice(bundle),
      currency: 'EUR',
      contentIds: [`AMPÉ-${lens}`],
      numItems: bundle,
    })
    openDrawer()
  }

  const d = lensData[lens]
  const currentImg = d.images[thumbIdx[lens]]
  const price = pairPrice(bundle).toFixed(2)
  const saving = bundle > 1 && pricing.double < pricing.regularDouble ? +(pricing.regularDouble - pricing.double).toFixed(2) : 0

  return localizeContent(locale, (
    <div style={{ background: '#FAF0E4', color: '#1C0F0A', fontFamily: 'var(--font-raleway), system-ui, sans-serif', fontWeight: 300 }}>

      {/* Main product grid */}
      <div className="product-grid-inner" style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 48px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>

        {/* LEFT: Gallery */}
        <div className="product-gallery-col" style={{ position: 'sticky', top: 123, alignSelf: 'start' }}>
          {/* Main image */}
          <div className="product-gallery-main" style={{ width: '100%', aspectRatio: '16/10', borderRadius: 12, overflow: 'hidden', background: '#f5ede2', position: 'relative', marginBottom: 14 }}>
            <Image src={currentImg.src} alt={currentImg.alt} fill sizes="(min-width:960px) 50vw, 100vw" className={thumbIdx[lens] === 1 ? 'object-contain' : 'object-cover'} quality={85} />

            {/* Lens toggle on image */}
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(28,15,10,0.72)', backdropFilter: 'blur(12px)', borderRadius: 100, padding: 5, zIndex: 2, whiteSpace: 'nowrap' }}>
              <button
                onClick={() => handleLens('daily')}
                style={{ border: 'none', background: lens === 'daily' ? '#FAF0E4' : 'transparent', color: lens === 'daily' ? '#1C0F0A' : 'rgba(255,248,240,0.7)', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.25s' }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'inline-block', flexShrink: 0 }} />
                За всеки ден
              </button>
              <button
                onClick={() => !(EVENING_OUT_OF_STOCK) && handleLens('evening')}
                disabled={EVENING_OUT_OF_STOCK}
                aria-disabled={EVENING_OUT_OF_STOCK}
                style={{ border: 'none', background: lens === 'evening' ? '#FAF0E4' : 'transparent', color: lens === 'evening' ? '#1C0F0A' : 'rgba(255,248,240,0.7)', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 100, cursor: EVENING_OUT_OF_STOCK ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.25s', opacity: EVENING_OUT_OF_STOCK ? 0.45 : 1 }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6a00,#c0392b)', display: 'inline-block', flexShrink: 0 }} />
                Вечер
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="product-gallery-thumbs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {d.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setThumbIdx(prev => ({ ...prev, [lens]: i }))}
                style={{ aspectRatio: '4/3', borderRadius: 8, overflow: 'hidden', border: `2px solid ${thumbIdx[lens] === i ? '#1C0F0A' : 'transparent'}`, cursor: 'pointer', padding: 0, background: 'none', position: 'relative', transition: 'border-color 0.2s, transform 0.2s', transform: 'none' }}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:960px) 200px, 33vw" className={i === 1 ? 'object-contain' : 'object-cover'} quality={85} />
              </button>
            ))}
          </div>

          <div className="product-gallery-copy" style={{ marginTop: 20 }}>
            <div className="product-title-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', columnGap: 12, rowGap: 6, marginBottom: 10 }}>
              <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 36, fontWeight: 500, lineHeight: 1.1, color: '#1C0F0A', margin: 0, flexShrink: 0 }}>
                {d.name} <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d.nameItalic}</em>
              </h1>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 100, padding: '7px 16px', background: d.benefitBg, border: `1px solid ${d.benefitBorder}`, fontSize: 13 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.benefitDot, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ color: d.benefitColor }}>{d.benefitText}</span>
              </div>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(28,15,10,0.8)', lineHeight: 1.75, marginBottom: 18 }}>{d.tagline}</p>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8, padding: '12px 16px', marginTop: 10, fontSize: 13, background: '#f0f7ff', border: '1px solid rgba(60,120,200,0.2)', color: '#1a3a6e' }}>
              <svg width="16" height="16" fill="none" stroke="#3c78c8" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" /><rect x="9" y="11" width="14" height="10" rx="2" /><circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
              <span><strong>Безплатна доставка за 2 или повече чифта.</strong> Пристига в рамките на 1–3 дни. Поръчайте днес преди 14:00 ч.</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Product details */}
        <div>
          {/* Lens selector */}
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.8)', fontWeight: 500, marginBottom: 12 }}>Изберете вашите очила</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {(['daily', 'evening'] as Lens[]).map(l => (
              <button
                key={l}
                type="button"
                disabled={EVENING_OUT_OF_STOCK && l === 'evening'}
                aria-disabled={EVENING_OUT_OF_STOCK && l === 'evening'}
                onClick={() => handleLens(l)}
                style={{ border: `2px solid ${lens === l ? '#1C0F0A' : 'rgba(28,15,10,0.1)'}`, borderRadius: 10, padding: '10px 12px', cursor: (EVENING_OUT_OF_STOCK && l === 'evening') ? 'not-allowed' : 'pointer', background: lens === l ? 'rgba(28,15,10,0.05)' : '#fff8f2', transition: 'all 0.2s', textAlign: 'left', boxShadow: lens === l ? '0 0 0 1px #1C0F0A' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 2 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 16, fontWeight: 500, color: '#1C0F0A' }}>{l === 'evening' ? 'За вечер' : 'За всеки ден'}</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.8)', lineHeight: 1.4 }}>{l === 'evening' ? 'За вечерта и преди лягане' : 'За целодневна работа пред екран'}</div>
                {l === 'evening' && EVENING_OUT_OF_STOCK && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#8a6a3a', background: 'rgba(196,154,108,0.12)', border: '1px solid rgba(196,154,108,0.35)', borderRadius: 100, padding: '2px 8px' }}>
                    <span>🌙</span> Временно изчерпано
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Bundle selector */}
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.8)', fontWeight: 500, marginBottom: 12 }}>Колко чифта?</div>
          <PairSelector value={bundle} onChange={handleBundle} />

          {/* Multi-pair lens slot picker */}
          {bundle > 1 && (
            <div style={{ background: 'rgba(28,15,10,0.03)', borderRadius: 10, padding: 18, marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.8)', fontWeight: 500, marginBottom: 12 }}>Изберете пластмасови стъкла за всеки чифт</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {slots.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 12, color: 'rgba(28,15,10,0.8)', width: 52, flexShrink: 0 }}>Чифт {i + 1}</span>
                    {(['evening', 'daily'] as Lens[]).map(l => {
                      const eveningDisabled = EVENING_OUT_OF_STOCK && l === 'evening'
                      return (
                        <button
                          key={l}
                          onClick={() => !eveningDisabled && handleSlot(i, l)}
                          disabled={eveningDisabled}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: `1.5px solid ${s === l ? '#1C0F0A' : 'rgba(28,15,10,0.14)'}`, borderRadius: 100, background: s === l ? '#1C0F0A' : eveningDisabled ? 'rgba(28,15,10,0.04)' : '#fff8f2', color: s === l ? '#FAF0E4' : eveningDisabled ? 'rgba(28,15,10,0.35)' : '#1C0F0A', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, padding: '7px 16px', cursor: eveningDisabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: eveningDisabled ? 0.55 : 1 }}
                        >
                          <span style={{ width: 9, height: 9, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'inline-block', flexShrink: 0 }} />
                          {l === 'evening' ? 'Вечер' : 'За всеки ден'}
                          {eveningDisabled && (
                            <span style={{ fontSize: 9, letterSpacing: '0.04em', marginLeft: 2, opacity: 0.7 }}>🌙</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Savings callout */}
          {saving > 0 && (
            <div style={{ background: '#f0f7f1', border: '1px solid rgba(45,106,58,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1a4024', marginBottom: 12 }}>
              🎉 Спестявате <strong>€{saving}</strong> с тази комбинация
            </div>
          )}

          {/* CTA */}
          <div ref={ctaRef} style={{ margin: '24px 0 14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) && (
                <div style={{ display: 'inline-flex', alignSelf: 'flex-start', alignItems: 'center', gap: 6, background: 'rgba(196,154,108,0.12)', border: '1px solid rgba(196,154,108,0.4)', borderRadius: 100, padding: '4px 10px', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#8a6a3a', fontWeight: 500 }}>
                  <span style={{ fontSize: 11 }}>🌙</span>
                  <span>Временно изчерпано</span>
                </div>
              )}
              <button
                onClick={handleAddToCart}
                disabled={EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening'))}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'rgba(28,15,10,0.35)' : '#1C0F0A', color: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'rgba(250,240,228,0.55)' : '#FAF0E4', border: 'none', padding: 19, fontFamily: 'var(--font-raleway)', fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', cursor: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'not-allowed' : 'pointer', borderRadius: 8, transition: 'opacity 0.2s, transform 0.2s' }}
              >
                {EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'Изчерпано' : `Добави в количката — €${price} →`}
              </button>
              {pairLimit === 'cap' && <p role="alert" style={{ textAlign: 'center', fontSize: 13, color: '#8C2F1B', marginTop: 10 }}>Може да поръчате до 10 чифта.</p>}
            </div>
            <div style={{ marginTop: 16 }}>
              <PdpUgcReel locale={locale} />
            </div>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(28,15,10,0.8)' }}>✓ Сертифицирани по CE пластмасови стъкла · ✓ Безплатна доставка за 2+ чифта · ✓ Сигурно плащане</p>
          <p style={{ textAlign: 'center', fontSize: 11, color: '#4A3024', marginTop: 6 }}>Цените са крайни. · Не е медицинско изделие</p>

          <PaymentMarks />

          {/* Trust row */}
          <div className="product-trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, padding: '20px 0', borderTop: '1px solid rgba(28,15,10,0.09)', borderBottom: '1px solid rgba(28,15,10,0.09)', margin: '20px 0' }}>
            {[
              { icon: '🔒', label: 'Сигурно\nплащане' },
              { icon: '🚚', label: 'Безплатна доставка\nза 2+ чифта' },
              { icon: 'CE', label: 'Сертифицирани\nпо CE пластмасови стъкла' },
              { icon: 'return', label: '14-дневно\nвръщане' },
            ].map(t => (
              <div key={t.label} style={{ textAlign: 'center' }}>
                <div style={{ height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                  {t.icon === 'return' ? (
                    <svg width="20" height="20" fill="none" stroke="rgba(28,15,10,0.55)" strokeWidth="1.6" viewBox="0 0 24 24">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                      <path d="M3 3v5h5"/>
                    </svg>
                  ) : t.icon === 'CE' ? (
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#1C0F0A', lineHeight: 1 }}>CE</span>
                  ) : (
                    <span style={{ fontSize: 18, lineHeight: 1 }}>{t.icon}</span>
                  )}
                </div>
                <div style={{ fontSize: 10, color: 'rgba(28,15,10,0.8)', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{t.label}</div>
              </div>
            ))}
          </div>

          {/* Detail tabs */}
          <div style={{ marginTop: 40 }}>
            <div className="product-tab-row" style={{ display: 'flex', gap: 0 }}>
              {(['description', 'science', 'reviews'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{ padding: '16px 24px', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: tab === t ? '#1C0F0A' : 'rgba(28,15,10,0.5)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderBottom: `2px solid ${tab === t ? '#1C0F0A' : 'transparent'}`, cursor: 'pointer', background: 'none', fontWeight: tab === t ? 500 : 400, fontFamily: 'var(--font-raleway)', transition: 'all 0.2s' }}
                >
                  {t === 'description' ? 'Описание' : t === 'science' ? 'Науката' : 'Отзиви'}
                </button>
              ))}
            </div>

            {tab === 'description' && (
              <div style={{ padding: '28px 0' }}>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.8)' }}>{d.descText}</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginTop: 20 }}>
                  {(lens === 'evening' ? [
                    '98% блокиране на синята светлина (415–455 nm) и 98% на зелената (500–560 nm).',
                    '22 г кристален ацетат — осезаемо по-лека от обикновена пластмасова рамка.',
                    'Устойчиви на драскотини, с антирефлексно покритие.',
                    'UV400. В лабораторията и двете пластмасови стъкла са 100% UV.',
                  ] : [
                    '65% филтър на синята светлина и частичен филтър за зелената.',
                    '22 г кристален ацетат — осезаемо по-лека от обикновена пластмасова рамка.',
                    'Устойчиви на драскотини, с антирефлексно покритие.',
                    'UV400. В лабораторията и двете пластмасови стъкла са 100% UV.',
                  ]).map((text) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 20, height: 20, background: '#F2E4D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <svg width="10" height="10" fill="none" stroke="#C49A6C" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.7, color: '#3d2416' }}>{text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'science' && (
              <div style={{ padding: '28px 0' }}>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.8)' }}>Изследванията за светлината, не за нашите пластмасови стъкла, сочат силен диапазон 446–477 nm за мелатонина нощем и връх на меланопсина около 479 nm. Пълните източници са на страницата Доказано.</p>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.8)', marginTop: 16 }}>На продукта Evening пишем 98% в 415–455 nm и 98% зелена светлина в 500–560 nm. На Daily пишем 65% филтър на синята светлина. Лабораторията AHD TMS мери отделни редове: до 99% при 450 nm и 99,21% в 475–650 nm.</p>
                <div style={{ marginTop: 24, background: '#f5ede4', border: '1.5px solid rgba(196,154,108,0.3)', borderRadius: 12, padding: '20px 22px' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(28,15,10,0.75)' }}><strong style={{ color: '#1C0F0A' }}>Зеленото също влиза в сметката.</strong> В началото на един лабораторен тест 555 nm действа колкото 460 nm. Затова вечерните имат отделен ред за 500–560 nm. Не обещаваме по-дълъг сън.</p>
                  <p style={{ fontSize: 11, color: 'rgba(196,154,108,0.9)', marginTop: 12 }}>Gooley et al., 2010 · PubMed 20463367</p>
                </div>
              </div>
            )}

            {tab === 'reviews' && (
              <div style={{ padding: '28px 0' }}>
                <ReviewQuotes locale={locale} limit={8} />
              </div>
            )}
          </div>
        </div>
      </div>

      <LabProofSection locale={locale} />
      <BusinessSection locale={locale} />

      {/* Outcome stats */}
      <section className="product-stats-section" style={{ background: '#fff8f2', borderTop: '1px solid rgba(28,15,10,0.08)', borderBottom: '1px solid rgba(28,15,10,0.08)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>Какво казват клиентите</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Резултати, които говорят <em style={{ fontStyle: 'italic', fontWeight: 400 }}>сами за себе си.</em></h2>
            <p style={{ fontSize: 14, color: 'rgba(28,15,10,0.8)', marginTop: 14 }}>Данните са от анкета сред 1 200 потребители на AMPÉ след 14 дни редовно ползване.</p>
          </div>
          <div className="product-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 28 }}>
            {[
              { label: 'По-малко напрежение в очите', pct: 87, desc: 'забелязаха намалено напрежение в очите в рамките на първите 3 дни от носенето на AMPÉ', delay: '0.2s' },
              { label: 'По-бързо заспиване', pct: 79, desc: 'заспаха по-бързо в рамките на първата седмица от използването на пластмасовите стъкла Evening', delay: '0.35s' },
              { label: 'По-малко главоболия', pct: 74, desc: 'съобщиха за по-малко главоболия в края на деня, причинени от екрана, след преминаването към AMPÉ Daily', delay: '0.5s' },
              { label: 'Биха препоръчали', pct: 93, desc: 'биха препоръчали AMPÉ на приятел или член на семейството', delay: '0.65s' },
            ].map(s => (
              <div key={s.label} style={{ background: '#FAF0E4', border: '1px solid rgba(28,15,10,0.07)', borderRadius: 12, padding: '32px 36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 20, fontWeight: 500, color: '#1C0F0A' }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 36, fontWeight: 400, color: '#C49A6C' }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(28,15,10,0.07)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: '#C49A6C', borderRadius: 100 }} />
                </div>
                <p style={{ fontSize: 13, color: 'rgba(28,15,10,0.8)', marginTop: 12, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First 7 nights */}
      <section className="product-nights-section" style={{ padding: '80px 48px', background: '#FAF0E4' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>Опитът с AMPÉ</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Първите ви <em style={{ fontStyle: 'italic', fontWeight: 400 }}>7 нощи.</em></h2>
          </div>
          <div className="product-nights-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {[
              { n: '1', title: 'Днес', body: 'Използвайте дневните очила по време на работа и вечерните поне 2 часа преди лягане. Очите ви ще усетят разликата веднага.', dark: false },
              { n: '3', title: 'Ден 3', body: 'Напрежението в очите започва да отшумява. Главоболието, което ви се появяваше около 16:00 ч.? Днес може и да не го забележите.', dark: false },
              { n: '5', title: 'Ден 5', body: 'Ритъмът на мелатонина ви започва да се възстановява. Заспивате по-бързо — и се събуждате преди алармата, без да се страхувате от нея.', dark: false },
              { n: '7', title: 'Нощ 7', body: 'Това е нощта, в която повечето клиенти ни изпращат съобщение. Сън, който отново се усеща като сън.', dark: true },
            ].map(item => (
              <div key={item.n} style={{ background: item.dark ? '#1C0F0A' : '#fff8f2', border: '1px solid rgba(28,15,10,0.07)', padding: '36px 28px', position: 'relative' }}>
                <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 52, fontWeight: 300, fontStyle: 'italic', color: item.dark ? 'rgba(250,240,228,0.15)' : 'rgba(196,154,108,0.25)', lineHeight: 1, marginBottom: 20 }}>{item.n}</div>
                <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 18, fontWeight: 500, color: item.dark ? '#FAF0E4' : '#1C0F0A', marginBottom: 10 }}>{item.title}</div>
                <p style={{ fontSize: 13, color: item.dark ? 'rgba(250,240,228,0.65)' : 'rgba(28,15,10,0.5)', lineHeight: 1.75 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="product-comparison-section" style={{ background: '#fff8f2', borderTop: '1px solid rgba(28,15,10,0.08)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>Защо AMPÉ</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Не всички очила със защита от синя светлина <em style={{ fontStyle: 'italic', fontWeight: 400 }}>са еднакви.</em></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontFamily: 'var(--font-raleway)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.8)', fontWeight: 500, borderBottom: '2px solid rgba(28,15,10,0.1)' }}></th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#FAF0E4', background: '#1C0F0A', textAlign: 'center', borderBottom: '2px solid #1C0F0A' }}>AMPÉ</th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 500, color: 'rgba(28,15,10,0.8)', textAlign: 'center', borderBottom: '2px solid rgba(28,15,10,0.1)' }}>Обикновени</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Филтриране на синята светлина', AMPÉ: '65–98% (в зависимост от пластмасовите стъкла)', generic: '10–30% (непотвърдено)', AMPÉColor: undefined as string | undefined, genericMuted: false },
                  { feature: 'Пластмасови стъкла със сертификат CE', AMPÉ: '✓', generic: 'Рядко', AMPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                  { feature: 'Изкривяване на цветовете', AMPÉ: 'Минимално (прецизно покритие)', generic: 'Силно изкривяване на оттенъка', AMPÉColor: undefined as string | undefined, genericMuted: false },
                  { feature: 'Тегло на рамката', AMPÉ: '22 г кристален ацетат — осезаемо по-лека от обикновена пластмасова рамка', generic: '—', AMPÉColor: undefined as string | undefined, genericMuted: false },
                  { feature: 'Покритие против надраскване', AMPÉ: '✓', generic: 'Не', AMPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                  { feature: 'Две специално създадени пластмасови стъкла', AMPÉ: '✓', generic: 'Един универсален оттенък', AMPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                  { feature: 'Филтър за зелена светлина (500–560 nm)', AMPÉ: '✓', generic: '✗ Не е включено', AMPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                ].map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid rgba(28,15,10,0.07)', background: i % 2 === 1 ? '#fff8f2' : 'transparent' }}>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#1C0F0A' }}>{row.feature}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', background: 'rgba(28,15,10,0.03)' }}>
                      <span style={{ fontSize: row.AMPÉColor ? 16 : 13, fontWeight: row.AMPÉColor ? undefined : 500, color: row.AMPÉColor || '#1C0F0A' }}>{row.AMPÉ}</span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{ fontSize: 13, color: 'rgba(28,15,10,0.8)' }}>{row.generic}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="product-search-section" style={{ background: '#fff8f2', borderTop: '1px solid rgba(28,15,10,0.08)', padding: '76px 48px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 600, marginBottom: 14 }}>
              Очилa за синя светлина
            </div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 38, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1, marginBottom: 18 }}>
              AMPÉ е за хора, които прекарват деня си пред екран.
            </h2>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(28,15,10,0.72)' }}>
              Ако търсите очила за синя светлина, очила за компютър или blue light blocking glasses в България, AMPÉ комбинира дневни и вечерни пластмасови стъкла: Daily за работа пред екран, Evening за след залез.
            </p>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {[
              {
                title: 'За работа пред компютър',
                body: 'AMPÉ Daily използва прозрачно-жълт филтър за ежедневна работа пред лаптоп, монитор и телефон, без силно изкривяване на цветовете.',
              },
              {
                title: 'За вечерта след залез',
                body: 'AMPÉ Evening е за след залез и поне 2 часа преди сън. Филтрира 98% от синята светлина (415–455 nm) и 98% от зелената (500–560 nm).',
              },
              {
                title: 'За търсещите качествени blue light glasses',
                body: 'Очилата са леки, удобни за дълго носене и позиционирани като премиум алтернатива на обикновените очила против синя светлина.',
              },
            ].map((item) => (
              <div key={item.title} style={{ borderBottom: '1px solid rgba(28,15,10,0.1)', paddingBottom: 16 }}>
                <h3 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 21, fontWeight: 500, color: '#1C0F0A', marginBottom: 6 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(28,15,10,0.68)' }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky add to cart — desktop: full-height right sidebar; mobile: bottom bar */}
      <>
        {/* Desktop sidebar */}
        <div className="product-sticky-bar-desktop" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 300, zIndex: 39, background: '#7C3018', color: '#FAF0E4', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', padding: '40px 28px', gap: 24, boxShadow: '-8px 0 40px rgba(28,15,10,0.28)', transform: stickyVisible && sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(.22,1,.36,1)' }}>
          {/* Close button */}
          <button onClick={() => setSidebarOpen(false)} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#FAF0E4', fontSize: 18, lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }} aria-label="Затвори">×</button>
          {/* Product image */}
          <div style={{ width: 140, height: 140, borderRadius: 16, overflow: 'hidden', position: 'relative', flexShrink: 0, boxShadow: '0 4px 24px rgba(28,15,10,0.3)' }}>
            <Image src={d.images[0].src} alt={`AMPÉ ${d.nameItalic}`} fill sizes="140px" className="object-cover" />
          </div>

          {/* Name */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 22, fontWeight: 500, lineHeight: 1.2 }}>{d.name} <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d.nameItalic}</em></div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 5 }}>{locale === 'en' ? `${bundle} ${bundle === 1 ? 'pair' : 'pairs'}` : `${bundle} чифт${bundle > 1 ? 'а' : ''}`}</div>
          </div>

          {/* Lens selector / slot picker */}
          {bundle === 1 ? (
            <div style={{ width: '100%', display: 'flex', gap: 8 }}>
              {(['evening', 'daily'] as const).map(l => (
                <button
                  key={l}
                  onClick={() => handleLens(l)}
                  style={{
                    flex: 1, padding: '10px 8px', borderRadius: 10,
                    border: lens === l ? '2px solid rgba(255,255,255,0.7)' : '2px solid rgba(255,255,255,0.2)',
                    background: lens === l ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    color: '#FAF0E4', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 5,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'block' }} />
                  <span style={{ fontFamily: 'var(--font-raleway)', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>{l === 'evening' ? 'Вечер' : 'За деня'}</span>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {slots.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-raleway)', fontSize: 10, opacity: 0.5, width: 44, flexShrink: 0, letterSpacing: '0.04em' }}>Чифт {i + 1}</span>
                  <div style={{ display: 'flex', gap: 6, flex: 1 }}>
                    {(['evening', 'daily'] as Lens[]).map(l => (
                      <button
                        key={l}
                        onClick={() => handleSlot(i, l)}
                        style={{
                          flex: 1, padding: '7px 4px', borderRadius: 8,
                          border: s === l ? '2px solid rgba(255,255,255,0.7)' : '2px solid rgba(255,255,255,0.2)',
                          background: s === l ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                          color: '#FAF0E4', cursor: 'pointer',
                          display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4,
                          transition: 'all 0.15s',
                        }}
                      >
                        <span style={{ width: 10, height: 10, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'block' }} />
                        <span style={{ fontFamily: 'var(--font-raleway)', fontSize: 9, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{l === 'evening' ? 'Вечер' : 'За деня'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price + CTA */}
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 20, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 32, fontWeight: 500 }}>€{price}</div>
            {saving > 0 && (
              <div style={{ fontSize: 11, color: '#8BC98A' }}>Спестяваш €{saving}</div>
            )}
            <button onClick={handleAddToCart} disabled={EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening'))} style={{ background: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'rgba(250,240,228,0.5)' : '#FAF0E4', color: '#1C0F0A', border: 'none', padding: '14px 0', fontFamily: 'var(--font-raleway)', fontSize: 13, fontWeight: 700, borderRadius: 10, cursor: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'not-allowed' : 'pointer', width: '100%', letterSpacing: '0.04em', marginTop: 4, opacity: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 0.6 : 1 }}>
              {EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'Изчерпано' : 'Добави в количката →'}
            </button>
          </div>

          {/* Trust lines */}
          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 8 }}>
            {['✓ Безплатна доставка за 2+ чифта', '✓ EU сертифицирани пластмасови стъкла', '✓ 14-дневно връщане'].map(t => (
              <span key={t} style={{ fontFamily: 'var(--font-raleway)', fontSize: 11, opacity: 0.5, textAlign: 'center' as const }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Desktop toggle tab */}
        <button
          className="product-sticky-tab-desktop"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label={sidebarOpen ? 'Скрий панела' : 'Добави в количката'}
          style={{
            position: 'fixed',
            right: stickyVisible && sidebarOpen ? 300 : 0,
            top: '50%',
            transform: `translateY(-50%) translateX(${stickyVisible ? '0%' : '100%'})`,
            zIndex: 40,
            background: '#7C3018',
            color: '#FAF0E4',
            border: 'none',
            borderRadius: '10px 0 0 10px',
            padding: '14px 10px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            gap: 6,
            boxShadow: '-4px 0 16px rgba(28,15,10,0.22)',
            transition: 'right 0.4s cubic-bezier(.22,1,.36,1), transform 0.4s cubic-bezier(.22,1,.36,1)',
            writingMode: 'vertical-rl' as const,
          }}
        >
          <span style={{ fontSize: 16 }}>{sidebarOpen ? '›' : '‹'}</span>
          {!sidebarOpen && (
            <span style={{ fontFamily: 'var(--font-raleway)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', writingMode: 'vertical-rl', textTransform: 'uppercase' as const, opacity: 0.85 }}>€{price}</span>
          )}
        </button>

        {/* Mobile bottom bar */}
        <div className="product-sticky-bar-mobile" style={{ position: 'fixed', bottom: 'var(--cookie-banner-offset, 0px)', left: 0, right: 0, zIndex: 39, background: '#1C0F0A', color: '#FAF0E4', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, boxShadow: '0 -4px 24px rgba(28,15,10,0.18)', transform: stickyVisible ? 'translateY(0)' : 'translateY(110%)', transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 15, fontWeight: 500 }}>{d.name} <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d.nameItalic}</em></div>
            <div style={{ fontSize: 11, opacity: 0.55, marginTop: 1 }}>{locale === 'en' ? `${bundle} ${bundle === 1 ? 'pair' : 'pairs'}` : `${bundle} чифт${bundle > 1 ? 'а' : ''}`}</div>
          </div>
          <button onClick={handleAddToCart} disabled={EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening'))} style={{ background: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'rgba(250,240,228,0.5)' : '#FAF0E4', color: '#1C0F0A', border: 'none', padding: '11px 20px', fontFamily: 'var(--font-raleway)', fontSize: 13, fontWeight: 600, borderRadius: 6, cursor: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' as const, opacity: EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 0.6 : 1 }}>
            {EVENING_OUT_OF_STOCK && (lens === 'evening' || slots.includes('evening')) ? 'Изчерпано' : 'Добави в количката →'}
          </button>
        </div>
      </>

      <style>{`
        .product-sticky-bar-mobile { display: none !important; }

        @media (min-width: 961px) and (max-height: 844px) and (min-height: 821px) {
          .product-gallery-col { position: static !important; }
        }

        @media (min-width: 961px) and (max-height: 820px) {
          .product-gallery-col { top: 103px !important; }
          .product-grid-inner { padding-top: 8px !important; }
          .product-gallery-main { height: 248px !important; aspect-ratio: auto !important; margin-bottom: 8px !important; }
          .product-gallery-thumbs { gap: 8px !important; }
          .product-gallery-thumbs > button { height: 88px !important; aspect-ratio: auto !important; }
          .product-gallery-copy { margin-top: 14px !important; }
          .product-title-row { margin-bottom: 6px !important; }
          .product-gallery-copy > p { margin-bottom: 10px !important; }
        }

        @media (min-width: 961px) and (max-height: 728px) {
          .product-gallery-col { position: static !important; }
        }

        @media (max-width:960px) {
          .product-grid-inner { grid-template-columns: 1fr !important; gap: 40px !important; padding: 16px 24px 80px !important; }
          .product-gallery-col { position: static !important; }
          .product-stats-section { padding: 60px 24px !important; }
          .product-nights-section { padding: 60px 24px !important; }
          .product-comparison-section { padding: 60px 24px !important; }
          .product-search-section { padding: 56px 24px !important; }
          .product-search-section > div { grid-template-columns: 1fr !important; gap: 30px !important; }
          .product-sticky-bar-desktop { display: none !important; }
          .product-sticky-tab-desktop { display: none !important; }
          .product-sticky-bar-mobile { display: flex !important; }
        }

        @media (max-width:640px) {
          .product-gallery-col { position: static !important; }
          .product-grid-inner { padding: 20px 16px 80px !important; gap: 28px !important; }
          .product-trust-grid { grid-template-columns: repeat(2,1fr) !important; gap: 10px !important; padding: 16px 0 !important; }
          .product-tab-row button { padding: 12px 14px !important; font-size: 11px !important; }
          .product-reviews-grid { grid-template-columns: 1fr !important; }
          .product-stats-section { padding: 48px 16px !important; }
          .product-stats-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
          .product-nights-section { padding: 48px 16px !important; }
          .product-nights-grid { grid-template-columns: repeat(2,1fr) !important; }
          .product-comparison-section { padding: 48px 16px !important; }
          .product-search-section { padding: 48px 16px !important; }
        }
      `}</style>
    </div>
  ))
}
