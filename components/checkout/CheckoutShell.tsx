'use client'
import { localizeContent } from '@/components/i18n/LocalizedContent'
import { COD_FEE, courierBadge, isBulgaria } from '@/lib/checkout-delivery'
import { CheckoutSummary } from './CheckoutSummary'

export function CheckoutShell(p: any) {
  const {
    locale, contact, setContact, shipping, setShipping,
    deliveryType, setDeliveryType, deliveryId, setDeliveryId, paymentMethod, setPaymentMethod,
    officeLocation, setOfficeLocation, handleSubmit,
    fieldClass, fieldError, isInvalid, ErrorMsg, markTouched, syncPixelUser, isValidEmail, isValidPhone,
    isCod, codEligible, visibleDelivery,
  } = p
  const domestic = isBulgaria(shipping.country)
  return localizeContent(locale, (
    <div className="min-h-screen bg-parchment">
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
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} noValidate className="clarity-mask">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="font-serif text-5xl font-bold text-onyx">Плащане.</h1>
              <p className="font-sans text-sm text-stone mt-2">Попълни данните си — изпращаме до 24 часа.</p>
            </div>
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="flex items-center justify-between mb-5">
                <span className="font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">01.</span>Начин на плащане</span>
              </div>
              <div className="flex flex-col gap-3">
                <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-onyx bg-onyx/5' : 'border-stone/20 hover:border-stone/40'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="accent-onyx" />
                  <div className="flex-1">
                    <span className="font-sans text-sm font-semibold text-onyx">Карта</span>
                    <p className="font-sans text-xs text-stone mt-0.5">Visa · Mastercard · Apple Pay · Google Pay · Revolut</p>
                  </div>
                </label>
                {codEligible && (
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-onyx bg-onyx/5' : 'border-stone/20 hover:border-stone/40'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="accent-onyx" />
                    <div className="flex-1">
                      <span className="font-sans text-sm font-semibold text-onyx">Наложен платеж</span>
                      <p className="font-sans text-xs text-stone mt-0.5">Плащаш в брой на куриера при доставка · +€{COD_FEE.toFixed(2)}</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="mb-5 font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">02.</span>Контакт</div>
              <input type="email" required placeholder="имейл@example.com" value={contact.email} onChange={e => setContact((prev: any) => ({ ...prev, email: e.target.value }))} onBlur={() => { markTouched('email'); syncPixelUser() }} className={fieldClass(contact.email, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2', !!fieldError('email', contact.email, isValidEmail))} />
              <ErrorMsg show={!!fieldError('email', contact.email, isValidEmail)} message={fieldError('email', contact.email, isValidEmail)} />
            </div>
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="mb-5 font-sans text-xs font-semibold text-stone uppercase tracking-widest"><span className="text-stone/40 mr-2">03.</span>Доставка</div>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Име</label>
                    <input required placeholder="Иван" value={shipping.firstName} onChange={e => setShipping((prev: any) => ({ ...prev, firstName: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.firstName, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    <ErrorMsg show={isInvalid(shipping.firstName)} />
                  </div>
                  <div>
                    <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Фамилия</label>
                    <input required placeholder="Иванов" value={shipping.lastName} onChange={e => setShipping((prev: any) => ({ ...prev, lastName: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.lastName, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    <ErrorMsg show={isInvalid(shipping.lastName)} />
                  </div>
                </div>
                <div>
                  <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">Телефон</label>
                  <input required type="tel" placeholder="+359 88 123 4567" value={shipping.phone} onChange={e => setShipping((prev: any) => ({ ...prev, phone: e.target.value }))} onBlur={() => { markTouched('phone'); syncPixelUser() }} className={fieldClass(shipping.phone, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2', !!fieldError('phone', shipping.phone, isValidPhone))} />
                  <ErrorMsg show={!!fieldError('phone', shipping.phone, isValidPhone)} message={fieldError('phone', shipping.phone, isValidPhone)} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['address', 'office'] as const).map(type => (
                    <button key={type} type="button" disabled={type === 'office' && !domestic} onClick={() => { setDeliveryType(type); setOfficeLocation(''); if (type === 'office') setShipping((prev: any) => ({ ...prev, country: locale === 'en' ? 'Bulgaria' : 'България' })) }} className={`py-3 px-4 rounded-xl border text-sm font-sans font-semibold ${deliveryType === type ? 'border-onyx bg-onyx text-linen' : 'border-stone/25 text-stone'} ${type === 'office' && !domestic ? 'opacity-40 cursor-not-allowed' : ''}`}>
                      {type === 'address' ? 'До адрес' : 'До офис / локер'}
                    </button>
                  ))}
                </div>
                {deliveryType === 'address' && (
                  <>
                    <input required placeholder="ул. Витоша 1, ет. 3" value={shipping.address} onChange={e => setShipping((prev: any) => ({ ...prev, address: e.target.value }))} className={fieldClass(shipping.address, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required placeholder="1000" value={shipping.postalCode} onChange={e => setShipping((prev: any) => ({ ...prev, postalCode: e.target.value }))} className={fieldClass(shipping.postalCode, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                      <input required placeholder="София" value={shipping.city} onChange={e => setShipping((prev: any) => ({ ...prev, city: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.city, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    </div>
                    <div>
                      <label className="block font-sans text-[10px] uppercase tracking-widest text-stone mb-1.5">{locale === 'en' ? 'Country' : 'Държава'}</label>
                      <input required placeholder={locale === 'en' ? 'Bulgaria' : 'България'} value={shipping.country} onChange={e => setShipping((prev: any) => ({ ...prev, country: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.country, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                      <p className="font-sans text-[11px] text-stone/45 leading-relaxed mt-1.5">{locale === 'en' ? 'For delivery outside Bulgaria, an additional €4.99 applies, for logistics.' : 'За доставка извън България се добавя €4.99, заради логистиката.'}</p>
                    </div>
                    <input placeholder="бележка към куриера" value={shipping.note} onChange={e => setShipping((prev: any) => ({ ...prev, note: e.target.value }))} className="w-full border border-stone/25 rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx" />
                  </>
                )}
                {deliveryType === 'office' && (
                  <div className="flex flex-col gap-3">
                    <input required placeholder="София" value={shipping.city} onChange={e => setShipping((prev: any) => ({ ...prev, city: e.target.value }))} onBlur={syncPixelUser} className={fieldClass(shipping.city, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                    {visibleDelivery.map((d: any) => (
                      <div key={d.id}>
                        <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer ${deliveryId === d.id ? 'border-onyx bg-onyx/5' : 'border-stone/20'}`}>
                          <input type="radio" name="delivery" value={d.id} checked={deliveryId === d.id} onChange={() => { setDeliveryId(d.id); setOfficeLocation('') }} className="accent-onyx" />
                          <span className="font-sans text-sm font-semibold text-onyx">{d.label}</span>
                          {courierBadge(isCod, d) && <span className="font-sans text-[9px] font-bold uppercase tracking-widest bg-gold/20 text-iron px-2 py-0.5 rounded-full">{courierBadge(isCod, d)}</span>}
                        </label>
                        {deliveryId === d.id && (
                          <div className="mt-2 ml-4 pl-4 border-l-2 border-onyx/20">
                            <input required placeholder={d.officePlaceholder} value={officeLocation} onChange={e => setOfficeLocation(e.target.value)} className={fieldClass(officeLocation, 'w-full border rounded-xl px-4 py-3 text-sm bg-parchment/50 focus:outline-none focus:ring-2')} />
                            <ErrorMsg show={isInvalid(officeLocation)} />
                            <p className="font-sans text-[10px] text-stone/50 mt-1.5">
                              <a href={d.officeLink} target="_blank" rel="noopener noreferrer" className="underline">сайта на куриера</a>
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
          <CheckoutSummary {...p} />
        </div>
      </form>
    </div>
  ))
}
