import HeroSection from '@/components/landing/HeroSection'
import CertStrip from '@/components/landing/CertStrip'
import IngredientsSection from '@/components/landing/IngredientsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import TestimonialSection from '@/components/landing/TestimonialSection'
import GallerySection from '@/components/landing/GallerySection'
import FaqSection from '@/components/landing/FaqSection'
import FinalCtaSection from '@/components/landing/FinalCtaSection'
import NewsletterSection from '@/components/landing/NewsletterSection'
import { createLocalizedPageMetadata, defaultSeo } from '@/lib/seo'
import { getLandingContent } from '@/lib/data/content'
import { isLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: defaultSeo.title,
    description: defaultSeo.description,
    path: '/',
  })
}

export default function Home({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const { faqs } = getLandingContent(locale)
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HeroSection locale={locale} />
      <CertStrip locale={locale} />
      <IngredientsSection locale={locale} />
      <HowItWorksSection locale={locale} />
      <ComparisonSection locale={locale} />
      <FaqSection locale={locale} />
      <GallerySection locale={locale} />
      <TestimonialSection locale={locale} />
      <FinalCtaSection locale={locale} />
      <NewsletterSection locale={locale} />
    </>
  )
}
