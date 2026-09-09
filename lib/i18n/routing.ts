import type { Locale } from './config'

function parts(value: string) {
  const match = value.match(/^([^?#]*)([?#].*)?$/)
  return { pathname: match?.[1] || '/', suffix: match?.[2] || '' }
}

export function localeFromPath(value: string): Locale {
  const { pathname } = parts(value)
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'bg'
}

export function localizedPath(value: string, locale: Locale) {
  const { pathname, suffix } = parts(value)
  const base = pathname === '/en' ? '/' : pathname.startsWith('/en/') ? pathname.slice(3) || '/' : pathname
  const localized = locale === 'en' ? (base === '/' ? '/en' : `/en${base}`) : base
  return `${localized}${suffix}`
}

export function oppositeLocalePath(value: string) {
  return localizedPath(value, localeFromPath(value) === 'bg' ? 'en' : 'bg')
}
