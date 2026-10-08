'use client'
import Link from 'next/link'
import Image from 'next/image'
import { CheckoutElementsProvider } from '@stripe/react-stripe-js/checkout'
import { localizeCartVariantLabel } from '@/lib/i18n/cart'
import { localizedPath } from '@/lib/i18n/routing'
import { getStripeClient } from '@/lib/stripe-client'
import { COD_FEE } from '@/lib/checkout-delivery'
import { StripePayForm } from './StripePayForm'

export function CheckoutSummary(p: any) {
  const {
    locale, formatBGN, items, codeInput, setCodeInput, appliedCode, codeError,
    applyCode, removeCode, loading, error, clientSecret, setClientSecret,
    isCod, deliveryType, delivery, subtotal, bundleSaving, promo, shipping_, intlFee, total,
  } = p
  const en = locale === 'en'
  const deliveryLabel = deliveryType === 'address' ? (en ? 'To an address' : 'До адрес') : delivery.label
  return (
          <div className="lg:sticky lg:top-6 self-start flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-stone/15 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif text-lg font-bold text-onyx">{en ? 'Your order' : 'Твоята поръчка'}</h2>
              </div>
              <div className="flex flex-col gap-4 mb-5">
                {items.map((item: any) => (
                  <div key={`${item.productId}-${item.variantId}`} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-linen flex-shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-onyx text-linen text-[10px] font-bold flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-sm font-medium text-onyx truncate">{item.name}</p>
                      <p className="font-sans text-xs text-stone">{localizeCartVariantLabel(locale, item.variantLabel)}</p>
                    </div>
                    <span className="font-serif text-sm font-semibold text-onyx flex-shrink-0">€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-stone/15 mb-4" />
              {appliedCode ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
                  <span className="font-sans text-xs font-semibold text-green-700">{appliedCode}{' · '}{promo.percent}{en ? '% off applied' : '% отстъпка приложена'}</span>
                  <button type="button" onClick={removeCode} className="font-sans text-xs text-stone hover:text-onyx transition-colors">{en ? 'Remove' : 'Премахни'}</button>
                </div>
              ) : (
                <div className="flex gap-2 mb-4">
                  <input
                    placeholder={en ? 'Promo code' : 'Промо код'}
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyCode())}
                    className="flex-1 min-w-0 border border-stone/25 rounded-xl px-4 py-2.5 text-sm bg-parchment/50 focus:outline-none focus:ring-2 focus:ring-onyx"
                  />
                  <button type="button" onClick={applyCode} className="flex-shrink-0 whitespace-nowrap font-sans text-sm font-semibold text-onyx border border-onyx/30 rounded-xl px-4 py-2.5 hover:bg-onyx hover:text-linen transition-colors">{en ? 'APPLY' : 'ПРИЛАГАНЕ'}</button>
                </div>
              )}
              {codeError && <p className="font-sans text-xs text-red-600 mb-3">{codeError}</p>}
              <hr className="border-stone/15 mb-4" />
              <div className="flex flex-col gap-2.5 font-sans text-sm">
                <div className="flex justify-between text-stone">
                  <span>{en ? 'Subtotal' : 'Междинна сума'}</span>
                  <span className="text-right">€{subtotal.toFixed(2)} <span className="block text-[11px] text-stone/50">{formatBGN(subtotal)}</span></span>
                </div>
                {bundleSaving > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>{en ? 'Pair discount' : 'Отстъпка за комплект'}</span>
                    <span className="text-right">−€{bundleSaving.toFixed(2)}</span>
                  </div>
                )}
                {promo.amount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>{en ? 'Promo code' : 'Промо код'} ({promo.code})</span>
                    <span className="text-right">−€{promo.amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone">
                  <span>{en ? 'Delivery' : 'Доставка'} · <em className="not-italic text-stone/60">{deliveryLabel}</em></span>
                  <span className={`text-right ${shipping_ === 0 ? 'text-green-600 italic' : ''}`}>{shipping_ === 0 ? (en ? 'Free' : 'Безплатна') : <>€{shipping_.toFixed(2)}</>}</span>
                </div>
                {intlFee > 0 && (
                  <div className="flex justify-between text-stone">
                    <span>{en ? 'International delivery' : 'Международна доставка'}</span>
                    <span>€{Number(intlFee).toFixed(2)}</span>
                  </div>
                )}
                {isCod && (
                  <div className="flex justify-between text-stone">
                    <span>{en ? 'Cash on delivery' : 'Наложен платеж'}</span>
                    <span>€{COD_FEE.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <hr className="border-stone/15 my-4" />
              <div className="flex justify-between items-baseline mb-4">
                <span className="font-sans text-base font-semibold text-onyx">{en ? 'Total' : 'Общо'}</span>
                <span className="font-serif text-3xl font-bold text-onyx">€{total.toFixed(2)}</span>
              </div>
              {error && <p className="text-red-700 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-4">{error}</p>}
              {clientSecret ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-semibold text-onyx uppercase tracking-widest">{en ? 'Payment details' : 'Данни за плащане'}</span>
                    <button type="button" onClick={() => setClientSecret(null)} className="font-sans text-xs text-stone hover:text-onyx transition-colors">{en ? '← Back' : '← Назад'}</button>
                  </div>
                  <CheckoutElementsProvider stripe={getStripeClient()} options={{ clientSecret, elementsOptions: { appearance: { theme: 'flat', variables: { colorPrimary: '#2D0E04', borderRadius: '12px', fontFamily: 'Raleway, sans-serif' } } } }}>
                    <StripePayForm total={total} formatBGN={formatBGN} />
                  </CheckoutElementsProvider>
                </div>
              ) : (
                <>
                  <button type="submit" disabled={loading || !items.length} className="w-full bg-onyx text-linen py-4 rounded-xl font-sans font-bold text-sm tracking-wider uppercase hover:bg-iron transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    {loading ? (en ? 'PREPARING PAYMENT...' : 'ПОДГОТВЯМЕ ПЛАЩАНЕТО...') : (isCod ? (en ? 'ORDER WITH CASH ON DELIVERY' : 'ПОРЪЧАЙ С НАЛОЖЕН ПЛАТЕЖ') : (en ? 'CONTINUE TO PAYMENT' : 'ПРОДЪЛЖИ КЪМ ПЛАЩАНЕ'))}
                  </button>
                  <p className="font-sans text-[11px] text-stone/50 text-center mt-3">
                    {en ? 'By confirming, you accept the ' : 'Като потвърдиш, приемаш '}
                    <Link href={localizedPath('/terms', locale)} className="underline hover:text-stone">{en ? 'Terms of use' : 'Условията за ползване'}</Link>
                    {en ? ' and ' : ' и '}
                    <Link href={localizedPath('/privacy', locale)} className="underline hover:text-stone">{en ? 'Privacy policy' : 'Политиката за поверителност'}</Link>.
                  </p>
                </>
              )}
            </div>
          </div>
  )
}
