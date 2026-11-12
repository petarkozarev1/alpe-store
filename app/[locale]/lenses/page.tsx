import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import LensesView from '@/components/pages/LensesView'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'За стъклата',
    description: 'AMPÉ Daily и AMPÉ Evening — жълти пластмасови стъкла за деня пред екрана и оранжеви за вечерта. До 99% при 450 nm през деня, 99,29% синя светлина в 380–500 nm и UV400 вечер.',
    path: '/lenses',
  })
}

export default function LensesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <LensesView locale={params.locale} />
}
