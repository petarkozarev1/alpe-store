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
import { defaultSeo } from '@/lib/seo'
import { faqs } from '@/lib/data/content'

export const metadata = {
  title: defaultSeo.title,
  description: defaultSeo.description,
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
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
      <HeroSection />
      <CertStrip />
      <IngredientsSection />
      <HowItWorksSection />
      <ComparisonSection />
      <FaqSection />
      <GallerySection />
      <TestimonialSection />
      <FinalCtaSection />
      <NewsletterSection />
    </>
  )
}
