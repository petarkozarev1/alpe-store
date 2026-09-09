'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useLocale } from './LocaleProvider'
import { localizedPath } from '@/lib/i18n/routing'
import { Suspense } from 'react'
import { localeCookieName } from '@/lib/i18n/config'

function LanguageSwitcherInner() {
  const locale = useLocale()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams.toString()
  const target = locale === 'bg' ? 'en' : 'bg'
  const href = localizedPath(`${pathname}${query ? `?${query}` : ''}`, target)
  return <a onClick={() => { document.cookie = `${localeCookieName}=${target}; Path=/; Max-Age=31536000; SameSite=Lax` }} href={href} hrefLang={target} lang={target} aria-label={target === 'en' ? 'Switch to English' : 'Switch to Bulgarian'} className="font-sans text-[11px] font-semibold uppercase tracking-widest text-linen hover:text-parchment">{target.toUpperCase()}</a>
}

export default function LanguageSwitcher() {
  return <Suspense fallback={<span className="font-sans text-[11px] font-semibold uppercase tracking-widest text-linen/60">—</span>}><LanguageSwitcherInner /></Suspense>
}
