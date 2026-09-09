'use client'
import { createContext, useContext } from 'react'
import type { Locale } from '@/lib/i18n/config'
import { translate } from '@/lib/i18n/translations'

const LocaleContext = createContext<Locale>('bg')

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useTranslations() {
  const locale = useLocale()
  return (source: string) => translate(locale, source)
}
