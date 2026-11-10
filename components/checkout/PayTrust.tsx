'use client'

export function PayTrust({ locale, compact = false }: { locale: string; compact?: boolean }) {
  const en = locale === 'en'
  const lines = compact
    ? (en ? ['14-day returns', 'Ships within 48 hours'] : ['14 дни връщане', 'Изпращаме до 48 часа'])
    : (en
      ? ['14-day returns with the same courier', 'BS EN ISO 12312-1 · ANSI Z80.3 · UV400', 'We ship within 48 hours']
      : ['14 дни връщане със същия куриер', 'BS EN ISO 12312-1 · ANSI Z80.3 · UV400', 'Изпращаме до 48 часа'])
  return (
    <p className="mt-3 text-center font-sans text-[11px] leading-relaxed text-stone">
      {lines.join(' · ')}
    </p>
  )
}
