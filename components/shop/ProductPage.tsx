'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'

type Lens = 'evening' | 'daily'
type Tab = 'description' | 'science' | 'reviews'

const lensData = {
  evening: {
    name: 'ALPE Evening',
    nameItalic: 'Evening',
    tagline: "The orange lens that signals your brain it's time to wind down. Blocks 98% of blue light for deep, restorative sleep — felt within the first week.",
    benefitBg: '#fff5eb',
    benefitBorder: 'rgba(196,154,108,0.3)',
    benefitDot: 'linear-gradient(135deg,#ff6a00,#c0392b)',
    benefitText: 'Best worn 2 hours before sleep',
    benefitColor: '#7a4e1a',
    descText: "The ALPE Evening lens was designed for one thing: sleep. Worn 2 hours before bed, its deep orange tint blocks 98% of blue light in the 415–455nm range — the wavelengths most responsible for suppressing melatonin. Within a week of consistent use, most customers report falling asleep faster and waking up feeling genuinely rested.",
    images: [
      { src: '/images/shop/shop-evening-1.png', alt: 'ALPE Evening — lifestyle' },
      { src: '/images/shop/shop-evening-2.png', alt: 'ALPE Evening — glasses' },
      { src: '/images/shop/shop-evening-3.png', alt: 'ALPE Evening — box' },
    ],
  },
  daily: {
    name: 'ALPE Daily',
    nameItalic: 'Daily',
    tagline: "The clear-yellow lens for all-day screen use. Filters the harshest wavelengths without distorting colors — so you can work comfortably from 9am to 6pm.",
    benefitBg: '#fffbe0',
    benefitBorder: 'rgba(200,180,0,0.25)',
    benefitDot: 'linear-gradient(135deg,#f9e94e,#e6b800)',
    benefitText: 'Ideal for all-day screen use',
    benefitColor: '#7a6200',
    descText: "The ALPE Daily lens is built for the long screen session. Its amber-yellow tint cuts 65% of blue light — enough to reduce eye strain and end-of-day headaches — while keeping colors accurate enough for design work, photo editing, and video calls. Lightweight, comfortable, and wearable for 8+ hours.",
    images: [
      { src: '/images/shop/shop-daily-1.png', alt: 'ALPE Daily — lifestyle' },
      { src: '/images/shop/shop-daily-2.png', alt: 'ALPE Daily — glasses' },
      { src: '/images/shop/shop-daily-3.png', alt: 'ALPE Daily — box' },
    ],
  },
}

const bundlePrices: Record<number, number> = { 1: 40, 2: 60, 3: 80 }
const bundleSavings: Record<number, number> = { 1: 0, 2: 20, 3: 40 }

export default function ProductPage() {
  const [lens, setLens] = useState<Lens>('evening')
  const [bundle, setBundle] = useState(1)
  const [thumbIdx, setThumbIdx] = useState({ evening: 0, daily: 0 })
  const [slots, setSlots] = useState<Lens[]>(['evening'])
  const [tab, setTab] = useState<Tab>('description')
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const [stickyVisible, setStickyVisible] = useState(false)
  const [viewerCount] = useState(() => Math.floor(Math.random() * 20) + 18)
  const ctaRef = useRef<HTMLDivElement>(null)
  const addToCart = useCartStore(s => s.addItem)

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
      productId: `alpe-${lens}`,
      variantId: `alpe-${lens}-bundle-${bundle}`,
      name: `ALPE ${d.nameItalic}`,
      variantLabel: `${bundle} Pair${bundle > 1 ? 's' : ''}`,
      price: bundlePrices[bundle],
      quantity: 1,
      image: d.images[0].src,
      slug: 'alpe-glasses',
    })
  }

  const d = lensData[lens]
  const currentImg = d.images[thumbIdx[lens]]
  const price = bundlePrices[bundle]
  const saving = bundleSavings[bundle]

  return (
    <div style={{ background: '#FAF0E4', color: '#1C0F0A', fontFamily: 'var(--font-raleway), system-ui, sans-serif', fontWeight: 300 }}>

      {/* Breadcrumb */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '18px 48px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(28,15,10,0.5)', letterSpacing: '0.06em' }}>
        <Link href="/" style={{ color: 'rgba(28,15,10,0.5)', textDecoration: 'none' }}>Home</Link>
        <span style={{ opacity: 0.4 }}>›</span>
        <span style={{ color: '#1C0F0A' }}>ALPE {d.nameItalic}</span>
      </div>

      {/* Main product grid */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 48px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'start' }}>

        {/* LEFT: Gallery */}
        <div style={{ position: 'sticky', top: 80 }}>
          {/* Main image */}
          <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: 12, overflow: 'hidden', background: '#f5ede2', position: 'relative', marginBottom: 14 }}>
            <Image src={currentImg.src} alt={currentImg.alt} fill sizes="(min-width:960px) 50vw, 100vw" className="object-cover" />

            {/* Lens toggle on image */}
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, background: 'rgba(28,15,10,0.72)', backdropFilter: 'blur(12px)', borderRadius: 100, padding: 5, zIndex: 2, whiteSpace: 'nowrap' }}>
              <button
                onClick={() => handleLens('evening')}
                style={{ border: 'none', background: lens === 'evening' ? '#FAF0E4' : 'transparent', color: lens === 'evening' ? '#1C0F0A' : 'rgba(255,248,240,0.7)', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.25s' }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#ff6a00,#c0392b)', display: 'inline-block', flexShrink: 0 }} />
                Evening
              </button>
              <button
                onClick={() => handleLens('daily')}
                style={{ border: 'none', background: lens === 'daily' ? '#FAF0E4' : 'transparent', color: lens === 'daily' ? '#1C0F0A' : 'rgba(255,248,240,0.7)', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '9px 20px', borderRadius: 100, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.25s' }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'inline-block', flexShrink: 0 }} />
                Daily
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
                <Image src={img.src} alt={img.alt} fill sizes="120px" className="object-cover" />
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
            ALPE <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d.nameItalic}</em>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(28,15,10,0.5)', lineHeight: 1.75, marginBottom: 20 }}>{d.tagline}</p>

          {/* Benefit pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 100, padding: '7px 16px', marginBottom: 28, background: d.benefitBg, border: `1px solid ${d.benefitBorder}`, fontSize: 13 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: d.benefitDot, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ color: d.benefitColor }}>{d.benefitText}</span>
          </div>

          <div style={{ height: 1, background: 'rgba(28,15,10,0.09)', margin: '24px 0' }} />

          {/* Lens selector */}
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, marginBottom: 12 }}>Choose your lens</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {(['evening', 'daily'] as Lens[]).map(l => (
              <button
                key={l}
                onClick={() => handleLens(l)}
                style={{ border: `2px solid ${lens === l ? '#1C0F0A' : 'rgba(28,15,10,0.1)'}`, borderRadius: 10, padding: 16, cursor: 'pointer', background: lens === l ? 'rgba(28,15,10,0.05)' : '#fff8f2', transition: 'all 0.2s', textAlign: 'left', boxShadow: lens === l ? '0 0 0 1px #1C0F0A' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 16, fontWeight: 500, color: '#1C0F0A' }}>{l === 'evening' ? 'Evening' : 'Daily'}</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', lineHeight: 1.4 }}>{l === 'evening' ? 'Orange · Evenings & pre-sleep' : 'Yellow · All-day screen use'}</div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' as const, padding: '2px 8px', borderRadius: 100, marginTop: 8, display: 'inline-block', background: l === 'evening' ? '#fff0e6' : '#fffbe0', color: l === 'evening' ? '#a04000' : '#806000' }}>{l === 'evening' ? '98% blue block' : '65% blue filter'}</div>
              </button>
            ))}
          </div>

          {/* Bundle selector */}
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, marginBottom: 12 }}>How many pairs?</div>
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
                      <span style={{ fontSize: 15, fontWeight: 500, color: '#1C0F0A' }}>{n} Pair{n > 1 ? 's' : ''}</span>
                      {n === 2 && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' as const, padding: '3px 9px', borderRadius: 4, background: '#C49A6C', color: '#fff8f0' }}>Most Popular</span>}
                      {n === 3 && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase' as const, padding: '3px 9px', borderRadius: 4, background: '#1C0F0A', color: '#FAF0E4' }}>Best Value</span>}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', marginTop: 2 }}>{n === 1 ? 'Your chosen lens' : n === 2 ? 'Mix & match lenses' : 'One for everyone at home'}</div>
                    {n === 2 && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 10px', borderRadius: 100, marginTop: 5, display: 'inline-block', background: '#e8f4ec', color: '#2d6a3a' }}>50% off 2nd pair — save €20</div>}
                    {n === 3 && <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '3px 10px', borderRadius: 100, marginTop: 5, display: 'inline-block', background: '#fff0e0', color: '#a05a00' }}>3rd pair FREE 🎉 — save €40</div>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 22, fontWeight: 500, color: '#1C0F0A' }}>€{bundlePrices[n]}</div>
                  {n > 1 && <div style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', textDecoration: 'line-through', marginTop: 2 }}>€{n === 2 ? 80 : 120}</div>}
                </div>
              </button>
            ))}
          </div>

          {/* Multi-pair lens slot picker */}
          {bundle > 1 && (
            <div style={{ background: 'rgba(28,15,10,0.03)', borderRadius: 10, padding: 18, marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, marginBottom: 12 }}>Choose a lens for each pair</div>
              <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
                {slots.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' as const }}>
                    <span style={{ fontSize: 12, color: 'rgba(28,15,10,0.5)', width: 52, flexShrink: 0 }}>Pair {i + 1}</span>
                    {(['evening', 'daily'] as Lens[]).map(l => (
                      <button
                        key={l}
                        onClick={() => handleSlot(i, l)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, border: `1.5px solid ${s === l ? '#1C0F0A' : 'rgba(28,15,10,0.14)'}`, borderRadius: 100, background: s === l ? '#1C0F0A' : '#fff8f2', color: s === l ? '#FAF0E4' : '#1C0F0A', fontFamily: 'var(--font-raleway)', fontSize: 12, fontWeight: 500, padding: '7px 16px', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <span style={{ width: 9, height: 9, borderRadius: '50%', background: l === 'evening' ? 'linear-gradient(135deg,#ff6a00,#c0392b)' : 'linear-gradient(135deg,#f9e94e,#e6b800)', display: 'inline-block', flexShrink: 0 }} />
                        {l === 'evening' ? 'Evening' : 'Daily'}
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
            <span><strong>Free express delivery</strong> — arrives in 1–3 days. Order before 2pm today.</span>
          </div>

          {/* Urgency strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8, padding: '12px 16px', marginBottom: 12, fontSize: 13, background: '#fff5eb', border: '1px solid rgba(196,154,108,0.28)', color: '#7a4e1a' }}>
            <svg width="14" height="14" fill="none" stroke="#C49A6C" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            <span><strong>Only 8 left</strong> at this price — sale ends midnight</span>
          </div>

          {/* Savings callout */}
          {saving > 0 && (
            <div style={{ background: '#f0f7f1', border: '1px solid rgba(45,106,58,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#1a4024', marginBottom: 12 }}>
              🎉 You save <strong>€{saving}</strong> with this bundle
            </div>
          )}

          {/* Viewing now */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(28,15,10,0.5)', marginBottom: 20 }}>
            <span style={{ width: 7, height: 7, background: '#4caf6a', borderRadius: '50%', flexShrink: 0, animation: 'pulse-dot 1.8s ease infinite' }} />
            <span>{viewerCount} people viewing this right now</span>
          </div>

          {/* CTA */}
          <div ref={ctaRef} style={{ margin: '24px 0 14px' }}>
            <button
              onClick={handleAddToCart}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#1C0F0A', color: '#FAF0E4', border: 'none', padding: 19, fontFamily: 'var(--font-raleway)', fontSize: 15, fontWeight: 500, letterSpacing: '0.04em', cursor: 'pointer', borderRadius: 8, transition: 'opacity 0.2s, transform 0.2s' }}
            >
              Add to Cart — €{price} →
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(28,15,10,0.5)' }}>✓ 14-day free returns &nbsp;·&nbsp; ✓ CE certified &nbsp;·&nbsp; ✓ Secure checkout</p>

          {/* Payment icons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, margin: '12px 0 0', flexWrap: 'wrap' as const }}>
            {['VISA', 'MC', 'PayPal', 'Apple Pay', 'AMEX'].map(p => (
              <div key={p} style={{ padding: '4px 10px', border: '1px solid rgba(28,15,10,0.12)', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(28,15,10,0.35)', background: '#fff8f2' }}>{p}</div>
            ))}
          </div>

          {/* Trust row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, padding: '20px 0', borderTop: '1px solid rgba(28,15,10,0.09)', borderBottom: '1px solid rgba(28,15,10,0.09)', margin: '20px 0' }}>
            {[
              { icon: '🔒', label: 'Secure\nCheckout' },
              { icon: '🚚', label: 'Free Express\nShipping' },
              { icon: 'CE', label: 'Certified\nLenses' },
              { icon: '↩️', label: '14-Day\nReturns' },
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
                  {t === 'description' ? 'Description' : t === 'science' ? 'The Science' : 'Reviews'}
                </button>
              ))}
            </div>

            {tab === 'description' && (
              <div style={{ padding: '28px 0' }}>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)' }}>{d.descText}</p>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14, marginTop: 20 }}>
                  {[
                    { text: <><strong>98% blue light block</strong> — clinically proven to restore natural melatonin production</> },
                    { text: <><strong>Crystal acetate frame</strong> — lightweight at 22g, durable enough for daily use</> },
                    { text: <><strong>Anti-scratch & anti-glare coating</strong> — lenses stay clear for years</> },
                    { text: <><strong>Lifetime warranty</strong> — we replace your lenses for free, forever</> },
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
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)' }}>Blue light in the 415–455nm range is the primary wavelength that triggers the brain's suprachiasmatic nucleus to delay melatonin release — essentially telling your body it's still daytime. ALPE lenses use a precision optical coating that targets exactly this range.</p>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)', marginTop: 16 }}>The Evening lens (orange) blocks 98% of this range. The Daily lens (yellow) blocks 65%, maintaining circadian benefit while preserving color accuracy for screen work.</p>
                <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(28,15,10,0.5)', marginTop: 16 }}>In a 2022 study published in the Journal of Sleep Research, blue-light-blocking glasses worn for 2 hours before bed improved sleep onset by an average of 18 minutes and increased total sleep time by 24 minutes.</p>
              </div>
            )}

            {tab === 'reviews' && (
              <div style={{ padding: '28px 0' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { text: '"These fixed my sleep in literally 4 days. Orange lenses before bed are non-negotiable now."', author: 'Lena K.', location: 'Berlin' },
                    { text: '"My eyes stop hurting by 5pm now. I didn\'t realise how bad it had gotten until ALPE fixed it."', author: 'Elena M.', location: 'Munich' },
                    { text: '"I was sceptical. Three weeks in I\'ve slept better than I have in years. Worth every cent."', author: 'James T.', location: 'London' },
                    { text: '"Bought the 3-pair bundle — one at work, one at home, one for travel. Genius."', author: 'Sofia R.', location: 'Amsterdam' },
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
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>What customers feel</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Results that speak <em style={{ fontStyle: 'italic', fontWeight: 400 }}>for themselves.</em></h2>
            <p style={{ fontSize: 14, color: 'rgba(28,15,10,0.5)', marginTop: 14 }}>Based on a customer survey of 1,200 ALPE users after 14 days of consistent use.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 28 }}>
            {[
              { label: 'Less eye strain', pct: 87, desc: 'noticed reduced eye tension within the first 3 days of wearing ALPE', delay: '0.2s' },
              { label: 'Faster sleep onset', pct: 79, desc: 'fell asleep faster within the first week of using the Evening lens', delay: '0.35s' },
              { label: 'Fewer headaches', pct: 74, desc: 'reported fewer end-of-day screen headaches after switching to ALPE Daily', delay: '0.5s' },
              { label: 'Would recommend', pct: 93, desc: 'would recommend ALPE to a friend or family member', delay: '0.65s' },
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
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>The ALPE experience</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Your first <em style={{ fontStyle: 'italic', fontWeight: 400 }}>7 nights.</em></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {[
              { n: '1', title: 'Tonight', body: 'Put on the Evening lens 2 hours before bed. Your eyes will feel the difference immediately — less tension, more calm.', dark: false },
              { n: '3', title: 'Day 3', body: "Eye strain starts to ease. The headache you used to get by 4pm? You might not notice it today.", dark: false },
              { n: '5', title: 'Day 5', body: "Your melatonin rhythm starts to reset. You fall asleep faster — and wake up before the alarm without dreading it.", dark: false },
              { n: '7', title: 'Night 7', body: "This is the night most customers send us a message. Sleep that feels like sleep again.", dark: true },
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
            <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: '#C49A6C', fontWeight: 500, marginBottom: 12 }}>Why ALPE</div>
            <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 40, fontWeight: 500, color: '#1C0F0A', lineHeight: 1.1 }}>Not all blue-light glasses <em style={{ fontStyle: 'italic', fontWeight: 400 }}>are equal.</em></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontFamily: 'var(--font-raleway)' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: 'rgba(28,15,10,0.5)', fontWeight: 500, borderBottom: '2px solid rgba(28,15,10,0.1)' }}></th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: '#FAF0E4', background: '#1C0F0A', textAlign: 'center', borderBottom: '2px solid #1C0F0A' }}>ALPE</th>
                  <th style={{ padding: '14px 20px', fontSize: 13, fontWeight: 500, color: 'rgba(28,15,10,0.5)', textAlign: 'center', borderBottom: '2px solid rgba(28,15,10,0.1)' }}>Generic</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Blue light filtration', alpe: '65–98% (lens-specific)', generic: '10–30% (unverified)' },
                  { feature: 'CE Certified lenses', alpe: '✓', generic: 'Rarely', alpeColor: '#2d6a3a', genericMuted: true },
                  { feature: 'Color distortion', alpe: 'Minimal (precision coat)', generic: 'Heavy tint distortion' },
                  { feature: 'Frame weight', alpe: '22g crystal acetate', generic: '35–50g plastic' },
                  { feature: 'Anti-scratch coating', alpe: '✓', generic: 'No', alpeColor: '#2d6a3a', genericMuted: true },
                  { feature: 'Two purpose-built lenses', alpe: '✓', generic: 'One generic tint', alpeColor: '#2d6a3a', genericMuted: true },
                ].map((row, i) => (
                  <tr key={row.feature} style={{ borderBottom: '1px solid rgba(28,15,10,0.07)', background: i % 2 === 1 ? '#fff8f2' : 'transparent' }}>
                    <td style={{ padding: '16px 20px', fontSize: 14, color: '#1C0F0A' }}>{row.feature}</td>
                    <td style={{ padding: '16px 20px', textAlign: 'center', background: 'rgba(28,15,10,0.03)' }}>
                      <span style={{ fontSize: (row as any).alpeColor ? 16 : 13, fontWeight: (row as any).alpeColor ? undefined : 500, color: (row as any).alpeColor || '#1C0F0A' }}>{row.alpe}</span>
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
        <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 32, fontWeight: 500, marginBottom: 32, color: '#1C0F0A' }}>Two lenses. <em style={{ fontStyle: 'italic', fontWeight: 400 }}>One frame.</em></h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {[
            { src: '/images/shop/shop-evening-1.png', alt: 'ALPE Evening lens', label: 'Evening · Pre-sleep' },
            { src: '/images/shop/shop-daily-1.png', alt: 'ALPE Daily lens', label: 'Daily · Screen use' },
          ].map(img => (
            <div key={img.label} style={{ borderRadius: 12, overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(28,15,10,0.75)', backdropFilter: 'blur(8px)', color: '#fff8f0', fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '8px 16px', borderRadius: 100 }}>{img.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Email capture */}
      <section style={{ background: '#1C0F0A', padding: '72px 48px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(250,240,228,0.5)', fontWeight: 500, marginBottom: 14 }}>Stay in the loop</div>
          <h2 style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 34, fontWeight: 500, color: '#FAF0E4', lineHeight: 1.15, marginBottom: 14 }}>Sleep tips, lens guides & <em style={{ fontStyle: 'italic', fontWeight: 400 }}>early access.</em></h2>
          <p style={{ fontSize: 14, color: 'rgba(250,240,228,0.55)', lineHeight: 1.75, marginBottom: 32 }}>No noise. Just useful things — straight to your inbox, once a month.</p>
          {!emailSent ? (
            <form onSubmit={e => { e.preventDefault(); setEmailSent(true) }} style={{ display: 'flex', gap: 10, maxWidth: 440, margin: '0 auto', flexWrap: 'wrap' as const }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{ flex: 1, minWidth: 200, background: 'rgba(250,240,228,0.08)', border: '1px solid rgba(250,240,228,0.2)', color: '#FAF0E4', fontFamily: 'var(--font-raleway)', fontSize: 14, padding: '14px 18px', borderRadius: 6, outline: 'none' }}
              />
              <button type="submit" style={{ background: '#FAF0E4', color: '#1C0F0A', border: 'none', padding: '14px 28px', fontFamily: 'var(--font-raleway)', fontSize: 13, fontWeight: 500, letterSpacing: '0.06em', borderRadius: 6, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
                Subscribe
              </button>
            </form>
          ) : (
            <p style={{ fontSize: 13, color: 'rgba(250,240,228,0.7)' }}>✓ You're in. Welcome to the ALPE community.</p>
          )}
          <p style={{ fontSize: 11, color: 'rgba(250,240,228,0.3)', marginTop: 18, lineHeight: 1.6 }}>No spam, ever. Unsubscribe with one click.</p>
        </div>
      </section>

      {/* Sticky add to cart bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 500, background: '#1C0F0A', color: '#FAF0E4', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, boxShadow: '0 -4px 24px rgba(28,15,10,0.18)', transform: stickyVisible ? 'translateY(0)' : 'translateY(100%)', transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
            <Image src={d.images[0].src} alt={`ALPE ${d.nameItalic}`} fill sizes="44px" className="object-cover" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-cormorant), Georgia, serif', fontSize: 16, fontWeight: 500 }}>ALPE <em style={{ fontStyle: 'italic', fontWeight: 400 }}>{d.nameItalic}</em></div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 1 }}>{bundle} Pair{bundle > 1 ? 's' : ''}</div>
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
