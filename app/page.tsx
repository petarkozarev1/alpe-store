import HeroSection from '@/components/landing/HeroSection'
import BenefitsScroll from '@/components/landing/BenefitsScroll'
import DarkCtaCard from '@/components/landing/DarkCtaCard'
import IngredientsSection from '@/components/landing/IngredientsSection'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import TestimonialSection from '@/components/landing/TestimonialSection'
import GallerySection from '@/components/landing/GallerySection'
import FaqSection from '@/components/landing/FaqSection'
import FinalCtaSection from '@/components/landing/FinalCtaSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <BenefitsScroll />
      <DarkCtaCard />
      <IngredientsSection />
      <HowItWorksSection />
      <ComparisonSection />
      <TestimonialSection />
      <GallerySection />
      <FaqSection />
      <FinalCtaSection />
    </>
  )
}
