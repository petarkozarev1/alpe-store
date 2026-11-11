import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import ScienceView from '@/components/pages/ScienceView'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'Науката',
    description: 'Как синята светлина влияе на очите и съня. Научните факти зад AMPÉ.',
    path: '/science',
  })
}

export default function SciencePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <ScienceView locale={params.locale} />
}
