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
    return (
      <div role="group" aria-label={locale === 'en' ? 'Language' : 'Език'} className="flex items-center">
        {(['bg', 'en'] as const).map(code => {
          const active = code === locale
          return (
            <a
              key={code}
              href={localizedPath(here, code)}
              hrefLang={code}
              lang={code}
              aria-current={active ? 'true' : undefined}
              onClick={() => rememberLocale(code)}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center font-sans text-[11px] font-bold uppercase tracking-widest ${active ? 'text-onyx underline underline-offset-4' : 'text-[#3D2418]'}`}
            >
              {code}
            </a>
          )
        })}
      </div>
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
    ? <span aria-hidden="true" className="inline-block min-h-11 w-[88px]" />
    : <span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-linen/60">—</span>
  return <Suspense fallback={fallback}><LanguageSwitcherInner variant={variant} /></Suspense>
}
