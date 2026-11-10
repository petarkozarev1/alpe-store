'use client'

export function PayTrust({ locale }: { locale: string }) {
  const en = locale === 'en'
  const lines = en
    ? ['14-day returns with the same courier', 'BS EN ISO 12312-1 · ANSI Z80.3 · UV400', 'We ship within 48 hours']
    : ['14 дни връщане със същия куриер', 'BS EN ISO 12312-1 · ANSI Z80.3 · UV400', 'Изпращаме до 48 часа']
  return (
    <ul className="mt-3 flex flex-col gap-1">
      {lines.map(line => (
        <li key={line} className="font-sans text-[11px] text-stone text-center">{line}</li>
      ))}
    </ul>
  )
}
