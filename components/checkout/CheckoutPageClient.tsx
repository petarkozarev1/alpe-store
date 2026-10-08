'use client'
import { useState, useEffect } from 'react'
import { CheckoutShell } from './CheckoutShell'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { localizeCartVariantLabel } from '@/lib/i18n/cart'
import { useCartStore } from '@/lib/store/cartStore'
import { setPixelUser } from '@/components/analytics/MetaPixel'
import { countPairs, priceForPairs, naiveSubtotal } from '@/lib/pricing'
import { getPromo, promoDiscount } from '@/lib/promo'
import { translate } from '@/lib/i18n/translations'

const DELIVERY_PRICE = 4.99
const COD_FEE = 1.0
const BGN_RATE = 1.95583

const DELIVERY = [
  { id: 'speedy',  label: 'Спиди',    badge: null as string | null, requiresOffice: true,  officePlaceholder: 'напр. Спиди офис Сердика, бул. Сливница 2, София',       officeLink: 'https://www.speedy.bg/bg/office-search', availableOnCod: true },
  { id: 'econt',   label: 'Еконт',    badge: null,          requiresOffice: true,  officePlaceholder: 'напр. Еконт Сердика, бул. Сливница 2, София',           officeLink: 'https://www.econt.com/services/offices.html', availableOnCod: true },
  { id: 'boxnow',  label: 'BoxNow',   badge: null,          requiresOffice: true,  officePlaceholder: 'напр. BoxNow Mall of Sofia, бул. Климент Охридски',     officeLink: 'https://boxnow.bg/lockers', availableOnCod: false },
  { id: 'pigeon',  label: 'Pigeon Express', badge: 'ПРЕПОРЪЧАНО', requiresOffice: true,  officePlaceholder: 'напр. Pigeon Express локер НДК, пл. България 1, София', officeLink: 'https://pigeonexpress.com', availableOnCod: true },
]

const COD_PREFERRED_COURIER = 'pigeon'

function getCookieValue(name: string) {
  if (typeof document === 'undefined') return ''
  return document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=').slice(1).join('=') ?? ''
}

interface Contact { email: string }
interface Shipping { firstName: string; lastName: string; phone: string; city: string; address: string; postalCode: string; country: string; note: string }

export default function CheckoutPageClient() {
  const locale = useLocale()
  const formatBGN = (eur: number) => `${(eur * BGN_RATE).toFixed(2)} ${locale === 'en' ? 'BGN' : 'лв.'}`
  const { items } = useCartStore()

  const [contact, setContact] = useState<Contact>({ email: '' })
  const [shipping, setShipping] = useState<Shipping>({ firstName: '', lastName: '', phone: '', city: '', address: '', postalCode: '', country: locale === 'en' ? 'Bulgaria' : 'България', note: '' })
  const [deliveryType, setDeliveryType] = useState<'address' | 'office'>('address')
  const [deliveryId, setDeliveryId] = useState('pigeon')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card')
  const [officeLocation, setOfficeLocation] = useState('')
  const [codeInput, setCodeInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [codeError, setCodeError] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const markTouched = (key: string) => setTouched(p => ({ ...p, [key]: true }))

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
  const isValidPhone = (v: string) => {
    const digits = v.replace(/\D/g, '')
    return /^\+?[\d\s()-]+$/.test(v.trim()) && digits.length >= 8 && digits.length <= 15
  }
  const isInvalid = (val: string) => attempted && !val.trim()
  const fieldError = (key: string, val: string, format?: (v: string) => boolean): string => {
    if (!(attempted || touched[key])) return ''
    if (!val.trim()) return translate(locale, 'Това поле е задължително')
    if (format && !format(val)) return translate(locale, key === 'email' ? 'Въведи валиден имейл адрес' : 'Въведи валиден телефонен номер')
    return ''
  }
  const fieldClass = (val: string, base: string, invalid = isInvalid(val)) =>
    `${base} ${invalid ? 'border-red-500 focus:ring-red-500' : 'border-stone/25 focus:ring-onyx'}`
  const ErrorMsg = ({ show, message = translate(locale, 'Това поле е задължително') }: { show: boolean; message?: string }) =>
    show ? <p className="font-sans text-xs text-red-600 mt-1.5">{message}</p> : null

  const syncPixelUser = () => {
    setPixelUser({
      email: contact.email, phone: shipping.phone, firstName: shipping.firstName, lastName: shipping.lastName,
      city: shipping.city, country: shipping.country, zip: shipping.postalCode,
    }).catch(() => {})
  }

  const totalPairs = countPairs(items)
  const subtotal = naiveSubtotal(items)
  const bundlePrice = priceForPairs(totalPairs)
  const bundleSaving = +Math.max(0, subtotal - bundlePrice).toFixed(2)
  const promo = promoDiscount(bundlePrice, appliedCode)
  const shipping_ = totalPairs >= 2 ? 0 : DELIVERY_PRICE
  const codEligible = deliveryType === 'office' || ['България', 'Bulgaria', 'BG'].includes(shipping.country.trim())
  const isCod = paymentMethod === 'cod' && codEligible
  const visibleDelivery = isCod ? DELIVERY.filter(d => d.availableOnCod) : DELIVERY
  const delivery = visibleDelivery.find(d => d.id === deliveryId) ?? visibleDelivery[0]
  const codFee = isCod ? COD_FEE : 0
  const total = +(bundlePrice - promo.amount + shipping_ + codFee).toFixed(2)

  useEffect(() => {
    if (paymentMethod === 'cod' && !codEligible) setPaymentMethod('card')
  }, [paymentMethod, codEligible])

  useEffect(() => {
    if (!isCod) return
    const allowed = DELIVERY.filter(d => d.availableOnCod).map(d => d.id)
    if (!allowed.includes(deliveryId)) {
      setDeliveryId(COD_PREFERRED_COURIER)
      setOfficeLocation('')
    }
  }, [isCod, deliveryId])

  const applyCode = () => {
    const p = getPromo(codeInput)
    if (!p) { setCodeError(translate(locale, 'Невалиден код')); return }
    setAppliedCode(p.code)
    setCodeError('')
  }
  const removeCode = () => { setAppliedCode(null); setCodeInput(''); setCodeError('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!items.length) { setError(translate(locale, 'Количката ти е празна.')); return }
    const requiredOk =
      isValidEmail(contact.email) && shipping.firstName.trim() && shipping.lastName.trim() &&
      isValidPhone(shipping.phone) && shipping.city.trim() &&
      (deliveryType === 'address' ? shipping.address.trim() && shipping.postalCode.trim() : officeLocation.trim())
    if (!requiredOk) {
      setAttempted(true)
      setError(null)
      setTimeout(() => {
        const firstInvalid = document.querySelector('.border-red-500') as HTMLElement | null
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        firstInvalid?.focus?.()
      }, 50)
      return
    }
    setLoading(true); setError(null)
    const lineItems = items.map(i => ({
      name: `${i.name} — ${localizeCartVariantLabel(locale, i.variantLabel)}`,
      price: i.price, quantity: i.quantity, variantId: i.variantId,
      image: i.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_SITE_URL}${i.image}` : i.image,
    }))
    const checkoutShipping = {
      name: `${shipping.firstName} ${shipping.lastName}`,
      phone: shipping.phone, city: shipping.city,
      address: deliveryType === 'address' ? shipping.address : officeLocation,
      postalCode: deliveryType === 'address' ? shipping.postalCode : '',
      country: deliveryType === 'address' ? shipping.country : locale === 'en' ? 'Bulgaria' : 'България',
      deliveryMethod: deliveryType === 'address' ? (locale === 'en' ? 'To an address' : 'До адрес') : delivery.label,
      courier: deliveryType === 'office' ? delivery.label : '',
      officeLocation: deliveryType === 'office' ? officeLocation : '',
      courierNote: shipping.note,
      fbp: getCookieValue('_fbp'), fbc: getCookieValue('_fbc'),
    }
    if (isCod) {
      const codProducts = items.map(i => ({
        name: i.name, variantLabel: localizeCartVariantLabel(locale, i.variantLabel),
        variantId: i.variantId, price: i.price, quantity: i.quantity,
        image: i.image.startsWith('/') ? `${process.env.NEXT_PUBLIC_SITE_URL}${i.image}` : i.image,
      }))
      try {
        const res = await fetch('/api/checkout/cod', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            locale, email: contact.email, items: codProducts, shipping: checkoutShipping,
            shippingLabel: deliveryType === 'address' ? (locale === 'en' ? 'To an address' : 'До адрес') : delivery.label,
            deliveryId: deliveryType === 'address' ? 'address' : delivery.id,
            promoCode: appliedCode ?? '',
          }),
        })
        const data = await res.json()
        if (!res.ok || !data.orderId) throw new Error(data.error ?? translate(locale, 'Грешка'))
        window.location.href = `/checkout/success?cod=1&order=${encodeURIComponent(data.orderId)}&value=${data.value}&sig=${encodeURIComponent(data.sig ?? '')}`
      } catch (err) {
        setError(err instanceof Error ? err.message : translate(locale, 'Грешка при поръчка'))
        setLoading(false)
      }
      return
    }
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale, items: lineItems, email: contact.email, shipping: checkoutShipping,
          summary: { shippingLabel: deliveryType === 'address' ? (locale === 'en' ? 'To an address' : 'До адрес') : delivery.label },
          promoCode: appliedCode ?? '',
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.clientSecret) throw new Error(data.error ?? translate(locale, 'Грешка'))
      setClientSecret(data.clientSecret)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : translate(locale, 'Грешка при плащане'))
      setLoading(false)
    }
  }

  return (
    <CheckoutShell
      locale={locale} formatBGN={formatBGN} items={items}
      contact={contact} setContact={setContact}
      shipping={shipping} setShipping={setShipping}
      deliveryType={deliveryType} setDeliveryType={setDeliveryType}
      deliveryId={deliveryId} setDeliveryId={setDeliveryId}
      paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
      officeLocation={officeLocation} setOfficeLocation={setOfficeLocation}
      codeInput={codeInput} setCodeInput={setCodeInput}
      appliedCode={appliedCode} codeError={codeError}
      applyCode={applyCode} removeCode={removeCode}
      loading={loading} error={error}
      clientSecret={clientSecret} setClientSecret={setClientSecret}
      handleSubmit={handleSubmit}
      fieldClass={fieldClass} fieldError={fieldError} isInvalid={isInvalid} ErrorMsg={ErrorMsg}
      markTouched={markTouched} syncPixelUser={syncPixelUser}
      isValidEmail={isValidEmail} isValidPhone={isValidPhone}
      isCod={isCod} codEligible={codEligible}
      visibleDelivery={visibleDelivery} delivery={delivery}
      subtotal={subtotal} bundleSaving={bundleSaving} promo={promo}
      shipping_={shipping_} total={total}
    />
  )
}
