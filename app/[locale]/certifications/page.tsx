import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import CertificationsView from '@/components/pages/CertificationsView'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'Сертификати',
    description: 'Официални лабораторни тестове на лещите AMPÉ. BS EN ISO 12312-1, ANSI Z80.3, AS/NZS 1067.1 — всички преминати.',
    path: '/certifications',
  })
}

export default function CertificationsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <CertificationsView locale={params.locale} />
}
