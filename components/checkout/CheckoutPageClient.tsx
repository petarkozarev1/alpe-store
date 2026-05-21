'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cartStore'
import { setPixelUser } from '@/components/analytics/MetaPixel'

/* ── constants ─────────────────────────────────────── */
const DELIVERY_PRICE = 4.99
const BGN_RATE = 1.95583
const formatBGN = (eur: number) => `${(eur * BGN_RATE).toFixed(2)} лв.`

const DELIVERY = [
  { id: 'speedy',  label: 'Спиди',    badge: 'ПРЕПОРЪЧАНО', requiresOffice: true,  officePlaceholder: 'напр. Спиди офис Сердика, бул. Сливница 2, София',       officeLink: 'https://www.speedy.bg/bg/office-search' },
  { id: 'econt',   label: 'Еконт',    badge: null,          requiresOffice: true,  officePlaceholder: 'напр. Еконт Сердика, бул. Сливница 2, София',           officeLink: 'https://www.econt.com/services/offices.html' },
  { id: 'boxnow',  label: 'BoxNow',   badge: null,          requiresOffice: true,  officePlaceholder: 'напр. BoxNow Mall of Sofia, бул. Климент Охридски',     officeLink: 'https://boxnow.bg/lockers' },
  { id: 'sameday', label: 'SameDay',  badge: null,          requiresOffice: true,  officePlaceholder: 'напр. SameDay локер НДК, пл. България 1, София',        officeLink: 'https://www.sameday.bg/en/parcel-locker' },
]

const DISCOUNT_CODES: Record<string, number> = { 'WELCOME10': 10, 'FAMILY40': 40 }

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return ''
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=') ?? ''
}

/* ── types ─────────────────────────────────────────── */
interface Contact { email: string; newsletter: boolean }
interface Shipping { firstName: string; lastName: string; phone: string; city: string; address: string; postalCode: string; country: string; note: string }

export default function CheckoutPageClient() {
  const { items } = useCartStore()

  const [contact, setContact] = useState<Contact>({ email: '', newsletter: false })
  const [shipping, setShipping] = useState<Shipping>({ firstName: '', lastName: '', phone: '', city: '', address: '', postalCode: '', country: 'България', note: '' })
  const [deliveryType, setDeliveryType] = useState<'address' | 'office'>('address')
  const [deliveryId, setDeliveryId] = useState('speedy')
  const [officeLocation, setOfficeLocation] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [applied, setApplied] = useState<{ code: string; percent: number } | null>(null)
  const [codeError, setCodeError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)

  /* ── inline validation helpers ──────────────────── */
  const isInvalid = (val: string) => attempted && !val.trim()
  const fieldClass = (val: string, base: string) =>
    `${base} ${isInvalid(val) ? 'border-red-500 focus:ring-red-500' : 'border-stone/25 focus:ring-onyx'}`
  const ErrorMsg = ({ show }: { show: boolean }) =>
    show ? <p className="font-sans text-xs text-red-600 mt-1.5">Това поле е задължително</p> : null

  /* ── Push collected info to Meta Pixel for Advanced Matching (higher EMQ on InitiateCheckout etc) */
  const syncPixelUser = () => {
    setPixelUser({
      email: contact.email,
      phone: shipping.phone,
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      city: shipping.city,
      country: shipping.country,
      zip: shipping.postalCode,
    }).catch(() => { /* silent — Pixel might not be initialized yet */ })
  }

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

    // Validate required fields before hitting the API
    const requiredOk =
      contact.email.trim() &&
      shipping.firstName.trim() &&
      shipping.lastName.trim() &&
      shipping.phone.trim() &&
      shipping.city.trim() &&
      (deliveryType === 'address'
        ? shipping.address.trim() && shipping.postalCode.trim()
        : officeLocation.trim())

    if (!requiredOk) {
      setAttempted(true)
      setError(null)
      // Scroll the first invalid field into view on the next tick
      setTimeout(() => {
        const firstInvalid = document.querySelector('.border-red-500') as HTMLElement | null
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        firstInvalid?.focus?.()
      }, 50)
      return
    }

    setLoading(true); setError(null)

    const lineItems = [
      ...items.map(i => ({ name: `${i.name} — ${i.variantLabel}`, price: i.price, quantity: i.quantity, image: i.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_SITE_URL}${i.image}` : i.image })),
      ...(discount > 0 ? [{ name: `Отстъпка ${applied!.code}`, price: -discount, quantity: 1 }] : []),
      ...(shipping_ > 0 ? [{ name: `Доставка — ${deliveryType === 'address' ? 'До адрес' : delivery.label}`, price: shipping_, quantity: 1 }] : []),
    ]
    const checkoutShipping = {
      name: `${shipping.firstName} ${shipping.lastName}`,
      phone: shipping.phone,
      city: shipping.city,
      address: deliveryType === 'address' ? shipping.address : officeLocation,
      postalCode: deliveryType === 'address' ? shipping.postalCode : '',
      country: deliveryType === 'address' ? shipping.country : 'България',
      deliveryMethod: deliveryType === 'address' ? 'До адрес' : delivery.label,
      courier: deliveryType === 'office' ? delivery.label : '',
      officeLocation: deliveryType === 'office' ? officeLocation : '',
      courierNote: shipping.note,
      fbp: getCookieValue('_fbp'),
      fbc: getCookieValue('_fbc'),
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: lineItems, email: contact.email, shipping: checkoutShipping }),
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

      <form onSubmit={handleSubmit} noValidate>
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
                <div>
                  <div className="relative">
                    <input
                      type="email" required placeholder="имейл@example.com"
                      value={contact.email}
                      onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                      onBlur={syncPixelUser}
                      className={fieldClass(contact.email, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')}
                    />
                    {contact.email.includes('@') && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600 text-sm">✓</span>}
                  </div>
                  <ErrorMsg show={isInvalid(contact.email)} />
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

            {/* Delivery — combined section */}
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">02.</span>Доставка</span>
              </div>
              <div className="flex flex-col gap-4">

                {/* Names */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Име</label>
                    <input required placeholder="Иван" value={shipping.firstName} onChange={e => setShipping(p => ({ ...p, firstName: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.firstName, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    <ErrorMsg show={isInvalid(shipping.firstName)} />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Фамилия</label>
                    <input required placeholder="Иванов" value={shipping.lastName} onChange={e => setShipping(p => ({ ...p, lastName: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.lastName, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    <ErrorMsg show={isInvalid(shipping.lastName)} />
                  </div>
                </div>

                {/* Phone + City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Телефон</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone/40 text-sm">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.55-.55a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
                      </span>
                      <input required type="tel" placeholder="+359 88 123 4567" value={shipping.phone} onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.phone, 'w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    </div>
                    <ErrorMsg show={isInvalid(shipping.phone)} />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Град</label>
                    <input required placeholder="София" value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.city, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    <ErrorMsg show={isInvalid(shipping.city)} />
                  </div>
                </div>

                {/* Delivery type toggle */}
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-2">Метод на доставка</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['address', 'office'] as const).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setDeliveryType(type); setOfficeLocation('') }}
                        className={`py-3 px-4 rounded-xl border text-sm font-sans font-semibold transition-all ${deliveryType === type ? 'border-onyx bg-onyx text-linen' : 'border-stone/25 text-stone hover:border-stone/50'}`}
                      >
                        {type === 'address' ? 'До адрес' : 'До офис / локер'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Conditional: address fields */}
                {deliveryType === 'address' && (
                  <>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Адрес <span className="text-stone/40 normal-case tracking-normal">улица, номер, етаж</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone/40">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        </span>
                        <input required placeholder="ул. Витоша 1, ет. 3" value={shipping.address} onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} className={fieldClass(shipping.address, 'w-full border rounded-xl pl-10 pr-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                      </div>
                      <ErrorMsg show={isInvalid(shipping.address)} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Пощенски код</label>
                        <input required placeholder="1000" value={shipping.postalCode} onChange={e => setShipping(p => ({ ...p, postalCode: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.postalCode, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                        <ErrorMsg show={isInvalid(shipping.postalCode)} />
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
                  </>
                )}

                {/* Conditional: courier + office/locker */}
                {deliveryType === 'office' && (
                  <div className="flex flex-col gap-3">
                    {DELIVERY.map(d => (
                      <div key={d.id}>
                        <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${deliveryId === d.id ? 'border-onyx bg-onyx/5' : 'border-stone/20 hover:border-stone/40'}`}>
                          <input type="radio" name="delivery" value={d.id} checked={deliveryId === d.id} onChange={() => { setDeliveryId(d.id); setOfficeLocation('') }} className="accent-onyx" />
                          <div className="flex items-center gap-2 flex-wrap flex-1">
                            <span className="font-sans text-sm font-semibold text-onyx">{d.label}</span>
                            {d.badge && <span className="font-sans text-[9px] font-bold uppercase tracking-widest bg-gold/20 text-iron px-2 py-0.5 rounded-full">{d.badge}</span>}
                          </div>
                        </label>
                        {deliveryId === d.id && (
                          <div className="mt-2 ml-4 pl-4 border-l-2 border-onyx/20">
                            <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Офис / локер <span className="normal-case tracking-normal text-stone/50">— въведи точното местоположение</span></label>
                            <input
                              required
                              placeholder={d.officePlaceholder}
                              value={officeLocation}
                              onChange={e => setOfficeLocation(e.target.value)}
                              className={fieldClass(officeLocation, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')}
                            />
                            <ErrorMsg show={isInvalid(officeLocation)} />
                            <p className="font-sans text-[10px] text-stone/50 mt-1.5">
                              Намери най-близкия офис на{' '}
                              <a href={d.officeLink} target="_blank" rel="noopener noreferrer" className="underline hover:text-stone transition-colors">сайта на куриера</a>
                              {' '}и го въведи тук.
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

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
                  <span className="text-right">€{subtotal.toFixed(2)} <span className="block text-[11px] text-stone/50">{formatBGN(subtotal)}</span></span>
                </div>
                {applied && (
                  <div className="flex justify-between text-green-700">
                    <span>Отстъпка ({applied.code})</span>
                    <span className="text-right">−€{discount.toFixed(2)} <span className="block text-[11px] text-green-600/70">−{formatBGN(discount)}</span></span>
                  </div>
                )}
                <div className="flex justify-between text-stone">
                  <span>Доставка · <em className="not-italic text-stone/60">{deliveryType === 'address' ? 'До адрес' : delivery.label}</em></span>
                  <span className={`text-right ${shipping_ === 0 ? 'text-green-600 italic' : ''}`}>
                    {shipping_ === 0 ? 'Безплатна' : (
                      <>€{shipping_.toFixed(2)} <span className="block text-[11px] text-stone/50 not-italic">{formatBGN(shipping_)}</span></>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-stone/60 text-xs">
                  <span>ДДС включен в цената</span>
                </div>
              </div>

              <hr className="border-stone/15 my-4" />

              <div className="flex justify-between items-baseline mb-5">
                <span className="font-sans text-base font-semibold text-onyx">Общо</span>
                <span className="text-right">
                  <span className="font-serif text-3xl font-bold text-onyx">€{total.toFixed(2)} <span className="font-sans text-xs text-stone font-normal">EUR</span></span>
                  <span className="block font-sans text-xs text-stone/60 mt-0.5">{formatBGN(total)}</span>
                </span>
              </div>

              {/* Trust block — contact + payment security */}
              <div className="bg-parchment/50 border border-stone/15 rounded-xl px-4 py-3 mb-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 font-sans text-[11px] text-stone">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 text-green-600 flex-shrink-0">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <span>Сигурно плащане със <strong className="text-onyx">Stripe</strong> · SSL криптиране</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-sans font-bold text-stone/70">
                  <span className="bg-white border border-stone/15 rounded px-1.5 py-0.5">VISA</span>
                  <span className="bg-white border border-stone/15 rounded px-1.5 py-0.5">MC</span>
                  <span className="bg-white border border-stone/15 rounded px-1.5 py-0.5"> Pay</span>
                  <span className="bg-white border border-stone/15 rounded px-1.5 py-0.5">G Pay</span>
                  <span className="bg-white border border-stone/15 rounded px-1.5 py-0.5">Revolut</span>
                </div>
                <div className="flex items-center gap-2 font-sans text-[11px] text-stone pt-1 border-t border-stone/10">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5 text-stone/50 flex-shrink-0">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>Нужда от помощ? <a href="mailto:support@alpe.bg" className="underline text-onyx hover:text-iron">support@alpe.bg</a> · <Link href="/contact" className="underline text-onyx hover:text-iron">Контакт</Link></span>
                </div>
              </div>

              {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</p>}

              <button
                type="submit"
                disabled={loading || !items.length}
                className="w-full bg-onyx text-linen py-4 rounded-xl font-sans font-bold text-sm tracking-wider uppercase hover:bg-iron transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                      <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    ИЗПРАЩАМЕ ТЕ КЪМ ПЛАЩАНЕ...
                  </>
                ) : (
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
