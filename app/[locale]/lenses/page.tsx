import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import LensesView from '@/components/pages/LensesView'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'Стъкла',
    description: 'Дневни и вечерни лещи. Жълти за деня, оранжеви за вечерта. Числата от лабораторията са на страницата.',
    path: '/lenses',
  })
}

export default function LensesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return <LensesView locale={params.locale} />
}
