import { notFound } from 'next/navigation'
import PairOptionVariants from '@/components/dev/PairOptionVariants'
import { isLocale } from '@/lib/i18n/config'
import { noIndexMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export const metadata = noIndexMetadata(
  'Чернова: колко чифта',
  'Временен преглед на избора за брой чифтове. Не е част от магазина.',
)

export default function PairOptionsPreviewPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const env = process.env.VERCEL_ENV || ''
  if (env === 'production') notFound()
  return <PairOptionVariants />
}
