'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { updateGoogleConsent } from '@/lib/googleAnalytics'
import { useLocale, useTranslations } from '@/components/i18n/LocaleProvider'
import { localizedPath } from '@/lib/i18n/routing'

type Consent = 'all' | 'necessary' | null

export function resetCookieConsent() {
  localStorage.removeItem('alpe-cookie-consent')
  window.location.reload()
}

export default function CookieBanner() {
  const locale = useLocale()
  const t = useTranslations()
  const [consent, setConsent] = useState<Consent | 'loading'>('loading')
  const [expanded, setExpanded] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem('alpe-cookie-consent') as Consent | null
    if (stored) updateGoogleConsent(stored === 'all')
    setConsent(stored)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const el = bannerRef.current
    if (consent !== null || !el) {
      root.style.removeProperty('--cookie-banner-offset')
      return
    }
    const apply = () => root.style.setProperty('--cookie-banner-offset', `${el.offsetHeight}px`)
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(el)
    return () => {
      observer.disconnect()
      root.style.removeProperty('--cookie-banner-offset')
    }
  }, [consent, expanded])

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
      ref={bannerRef}
      role="dialog"
      aria-label={t('Съгласие за бисквитки')}
      aria-modal="false"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#1C0F0A',
        color: '#EDE4D6',
        borderRadius: '16px 16px 0 0',
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        boxShadow: '0 -8px 32px rgba(28,15,10,0.28)',
        fontFamily: 'var(--font-raleway), sans-serif',
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 12, color: 'rgba(237,228,214,0.8)', flex: '1 1 200px', lineHeight: 1.5 }}>
          {t('Използваме бисквитки за работата на сайта, анализ и персонализация.')}{' '}
          <button
            onClick={() => setExpanded(v => !v)}
            style={{ background: 'none', border: 'none', padding: 0, color: '#C4A266', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit' }}
          >
            {expanded ? t('По-малко') : t('Научи повече')}
          </button>
        </p>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={rejectOptional}
            style={{ background: 'transparent', color: 'rgba(237,228,214,0.65)', border: '1px solid rgba(237,228,214,0.2)', borderRadius: 6, minHeight: 44, padding: '10px 14px', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-raleway)', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {t('Само необходимите')}
          </button>
          <button
            onClick={accept}
            style={{ background: '#C4A266', color: '#1C0F0A', border: 'none', borderRadius: 6, minHeight: 44, padding: '10px 14px', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-raleway)', cursor: 'pointer', whiteSpace: 'nowrap' }}
          >
            {t('Приемам всички')}
          </button>
        </div>
      </div>

      {/* Expandable details */}
      {expanded && (
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(237,228,214,0.1)', fontSize: 11, color: 'rgba(237,228,214,0.55)', lineHeight: 1.65 }}>
          <p><strong style={{ color: 'rgba(237,228,214,0.8)' }}>{t('Задължителни:')}</strong> {t('количка, сесия, сигурност — винаги активни.')}</p>
          <p style={{ marginTop: 4 }}><strong style={{ color: 'rgba(237,228,214,0.8)' }}>{t('Аналитични:')}</strong> {t('Google Analytics — брой посетители, поведение на сайта, конверсии.')}</p>
          <p style={{ marginTop: 4 }}><strong style={{ color: 'rgba(237,228,214,0.8)' }}>{t('Маркетингови:')}</strong> {t('Meta Pixel, ремаркетинг — персонализирани реклами в социалните мрежи.')}</p>
          <p style={{ marginTop: 6 }}>
            {t('Изборът ви важи 365 дни. Можете да го промените по всяко време.')}{' '}
            <Link href={localizedPath('/privacy', locale)} style={{ color: '#C4A266', textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {t('Политика за поверителност →')}
            </Link>
          </p>
          <p style={{ marginTop: 6, fontSize: 10, opacity: 0.6 }}>
            {t('Съгл. Регламент (ЕС) 2016/679 (GDPR) и Директива 2002/58/ЕО.')}
          </p>
        </div>
      )}
    </div>
  )
}
