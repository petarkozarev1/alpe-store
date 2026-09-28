'use client'
import { useState } from 'react'
import { PaymentElement, useCheckoutElements } from '@stripe/react-stripe-js/checkout'
import { useTranslations } from '@/components/i18n/LocaleProvider'

export function StripePayForm({ total, formatBGN }: { total: number; formatBGN: (eur: number) => string }) {
  const t = useTranslations()
  const result = useCheckoutElements()
  const [paying, setPaying] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  if (result.type === 'loading') {
    return <p className="font-sans text-sm text-stone text-center py-8">{t('Зареждане на сигурната форма…')}</p>
  }
  if (result.type === 'error') {
    return <p className="font-sans text-sm text-red-600 text-center py-8">{result.error.message}</p>
  }
  const checkout = result.checkout

  const pay = async () => {
    setPaying(true); setMsg(null)
    try {
      const res = await checkout.confirm()
      if (res.type === 'error') { setMsg(res.error.message); setPaying(false) }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : t('Грешка при плащане'))
      setPaying(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <PaymentElement />
      {msg && <p className="font-sans text-sm text-red-600">{msg}</p>}
      <button
        type="button"
        onClick={pay}
        disabled={paying}
        className="w-full bg-onyx text-linen py-4 rounded-xl font-sans font-bold text-sm tracking-wider uppercase hover:bg-iron transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {paying ? 'ОБРАБОТКА…' : <>ПЛАТИ €{total.toFixed(2)} <span className="text-lg">→</span></>}
      </button>
      <p className="font-sans text-[11px] text-stone/55 text-center flex items-center justify-center gap-1.5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3 h-3 text-green-600"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
        Сигурно плащане със Stripe · {formatBGN(total)}
      </p>
    </div>
  )
}
