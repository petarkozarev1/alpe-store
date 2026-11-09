import { formerlyLine } from '@/lib/brand'

export default function FormerlyLine({
  locale,
  className = '',
}: {
  locale: 'bg' | 'en'
  className?: string
}) {
  const text = formerlyLine(locale)
  if (!text) return null
  return <p className={className}>{text}</p>
}
