export const locales = ['bg', 'en'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'bg'
export const localeCookieName = 'alpe-locale'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale)
}
