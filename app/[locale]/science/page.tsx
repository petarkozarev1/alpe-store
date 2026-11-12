import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import ScienceView from '@/components/pages/ScienceView'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'Как работи',
    description: 'Как синята светлина от екраните влияе вечер и как AMPÉ Daily и AMPÉ Evening филтрират тази светлина.',
    path: '/science',
  })
}

export default function SciencePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <ScienceView locale={params.locale} />
}
