import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import CertificationsView from '@/components/pages/CertificationsView'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'Сертификати',
    description: 'Независим тест на лещите AMPÉ в AHD TMS. 100% UV, измерено блокиране и три стандарта.',
    path: '/certifications',
  })
}

export default function CertificationsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <CertificationsView locale={params.locale} />
}
