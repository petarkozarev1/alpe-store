'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLocale } from './LocaleProvider'
import { localizedPath } from '@/lib/i18n/routing'
import { Suspense } from 'react'
import { localeCookieName } from '@/lib/i18n/config'

function rememberLocale(locale: 'bg' | 'en') {
  document.cookie = `${localeCookieName}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
}

function LanguageSwitcherInner({ variant }: { variant: 'link' | 'toggle' }) {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  const here = `${pathname}${query ? `?${query}` : ''}`

  if (variant === 'toggle') {
    const target = locale === 'bg' ? 'en' : 'bg'
    const label = locale === 'bg'
      ? 'Език: български. Превключи на английски'
      : 'Language: English. Switch to Bulgarian'
    return (
      <a
        href={localizedPath(here, target)}
        hrefLang={target}
        lang={locale}
        role="switch"
        aria-checked={locale === 'en'}
        aria-label={label}
        onClick={() => rememberLocale(target)}
        className="inline-flex h-11 w-11 items-center justify-center bg-transparent font-sans text-[11px] font-bold uppercase tracking-widest text-linen hover:text-parchment"
      >
        {locale}
      </a>
    )
  }

  const target = locale === 'bg' ? 'en' : 'bg'
  return (
    <a
      onClick={() => rememberLocale(target)}
      href={localizedPath(here, target)}
      hrefLang={target}
      lang={target}
      aria-label={target === 'en' ? 'Switch to English' : 'Switch to Bulgarian'}
      className="font-sans text-[11px] font-semibold uppercase tracking-widest text-linen hover:text-parchment"
    >
      {target.toUpperCase()}
    </a>
  )
}

export default function LanguageSwitcher({ variant = 'link' }: { variant?: 'link' | 'toggle' }) {
  const fallback = variant === 'toggle'
    ? <span aria-hidden="true" className="inline-block h-11 w-11" />
    : <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-linen/60">—</span>
  return <Suspense fallback={fallback}><LanguageSwitcherInner variant={variant} /></Suspense>
}
