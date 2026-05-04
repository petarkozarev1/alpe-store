'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'

type Lens = 'evening' | 'daily'
type Tab = 'description' | 'science' | 'reviews'

const lensData = {
  evening: {
    name: 'ALPÉ',
    nameItalic: 'Evening',
    tagline: 'Оранжевият филтър, който сигнализира на мозъка ви, че е време да се отпуснете. Блокира 98% от синята и зелената светлина за дълбок, възстановяващ сън. Ефектът започва да се усеща още след първата седмица.',
    benefitBg: '#fff5eb',
    benefitBorder: 'rgba(196,154,108,0.3)',
    benefitDot: 'linear-gradient(135deg,#ff6a00,#c0392b)',
    benefitText: 'Оптимално да се носят след залез слънце и преди сън.',
    benefitColor: '#7a4e1a',
    descText: "Лещите ALPÉ Evening са създадени с една цел: сън. Носени 2 часа преди лягане, техният наситено оранжев цвят блокира 98% от синята светлина в диапазона 415–455 nm — дължините на вълните, които най-много потискат мелатонина. След една седмица редовна употреба повечето клиенти споделят, че заспиват по-бързо и се събуждат наистина отпочинали.",
    images: [
      { src: '/images/shop/shop-evening-1.png', alt: 'ALPÉ Evening — lifestyle' },
      { src: '/images/shop/shop-evening-2.png', alt: 'ALPÉ Evening — glasses' },
      { src: '/images/shop/shop-evening-3.png', alt: 'ALPÉ Evening — box' },
    ],
  },
  daily: {
    name: 'ALPÉ',
    nameItalic: 'Daily',
    tagline: 'Прозрачно-жълти стъкла за целодневна работа пред екрана. Филтрират най-агресивните дължини на вълните, без да изкривяват цветовете, за да можете да работите комфортно от 9:00 до 18:00ч.',
    benefitBg: '#fffbe0',
    benefitBorder: 'rgba(200,180,0,0.25)',
    benefitDot: 'linear-gradient(135deg,#f9e94e,#e6b800)',
    benefitText: 'Идеални за целодневна работа пред екран.',
    benefitColor: '#7a6200',
    descText: "Очилата ALPÉ Daily са създадени за продължителна работа пред екрана. Тяхната кехлибарено-жълта оцветка филтрира 65% от синята светлина. Достатъчно, за да намали напрежението в очите и главоболието в края на деня, като същевременно запазва цветовете достатъчно точни за работа с дизайн, редактиране на снимки и видеоразговори. Леки, удобни и подходящи за носене в продължение на 8+ часа.",
    images: [
      { src: '/images/shop/shop-daily-1.png', alt: 'ALPÉ Daily — lifestyle' },
      { src: '/images/shop/shop-daily-2.png', alt: 'ALPÉ Daily — glasses' },
      { src: '/images/shop/shop-daily-3.png', alt: 'ALPÉ Daily — box' },
    ],
  },
}

const bundlePrices: Record<number, number> = { 1: 44.99, 2: 66.99, 3: 89.99 }
const bundleSavings: Record<number, number> = { 1: 0, 2: 23, 3: 45 }

export default function ProductPage() {
  const [lens, setLens] = useState<Lens>('evening')
  const [bundle, setBundle] = useState(1)
  const [thumbIdx, setThumbIdx] = useState({ evening: 0, daily: 0 })
  const [slots, setSlots] = useState<Lens[]>(['evening'])
  const [tab, setTab] = useState<Tab>('description')
  const [stickyVisible, setStickyVisible] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  useEffect(() => { setViewerCount(Math.floor(Math.random() * 20) + 18) }, [])
  const ctaRef = useRef<HTMLDivElement>(null)
  const addToCart = useCartStore(s => s.addItem)
  const openDrawer = useCartStore(s => s.openDrawer)

  useEffect(() => {
    if (!ctaRef.current) return
    const obs = new IntersectionObserver(([entry]) => {
      setStickyVisible(!entry.isIntersecting)
    }, { threshold: 0 })
    obs.observe(ctaRef.current)
    return () => obs.disconnect()
  }, [])

  function handleLens(l: Lens) {
    setLens(l)
    setThumbIdx(prev => ({ ...prev }))
    if (bundle === 1) setSlots([l])
  }

  function handleBundle(n: number) {
    setBundle(n)
    if (n > 1) setSlots(Array(n).fill(lens) as Lens[])
    else setSlots([lens])
  }

  function handleSlot(i: number, l: Lens) {
    setSlots(prev => prev.map((s, idx) => (idx === i ? l : s)))
  }

  function handleAddToCart() {
    const d = lensData[lens]
    addToCart({
      productId: `ALPÉ-${lens}`,
      variantId: `ALPÉ-${lens}-bundle-${bundle}`,
      name: d.name,
      variantLabel: `${slots.map(s => s === 'evening' ? '🟠 Вечер' : '🟡 За всеки ден').join(' · ')} · ${bundle} чифт${bundle > 1 ? 'а' : ''}`,
      price: bundlePrices[bundle],
      quantity: 1,
      image: d.images[0].src,
      slug: 'ALPÉ-glasses',
      originalPrice: bundle > 1 ? bundlePrices[1] * bundle : undefined,
      saving: bundle > 1 ? bundleSavings[bundle] : undefined,
    })
    openDrawer()
  }

  const d = lensData[lens]
  const currentImg = d.images[thumbIdx[lens]]
  const price = bundlePrices[bundle]
  const saving = bundleSavings[bundle]

  return (
    <div style={{ background: '#FAF0E4', color: '#1C0F0A', fontFamily: 'var(--font-raleway), system-ui, sans-serif', fontWeight: 300 }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 48px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(28,15,10,0.5)', letterSpacing: '0.06em' }}>
        <Link href="/" style={{ color: 'rgba(28,15,10,0.5)', textDecoration: 'none' }}>Начало</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: '#1C0F0A' }}>{d.name}</span>
      </div>

      {/* Main product grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 48px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>

        {/* LEFT: Gallery */}
        <div style={{ position: 'sticky', top: 80 }}>
          {/* Main image */}
          <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: '#f5ede2', position: 'relative', marginBottom: 14 }}>
            <Image src={currentImg.src} alt={currentImg.alt} fill sizes="(min-width:960px) 50vw, 100vw" className={thumbIdx[lens] === 1 ? 'object-contain' : 'object-cover'} quality={100} />

            {/* Lens toggle on image */}
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(28,15,10,0.72)', backdropFilter: 'blur(12px)', borderRadius: 100, padding: 5, zIndex: 2, whiteSpace: 'nowrap' }}>
              <button
                onClick={() => handleLens('evening')}
                style={{ border: 'none', background: lens === 'evening' ? '#FAF0E4' : 'transparent', color: lens === 'evening' ? '#1C0F0A' : 'rgba(255,248,240,0.7)', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.25s' }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6a00,#c0392b)', display: 'inline-block', flexShrink: 0 }} />
                Вечер
              </button>
              <button
                onClick={() => handleLens('daily')}
                style={{ border: 'none', background: lens === 'daily' ? '#FAF0E4' : 'transparent', color: lens === 'daily' ? '#1C0F0A' : 'rgba(255,248,240,0.7)', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.25s' }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'inline-block', flexShrink: 0 }} />
                За всеки ден
              </button>
            </div>
          </div>

          {/* Thumbnails */}
          <div style={{ display: 'flex', gap: 10 }}>
            {d.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setThumbIdx(prev => ({ ...prev, [lens]: i }))}
                style={{ flex: 1, aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: `2px solid ${thumbIdx[lens] === i ? '#1C0F0A' : 'transparent'}`, cursor: 'pointer', padding: 0, background: 'none', position: 'relative', transition: 'border-color 0.2s, transform 0.2s', transform: 'none' }}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(min-width:960px) 200px, 33vw" className={i === 1 ? 'object-contain' : 'object-cover'} quality={100} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product details */}
        <div>
          {/* Stars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' as const }}>
            <span style={{ color: '#C49A6C', fontSize: 15, letterSpacing: 2 }}>★★★★★</span>
            <span style={{ fontSize: 13, color: 'rgba(28,15,10,0.5)', borderBottom: '1px solid rgba(28,15,10,0.2)', paddingBottom: 1, cursor: 'pointer' }}>4.9 · 2,341 reviews</span>
            <span style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)' }}>10,000+ customers across Europe</span>
          </div>

          {/* Name */}
          <h1 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, lineHeight: 1.1, color: '#1C0F0A', marginBottom: 10 }}>
            {d.name} <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d.nameItalic}</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(28,15,10,0.5)', lineHeight: 1.75, marginBottom: 20 }}>{d.tagline}</p>

          {/* Benefit pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 100, padding: '7px 16px', marginBottom: 28, background: d.benefitBg, border: `1px solid ${d.benefitBorder}`, fontSize: 13 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.benefitDot, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: d.benefitColor }}>{d.benefitText}</span>
          </div>

          <div style={{ height: 1, background: 'rgba(28,15,10,0.09)', margin: '24px 0' }} />

          {/* Lens selector */}
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, marginBottom: 12 }}>Изберете вашата леща</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {(['evening', 'daily'] as Lens[]).map(l => (
              <button
                key={l}
                onClick={() => handleLens(l)}
                style={{ border: `2px solid ${lens === l ? '#1C0F0A' : 'rgba(28,15,10,0.1)'}`, borderRadius: 10, padding: 16, cursor: 'pointer', background: lens === l ? 'rgba(28,15,10,0.05)' : '#fff8f2', transition: 'all 0.2s', textAlign: 'left', boxShadow: lens === l ? '0 0 0 1px #1C0F0A' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 16, fontWeight: 500, color: '#1C0F0A' }}>{l === 'evening' ? 'Вечер' : 'За всеки ден'}</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', lineHeight: 1.4 }}>{l === 'evening' ? 'Оранжеви · За вечерта и преди лягане' : 'Жълти · За целодневна работа пред екран'}</div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '2px 8px', borderRadius: 100, marginTop: 8, display: 'inline-block', background: l === 'evening' ? '#fff0e6' : '#fffbe0', color: l === 'evening' ? '#a04000' : '#806000' }}>{l === 'evening' ? '98% блокиране на синята и зелената светлина' : '65% филтър на синята светлина и частичен зелен филтър'}</div>
              </button>
            ))}
          </div>

          {/* Bundle selector */}
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, marginBottom: 12 }}>Колко чифта?</div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, marginBottom: 24 }}>
            {[1, 2, 3].map(n => (
              <button
                key={n}
                onClick={() => handleBundle(n)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `1.5px solid ${bundle === n ? '#1C0F0A' : 'rgba(28,15,10,0.1)'}`, borderRadius: 12, padding: '16px 18px', cursor: 'pointer', background: bundle === n ? 'rgba(28,15,10,0.04)' : '#fff8f2', transition: 'all 0.2s', boxShadow: bundle === n ? '0 0 0 1px #1C0F0A' : 'none', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <input type="radio" readOnly checked={bundle === n} style={{ width: 18, height: 18, accentColor: '#1C0F0A', flexShrink: 0 }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const, marginBottom: 3 }}>
                      <span style={{ fontSize: 15, fontWeight: 500, color: '#1C0F0A' }}>{n} чифт{n > 1 ? 'а' : ''}</span>
                      {n === 2 && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' as const, padding: '3px 9px', borderRadius: 4, background: '#C49A6C', color: '#fff8f0' }}>Най-популярни</span>}
                      {n === 3 && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' as const, padding: '3px 9px', borderRadius: 4, background: '#1C0F0A', color: '#FAF0E4' }}>Най-изгодно</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', marginTop: 2 }}>{n === 1 ? 'Избраните от вас очила' : n === 2 ? 'Защита за целия ден' : 'По един за всеки вкъщи'}</div>
                    {n === 2 && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 10px', borderRadius: 100, marginTop: 5, display: 'inline-block', background: '#e8f4ec', color: '#2d6a3a' }}>Спестете 50% с двойния комплект</div>}
                    {n === 3 && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 10px', borderRadius: 100, marginTop: 5, display: 'inline-block', background: '#fff0e0', color: '#a05a00' }}>Спестете 45 € с тройния комплект 🎉</div>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 22, fontWeight: 500, color: '#1C0F0A' }}>€{bundlePrices[n]}</div>
                  {n > 1 && <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', textDecoration: 'line-through', marginTop: 2 }}>€{n === 2 ? '89.98' : '134.97'}</div>}
                </div>
              </button>
            ))}
          </div>

          {/* Multi-pair lens slot picker */}
          {bundle > 1 && (
            <div style={{ background: 'rgba(28,15,10,0.03)', borderRadius: 10, padding: 18, marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, marginBottom: 12 }}>Изберете стъкла за всеки чифт</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {slots.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', width: 52, flexShrink: 0 }}>Чифт {i + 1}</span>
                    {(['evening', 'daily'] as Lens[]).map(l => (
                      <button
                        key={l}
                        onClick={() => handleSlot(i, l)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: `1.5px solid ${s === l ? '#1C0F0A' : 'rgba(28,15,10,0.14)'}`, borderRadius: 100, background: s === l ? '#1C0F0A' : '#fff8f2', color: s === l ? '#FAF0E4' : '#1C0F0A', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, padding: '7px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'inline-block', flexShrink: 0 }} />
                        {l === 'evening' ? 'Вечер' : 'За всеки ден'}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8, padding: '12px 16px', marginBottom: 12, fontSize: 13, background: '#f0f7ff', border: '1px solid rgba(60,120,200,0.2)', color: '#1a3a6e' }}>
            <svg width="16" height="16" fill="none" stroke="#3c78c8" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3" /><rect x="9" y="11" width="14" height="10" rx="2" /><circle cx="12" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
            <span><strong>Безплатна експресна доставка</strong> — пристига в рамките на 1–3 дни. Поръчайте днес преди 14:00 ч.</span>
          </div>

          {/* Savings callout */}
          {saving > 0 && (
            <div style={{ background: '#f0f7f1', border: '1px solid rgba(45,106,58,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1a4024', marginBottom: 12 }}>
              🎉 Спестявате <strong>€{saving}</strong> с тази комбинация
            </div>
          )}

          {/* Viewing now */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(28,15,10,0.5)', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, background: '#4caf6a', borderRadius: '50%', flexShrink: 0, animation: 'pulse-dot 1.8s ease infinite' }} />
            <span>{viewerCount} души разглеждат това в момента</span>
          </div>

          {/* CTA */}
          <div ref={ctaRef} style={{ margin: '24px 0 14px' }}>
            <button
              onClick={handleAddToCart}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1C0F0A', color: '#FAF0E4', border: 'none', padding: 19, fontFamily: 'var(--font-raleway)', fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer', borderRadius: 8, transition: 'opacity 0.2s, transform 0.2s' }}
            >
              Добави в количката — €{price} →
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(28,15,10,0.5)' }}>✓ 14-дневен безплатен връщане &nbsp;·&nbsp; ✓ Сертифицирани по CE &nbsp;·&nbsp; ✓ Сигурна плащане</p>

          {/* Payment icons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '12px 0 0', flexWrap: 'wrap' as const }}>
            {['VISA', 'MC', 'PayPal', 'Apple Pay', 'AMEX'].map(p => (
              <div key={p} style={{ padding: '4px 10px', border: '1px solid rgba(28,15,10,0.12)', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(28,15,10,0.35)', background: '#fff8f2' }}>{p}</div>
            ))}
          </div>

          {/* Cert strip */}
          <div style={{ border: '1px solid rgba(28,15,10,0.1)', borderRadius: 10, padding: '14px 16px', margin: '16px 0 0', background: '#fff8f2' }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.4)', marginBottom: 12 }}>Сертифицирани и тествани стъкла</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
              {[
                { title: 'BS EN ISO\n12312-1', sub: 'EU оптична безопасност', icon: '☆' },
                { title: 'ANSI\nZ80.3', sub: 'Американски стандарт', icon: '◷' },
                { title: 'AS/NZS\n1067.1', sub: 'Австралийски стандарт', icon: '◉' },
                { title: 'UV400\nЗащита', sub: 'Пълна UV защита', icon: '◈' },
                { title: 'Green Light\n500–560nm', sub: 'Green filter · NEW', icon: '◎' },
              ].map(c => (
                <div key={c.title} style={{ textAlign: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid rgba(196,154,108,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', color: '#C49A6C', fontSize: 14 }}>{c.icon}</div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#1C0F0A', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{c.title}</p>
                  <p style={{ fontSize: 9, color: '#C49A6C', marginTop: 3, lineHeight: 1.3 }}>{c.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, padding: '20px 0', borderTop: '1px solid rgba(28,15,10,0.09)', borderBottom: '1px solid rgba(28,15,10,0.09)', margin: '20px 0' }}>
            {[
              { icon: '🔒', label: 'Сигурна\nплащане' },
              { icon: '🚚', label: 'Безплатна експресна\nдоставка' },
              { icon: 'CE', label: 'Сертифицирани\nпо CE\nлещи' },
              { icon: '↩️', label: '14-дневен\nвръщане' },
            ].map(t => (
              <div key={t.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: t.icon === 'CE' ? 13 : 18, fontWeight: t.icon === 'CE' ? 800 : undefined, color: t.icon === 'CE' ? '#1C0F0A' : undefined, marginBottom: 4 }}>{t.icon}</div>
                <div style={{ fontSize: 10, color: 'rgba(28,15,10,0.5)', lineHeight: 1.4, whiteSpace: 'pre-line' }}>{t.label}</div>
              </div>
            ))}
          </div>

          {/* Detail tabs */}
          <div style={{ marginTop: 40, borderTop: '1px solid rgba(28,15,10,0.09)' }}>
            <div style={{ display: 'flex', gap: 0 }}>
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
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)' }}>{d.descText}</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginTop: 20 }}>
                  {[
                    { text: <><strong>98% блокиране на синята светлина</strong> — клинично доказано, че възстановява естественото производство на мелатонин</> },
                    { text: <><strong>Рамка от кристален ацетат</strong> — лека, с тегло 22 г, достатъчно издръжлива за ежедневна употреба</> },
                    { text: <><strong>Покритие против надраскване и отблясъци</strong> — лещите остават чисти в продължение на години</> },
                    { text: <><strong>Блокират синя и зелена светлина (415–560 nm)</strong> — защита с пълен спектър срещу двете дължини на вълната, които нарушават съня и предизвикват напрежение в очите</> },
                  ].map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 20, height: 20, background: '#F2E4D0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <svg width="10" height="10" fill="none" stroke="#C49A6C" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" /></svg>
                      </div>
                      <div style={{ fontSize: 14, lineHeight: 1.7, color: '#3d2416' }}>{f.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'science' && (
              <div style={{ padding: '28px 0' }}>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)' }}>Синята светлина в диапазона 415–455 nm е основната дължина на вълната, която стимулира супрахиазматичния ядро на мозъка да забави отделянето на мелатонин — като по същество сигнализира на тялото, че все още е ден. Лещите ALPÉ използват прецизно оптично покритие, което действа точно върху този диапазон.</p>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)', marginTop: 16 }}>Лещите Evening (оранжеви) блокират 98% от този диапазон. Лещите Daily (жълти) блокират 65%, като поддържат ползите за циркадния ритъм и същевременно запазват точността на цветовете при работа пред екран.</p>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)', marginTop: 16 }}>В проучване от 2022 г., публикувано в Journal of Sleep Research, очила, блокиращи синята светлина, носени 2 часа преди лягане, подобряват заспиването със средно 18 минути и увеличават общото време за сън с 24 минути.</p>
                <div style={{ marginTop: 24, background: '#f5ede4', border: '1.5px solid rgba(196,154,108,0.3)', borderRadius: 12, padding: '20px 22px' }}>
                  <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(28,15,10,0.75)' }}><strong style={{ color: '#1C0F0A' }}>Нови изследвания: Зелената светлина също има значение.</strong> Последните проучвания сочат, че зелената светлина в диапазона 500–560 nm също потиска производството на мелатонин, макар и с по-малка сила в сравнение със синята. Лещите ALPÉ Evening са насочени към двата диапазона, като ви осигуряват защита в целия спектър за възстановителен сън.</p>
                  <p style={{ fontSize: 11, color: 'rgba(196,154,108,0.9)', marginTop: 12 }}>Hattar и др., 2003 · Zhao и др., 2021</p>
                </div>
              </div>
            )}

            {tab === 'reviews' && (
              <div style={{ padding: '28px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { text: '„Тези очила оправиха съня ми буквално за 4 дни. Оранжевите лещи преди лягане вече са задължителни."', author: 'Лена К.', location: 'Берлин' },
                    { text: '„Очите ми вече не ме болят след 17:00 ч. Не осъзнавах колко зле е станало, докато ALPÉ не го оправи."', author: 'Елена М.', location: 'Мюнхен' },
                    { text: '„Бях скептичен. След три седмици спя по-добре, отколкото през последните години. Струва си всеки цент."', author: 'Джеймс Т.', location: 'Лондон' },
                    { text: '„Купих комплекта от 3 чифта – един за работа, един за вкъщи и един за пътуване. Гениално."', author: 'София Р.', location: 'Амстердам' },
                  ].map((r, i) => (
                    <div key={i} style={{ background: '#fff8f2', border: '1px solid rgba(28,15,10,0.07)', borderRadius: 10, padding: '22px 20px' }}>
                      <div style={{ color: '#C49A6C', fontSize: 13, letterSpacing: 1, marginBottom: 10 }}>★★★★★</div>
                      <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 15, fontStyle: 'italic', lineHeight: 1.65, color: '#1C0F0A', marginBottom: 12 }}>{r.text}</div>
                      <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)' }}><strong style={{ color: '#1C0F0A', fontWeight: 500 }}>{r.author}</strong> · verified buyer · {r.location}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Outcome stats */}
      <section style={{ background: '#fff8f2', borderTop: '1px solid rgba(28,15,10,0.08)', borderBottom: '1px solid rgba(28,15,10,0.08)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>Какво казват клиентите</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Резултати, които говорят <em style={{ fontStyle: 'italic', fontWeight: 400 }}>сами за себе си.</em></h2>
            <p style={{ fontSize: 14, color: 'rgba(28,15,10,0.5)', marginTop: 14 }}>Данните са от анкета сред 1 200 потребители на ALPÉ след 14 дни редовно ползване.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 28 }}>
            {[
              { label: 'По-малко напрежение в очите', pct: 87, desc: 'забелязаха намалено напрежение в очите в рамките на първите 3 дни от носенето на ALPÉ', delay: '0.2s' },
              { label: 'По-бързо заспиване', pct: 79, desc: 'заспаха по-бързо в рамките на първата седмица от използването на лещите Evening', delay: '0.35s' },
              { label: 'По-малко главоболия', pct: 74, desc: 'съобщиха за по-малко главоболия в края на деня, причинени от екрана, след преминаването към ALPÉ Daily', delay: '0.5s' },
              { label: 'Биха препоръчали', pct: 93, desc: 'биха препоръчали ALPÉ на приятел или член на семейството', delay: '0.65s' },
            ].map(s => (
              <div key={s.label} style={{ background: '#FAF0E4', border: '1px solid rgba(28,15,10,0.07)', borderRadius: 12, padding: '32px 36px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 20, fontWeight: 500, color: '#1C0F0A' }}>{s.label}</span>
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 36, fontWeight: 400, color: '#C49A6C' }}>{s.pct}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(28,15,10,0.07)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ width: `${s.pct}%`, height: '100%', background: '#C49A6C', borderRadius: 100 }} />
                </div>
                <p style={{ fontSize: 13, color: 'rgba(28,15,10,0.5)', marginTop: 12, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* First 7 nights */}
      <section style={{ padding: '80px 48px', background: '#FAF0E4' }}>
        <div style={{ maxWidth: 1020, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>Опитът с ALPÉ</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Първите ви <em style={{ fontStyle: 'italic', fontWeight: 400 }}>7 нощи.</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {[
              { n: '1', title: 'Днес', body: 'Поставете вечерните лещи 2 часа преди лягане. Очите ви ще усетят разликата веднага — по-малко напрежение, повече спокойствие.', dark: false },
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
      <section style={{ background: '#fff8f2', borderTop: '1px solid rgba(28,15,10,0.08)', padding: '80px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>Защо ALPÉ</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Не всички очила със защита от синя светлина <em style={{ fontStyle: 'italic', fontWeight: 400 }}>са еднакви.</em></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontFamily: 'var(--font-raleway)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, borderBottom: '2px solid rgba(28,15,10,0.1)' }}></th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#FAF0E4', background: '#1C0F0A', textAlign: 'center', borderBottom: '2px solid #1C0F0A' }}>ALPÉ</th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 500, color: 'rgba(28,15,10,0.5)', textAlign: 'center', borderBottom: '2px solid rgba(28,15,10,0.1)' }}>Обикновени</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Филтриране на синята светлина', ALPÉ: '65–98% (в зависимост от лещите)', generic: '10–30% (непотвърдено)', ALPÉColor: undefined as string | undefined, genericMuted: false },
                  { feature: 'Лещи със сертификат CE', ALPÉ: '✓', generic: 'Рядко', ALPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                  { feature: 'Изкривяване на цветовете', ALPÉ: 'Минимално (прецизно покритие)', generic: 'Силно изкривяване на оттенъка', ALPÉColor: undefined as string | undefined, genericMuted: false },
                  { feature: 'Тегло на рамката', ALPÉ: '22 г кристален ацетат', generic: '35–50 г пластмаса', ALPÉColor: undefined as string | undefined, genericMuted: false },
                  { feature: 'Покритие против надраскване', ALPÉ: '✓', generic: 'Не', ALPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                  { feature: 'Две специално създадени лещи', ALPÉ: '✓', generic: 'Един универсален оттенък', ALPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                  { feature: 'Филтър за зелена светлина (500–560 nm)', ALPÉ: '✓', generic: '✗ Не е включено', ALPÉColor: '#2d6a3a' as string | undefined, genericMuted: true },
                ].map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid rgba(28,15,10,0.07)', background: i % 2 === 1 ? '#fff8f2' : 'transparent' }}>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#1C0F0A' }}>{row.feature}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', background: 'rgba(28,15,10,0.03)' }}>
                      <span style={{ fontSize: row.ALPÉColor ? 16 : 13, fontWeight: row.ALPÉColor ? undefined : 500, color: row.ALPÉColor || '#1C0F0A' }}>{row.ALPÉ}</span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{ fontSize: 13, color: 'rgba(28,15,10,0.5)' }}>{row.generic}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* More images */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 48px 100px' }}>
        <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 32, fontWeight: 500, marginBottom: 32, color: '#1C0F0A' }}>Две стъкла. <em style={{ fontStyle: 'italic', fontWeight: 400 }}>Една рамка.</em></h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { src: '/images/shop/shop-evening-1.png', alt: 'ALPÉ Evening lens', label: 'Вечер · Преди лягане' },
            { src: '/images/shop/shop-daily-1.png', alt: 'ALPÉ Daily lens', label: 'За всеки ден · Работа пред екран' },
          ].map(img => (
            <div key={img.label} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" quality={100} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(28,15,10,0.75)', backdropFilter: 'blur(8px)', color: '#fff8f0', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '8px 16px', borderRadius: 100 }}>{img.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky add to cart bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 39, background: '#1C0F0A', color: '#FAF0E4', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, boxShadow: '0 -4px 24px rgba(28,15,10,0.18)', transform: stickyVisible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            <Image src={d.images[0].src} alt={`ALPÉ ${d.nameItalic}`} fill sizes="44px" className="object-cover" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 16, fontWeight: 500 }}>{d.name} <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d.nameItalic}</em></div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 1 }}>{bundle} чифт{bundle > 1 ? 'а' : ''}</div>
          </div>
        </div>
        <button onClick={handleAddToCart} style={{ background: '#FAF0E4', color: '#1C0F0A', border: 'none', padding: '13px 32px', fontFamily: 'var(--font-raleway)', fontSize: 14, fontWeight: 500, borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
          Add to Cart — €{price} →
        </button>
      </div>

      <style>{`
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(0.75);} }
        @media (max-width:960px) {
          .product-grid-inner { grid-template-columns: 1fr !important; gap: 40px !important; padding: 24px 24px 80px !important; }
        }
      `}</style>
    </div>
  )
}
