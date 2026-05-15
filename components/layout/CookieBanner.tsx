'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { updateGoogleConsent } from '@/lib/googleAnalytics'

type Consent = 'all' | 'necessary' | null

export function resetCookieConsent() {
  localStorage.removeItem('alpe-cookie-consent')
  window.location.reload()
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent | 'loading'>('loading')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('alpe-cookie-consent') as Consent | null
    if (stored) updateGoogleConsent(stored === 'all')
    setConsent(stored)
  }, [])

  function accept() {
    localStorage.setItem('alpe-cookie-consent', 'all')
    updateGoogleConsent(true)
    window.dispatchEvent(new Event('alpe-cookie-consent-accepted'))
    setConsent('all')
  }

  function rejectOptional() {
    localStorage.setItem('alpe-cookie-consent', 'necessary')
    updateGoogleConsent(false)
    setConsent('necessary')
  }

  if (consent !== null) return null

  return (
    <div
      role="dialog"
      aria-label="Съгласие за бисквитки"
      aria-modal="false"
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'min(560px, calc(100vw - 32px))',
        background: '#1C0F0A',
        color: '#EDE4D6',
        borderRadius: 12,
        padding: '14px 18px',
        boxShadow: '0 6px 32px rgba(28,15,10,0.4)',
        fontFamily: 'var(--font-raleway), sans-serif',
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 12, color: 'rgba(237,228,214,0.8)', flex: '1 1 200px', lineHeight: 1.5 }}>
          Използваме бисквитки за работата на сайта, анализ и персонализация.{' '}
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ background: 'none', border: 'none', padding: 0, color: '#C4A266', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit' }}
          >
            {expanded ? 'По-малко' : 'Научи повече'}
          </button>
        </p>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={rejectOptional}
            style={{ background: 'transparent', color: 'rgba(237,228,214,0.65)', border: '1px solid rgba(237,228,214,0.2)', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 500, fontFamily: 'var(--font-raleway)', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Само необходимите
          </button>
          <button
            onClick={accept}
            style={{ background: '#C4A266', color: '#1C0F0A', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-raleway)', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            Приемам всички
          </button>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(237,228,214,0.1)', fontSize: 11, color: 'rgba(237,228,214,0.55)', lineHeight: 1.65 }}>
          <p><strong style={{ color: 'rgba(237,228,214,0.8)' }}>Задължителни:</strong> количка, сесия, сигурност — винаги активни.</p>
          <p style={{ marginTop: 4 }}><strong style={{ color: 'rgba(237,228,214,0.8)' }}>Аналитични:</strong> Google Analytics — брой посетители, поведение на сайта, конверсии.</p>
          <p style={{ marginTop: 4 }}><strong style={{ color: 'rgba(237,228,214,0.8)' }}>Маркетингови:</strong> Meta Pixel, ремаркетинг — персонализирани реклами в социалните мрежи.</p>
          <p style={{ marginTop: 6 }}>
            Изборът ви важи 365 дни. Можете да го промените по всяко време.{' '}
            <Link href="/privacy" style={{ color: '#C4A266', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              Политика за поверителност →
            </Link>
          </p>
          <p style={{ marginTop: 6, fontSize: 10, opacity: 0.6 }}>
            Съгл. Регламент (ЕС) 2016/679 (GDPR) и Директива 2002/58/ЕО.
          </p>
        </div>
      )}
    </div>
  )
}
