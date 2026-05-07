'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'

/* ── constants ─────────────────────────────────────── */
const DELIVERY_PRICE = 4.99

const DELIVERY = [
  { id: 'speedy',  label: 'Спиди',    badge: 'ПРЕПОРЪЧАНО', requiresOffice: true,  officePlaceholder: 'напр. Спиди офис Сердика, бул. Сливница 2, София',       officeLink: 'https://www.speedy.bg/bg/office-search' },
  { id: 'econt',   label: 'Еконт',    badge: null,          requiresOffice: true,  officePlaceholder: 'напр. Еконт Сердика, бул. Сливница 2, София',           officeLink: 'https://www.econt.com/services/offices.html' },
  { id: 'boxnow',  label: 'BoxNow',   badge: null,          requiresOffice: true,  officePlaceholder: 'напр. BoxNow Mall of Sofia, бул. Климент Охридски',     officeLink: 'https://boxnow.bg/lockers' },
  { id: 'sameday', label: 'SameDay',  badge: null,          requiresOffice: true,  officePlaceholder: 'напр. SameDay локер НДК, пл. България 1, София',        officeLink: 'https://www.sameday.bg/en/parcel-locker' },
]

const DISCOUNT_CODES: Record<string, number> = { 'WELCOME10': 10 }

/* ── types ─────────────────────────────────────────── */
interface Contact { email: string; newsletter: boolean }
interface Shipping { firstName: string; lastName: string; phone: string; city: string; address: string; postalCode: string; country: string; note: string }

export default function CheckoutPageClient() {
  const { items } = useCartStore()

  const [contact, setContact] = useState<Contact>({ email: '', newsletter: true })
  const [shipping, setShipping] = useState<Shipping>({ firstName: '', lastName: '', phone: '', city: '', address: '', postalCode: '', country: 'България', note: '' })
  const [deliveryId, setDeliveryId] = useState('speedy')
  const [officeLocation, setOfficeLocation] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [applied, setApplied] = useState<{ code: string; percent: number } | null>(null)
  const [codeError, setCodeError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* ── calculations ───────────────────────────────── */
  const delivery = DELIVERY.find(d => d.id === deliveryId)!
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const totalPairs = items.reduce((s, i) => {
    const m = i.variantId.match(/bundle-(\d+)/)
    return s + (m ? parseInt(m[1]) : 1) * i.quantity
  }, 0)
  const discount = applied ? +(subtotal * applied.percent / 100).toFixed(2) : 0
  const afterDiscount = subtotal - discount
  const shipping_ = totalPairs >= 2 ? 0 : DELIVERY_PRICE
  const total = +(afterDiscount + shipping_).toFixed(2)

  /* ── discount code ──────────────────────────────── */
  const applyCode = () => {
    const pct = DISCOUNT_CODES[codeInput.toUpperCase()]
    if (!pct) { setCodeError('Невалиден код'); return }
    setApplied({ code: codeInput.toUpperCase(), percent: pct })
    setCodeError('')
  }
  const removeCode = () => { setApplied(null); setCodeInput(''); setCodeError('') }

  /* ── submit ─────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) { setError('Количката ти е празна.'); return }
    setLoading(true); setError(null)

    const lineItems = [
      ...items.map(i => ({ name: `${i.name} — ${i.variantLabel}`, price: i.price, quantity: i.quantity, image: i.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_SITE_URL}${i.image}` : i.image })),
      ...(discount > 0 ? [{ name: `Отстъпка ${applied!.code}`, price: -discount, quantity: 1 }] : []),
      ...(shipping_ > 0 ? [{ name: `Доставка — ${delivery.label}`, price: shipping_, quantity: 1 }] : []),
    ]

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lineItems, email: contact.email, shipping: { name: `${shipping.firstName} ${shipping.lastName}`, phone: shipping.phone, address: shipping.address, city: shipping.city, postalCode: shipping.postalCode, country: shipping.country, officeLocation: delivery.requiresOffice ? officeLocation : '', deliveryMethod: delivery.label } }),
      })
      const data = await res.json()
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Грешка')
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при плащане')
      setLoading(false)
    }
  }

  /* ── UI ─────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-parchment">
      {/* Progress bar */}
      <div className="border-b border-stone/20 bg-parchment">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm font-sans">
            <span className="flex items-center gap-1.5 text-stone/50">
              <span className="w-6 h-6 rounded-full bg-onyx text-linen flex items-center justify-center text-xs">✓</span>
              КОШНИЦА
            </span>
            <span className="text-stone/30">──</span>
            <span className="flex items-center gap-1.5 text-onyx font-semibold">
              <span className="w-6 h-6 rounded-full bg-onyx text-linen flex items-center justify-center text-xs font-bold">2</span>
              ПЛАЩАНЕ
            </span>
            <span className="text-stone/30">──</span>
            <span className="flex items-center gap-1.5 text-stone/40">
              <span className="w-6 h-6 rounded-full border border-stone/30 flex items-center justify-center text-xs">3</span>
              ГОТОВО
            </span>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-stone font-sans">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"/>
            ЗАЩИТЕНО · SSL
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

          {/* ── Left column ───────────────────────── */}
          <div className="flex flex-col gap-6">

            {/* Section title */}
            <div>
              <h1 className="font-serif text-5xl font-bold text-onyx">Плащане.</h1>
              <p className="font-sans text-sm text-stone mt-2">Само на крачка от <em className="text-iron">по-спокоен сън</em> и <em className="text-iron">по-ясен ден</em>.<br/>Попълни данните си — изпращаме до 24 часа.</p>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">01.</span>Контакт</span>
                <span className="font-sans text-xs text-stone/40">ЗА ПОТВЪРЖДЕНИЕ</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="email" required placeholder="имейл@example.com"
                    value={contact.email}
                    onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx"
                  />
                  {contact.email.includes('@') && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-sm">✓</span>}
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={contact.newsletter} onChange={e => setContact(p => ({ ...p, newsletter: e.target.checked }))} className="mt-0.5 accent-onyx w-4 h-4 flex-shrink-0" />
                  <div>
                    <p className="font-sans text-xs font-bold text-onyx uppercase tracking-wide">Изпращайте ми новини и оферти</p>
                    <p className="font-sans text-[10px] text-stone/60 uppercase tracking-wide">Само важното — без спам.</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">02.</span>Адрес за доставка</span>
                <span className="font-sans text-xs text-stone/40">БЪЛГАРИЯ</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Име</label>
                    <input required placeholder="Иван" value={shipping.firstName} onChange={e => setShipping(p => ({ ...p, firstName: e.target.value }))} className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Фамилия</label>
                    <input required placeholder="Иванов" value={shipping.lastName} onChange={e => setShipping(p => ({ ...p, lastName: e.target.value }))} className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Телефон</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone/40 text-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
                      </span>
                      <input required type="tel" placeholder="+359 88 123 4567" value={shipping.phone} onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} className="w-full border border-stone/25 rounded-xl pl-10 pr-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Град</label>
                    <input required placeholder="София" value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Адрес <span className="text-stone/40 normal-case tracking-normal">улица, номер, етаж</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone/40 text-sm">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </span>
                    <input required placeholder="ул. Витоша 1, ет. 3" value={shipping.address} onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} className="w-full border border-stone/25 rounded-xl pl-10 pr-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Пощенски код</label>
                    <input required placeholder="1000" value={shipping.postalCode} onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value }))} className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Държава</label>
                    <select value={shipping.country} onChange={e => setShipping(p => ({ ...p, country: e.target.value }))} className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx">
                      <option>България</option>
                      <option>Германия</option>
                      <option>Франция</option>
                      <option>Италия</option>
                      <option>Испания</option>
                      <option>Нидерландия</option>
                      <option>Белгия</option>
                      <option>Австрия</option>
                      <option>Полша</option>
                      <option>Румъния</option>
                      <option>Гърция</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Бележка към куриера <span className="text-stone/40 normal-case tracking-normal">по избор</span></label>
                  <input placeholder="напр. Звъни преди доставка" value={shipping.note} onChange={e => setShipping(p => ({ ...p, note: e.target.value }))} className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                </div>
              </div>
            </div>

            {/* Delivery method */}
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">03.</span>Метод на доставка</span>
                <span className="font-sans text-xs text-stone/40">ИЗБЕРИ ЕДИН</span>
              </div>
              <div className="flex flex-col gap-3">
                {DELIVERY.map(d => (
                  <div key={d.id}>
                    <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${deliveryId === d.id ? 'border-onyx bg-onyx/5' : 'border-stone/20 hover:border-stone/40'}`}>
                      <input type="radio" name="delivery" value={d.id} checked={deliveryId === d.id} onChange={() => { setDeliveryId(d.id); setOfficeLocation('') }} className="accent-onyx" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-sans text-sm font-semibold text-onyx">{d.label}</span>
                          {d.badge && <span className="font-sans text-[9px] font-bold uppercase tracking-widest bg-gold/20 text-iron px-2 py-0.5 rounded-full">{d.badge}</span>}
                        </div>
                      </div>
                    </label>
                    {deliveryId === d.id && d.requiresOffice && (
                      <div className="mt-2 ml-4 pl-4 border-l-2 border-onyx/20">
                        <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Офис / локер <span className="normal-case tracking-normal text-stone/50">— въведи точното местоположение</span></label>
                        <input
                          required
                          placeholder={'officePlaceholder' in d ? d.officePlaceholder : ''}
                          value={officeLocation}
                          onChange={e => setOfficeLocation(e.target.value)}
                          className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx"
                        />
                        <p className="font-sans text-[10px] text-stone/50 mt-1.5">
                          Намери най-близкия офис на{' '}
                          <a href={d.officeLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone transition-colors">
                            сайта на куриера
                          </a>
                          {' '}и го въведи тук.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column — Order summary ──────── */}
          <div className="lg:sticky lg:top-6 self-start flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-lg font-bold text-onyx">Твоята поръчка</h2>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-4 mb-5">
                {items.map(item => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-linen flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-onyx text-linen text-[10px] font-bold flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-medium text-onyx truncate">{item.name}</p>
                      <p className="font-sans text-xs text-stone">{item.variantLabel}</p>
                    </div>
                    <span className="font-serif text-sm font-semibold text-onyx flex-shrink-0">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <hr className="border-stone/15 mb-4" />

              {/* Discount code */}
              {applied ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                  <span className="font-sans text-xs font-semibold text-green-700">{applied.code} · {applied.percent}% отстъпка приложена</span>
                  <button type="button" onClick={removeCode} className="font-sans text-xs text-stone hover:text-onyx transition-colors">Премахни</button>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <input
                    placeholder="Код за отстъпка"
                    value={codeInput}
                    onChange={e => { setCodeInput(e.target.value); setCodeError('') }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCode())}
                    className="flex-1 border border-stone/25 rounded-xl px-4 py-2.5 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx"
                  />
                  <button type="button" onClick={applyCode} className="font-sans text-sm font-semibold text-onyx border border-onyx/30 rounded-xl px-4 py-2.5 hover:bg-onyx hover:text-linen transition-colors">
                    ПРИЛАГАНЕ
                  </button>
                </div>
              )}
              {codeError && <p className="font-sans text-xs text-red-600 mb-3">{codeError}</p>}

              <hr className="border-stone/15 mb-4" />

              {/* Totals */}
              <div className="flex flex-col gap-2.5 font-sans text-sm">
                <div className="flex justify-between text-stone">
                  <span>Междинна сума</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                {applied && (
                  <div className="flex justify-between text-green-700">
                    <span>Отстъпка ({applied.code})</span>
                    <span>−€{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone">
                  <span>Доставка · <em className="not-italic text-stone/60">{delivery.label}</em></span>
                  <span className={shipping_ === 0 ? 'text-green-600 italic' : ''}>{shipping_ === 0 ? 'Безплатна' : `€${shipping_.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-stone/60 text-xs">
                  <span>ДДС включен в цената</span>
                </div>
              </div>

              <hr className="border-stone/15 my-4" />

              <div className="flex justify-between items-baseline mb-6">
                <span className="font-sans text-base font-semibold text-onyx">Общо</span>
                <span className="font-serif text-3xl font-bold text-onyx">€{total.toFixed(2)} <span className="font-sans text-xs text-stone font-normal">EUR</span></span>
              </div>

              {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading || !items.length}
                className="w-full bg-onyx text-linen py-4 rounded-xl font-sans font-bold text-sm tracking-wider uppercase hover:bg-iron transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? 'Пренасочване...' : (
                  <>ПОТВЪРДИ ПОРЪЧКА <span className="text-lg">→</span></>
                )}
              </button>

              <p className="font-sans text-[11px] text-stone/50 text-center mt-3">
                Като потвърдиш, приемаш{' '}
                <Link href="/terms" className="underline hover:text-stone transition-colors">Условията за ползване</Link>
                {' '}и{' '}
                <Link href="/privacy" className="underline hover:text-stone transition-colors">Политиката за поверителност</Link>.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
