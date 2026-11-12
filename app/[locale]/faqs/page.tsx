import { notFound } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { createLocalizedPageMetadata } from '@/lib/seo'
import FaqsView from '@/components/pages/FaqsView'
import { infoFaqs } from '@/lib/data/info-faqs'
import { localizeValue } from '@/lib/i18n/translations'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'Въпроси',
    description: 'Кратки отговори за пластмасовите стъкла, теста, носенето и поръчката.',
    path: '/faqs',
  })
}

export default function FaqsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const localizedFaqs = localizeValue(params.locale, infoFaqs)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: localizedFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <FaqsView locale={params.locale} />
    </>
  )
}
