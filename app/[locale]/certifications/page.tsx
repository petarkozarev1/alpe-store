import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import CertificationsView from '@/components/pages/CertificationsView'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'Доказано',
    description: 'Какво е измерено в пластмасовите стъкла AMPÉ: 99,29% синя светлина в 380–500 nm и UV400 при Evening, до 99% при 450 nm при Daily.',
    path: '/certifications',
  })
}

export default function CertificationsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <CertificationsView locale={params.locale} />
}
