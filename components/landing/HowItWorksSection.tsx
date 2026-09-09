'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getLandingContent, steps as sourceSteps } from '@/lib/data/content'
import type { Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'

type Step = typeof sourceSteps[0]

function StepCard({ step, index, progress, locale, total }: { step: Step; index: number; locale: Locale; total: number; progress: ReturnType<typeof import('framer-motion').useScroll>['scrollYProgress'] }) {
  const scaleStart = (index + 0.4) / total
  const scaleEnd = (index + 1) / total
  const scale = useTransform(progress, [scaleStart, scaleEnd], [1, 0.93])

  return (
    <div className="h-screen sticky" style={{ top: `${64 + index * 16}px` }}>
      <motion.div
        style={{ scale, transformOrigin: 'top center' }}
        className="relative h-[85vh] rounded-2xl overflow-hidden"
      >
        <Image
          src={step.image}
          alt={step.title}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#2D0E04]/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <span className="inline-block bg-linen text-onyx text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {locale === 'en' ? 'Step' : 'Стъпка'} {step.number}
          </span>
          <h3 className="text-linen text-2xl font-bold mb-1">{step.title}</h3>
          <p className="text-linen/80 text-sm max-w-xs">{step.description}</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function HowItWorksSection({ locale }: { locale: Locale }) {
  const { howItWorksContent, steps } = getLandingContent(locale)
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="w-full bg-parchment text-iron"
    >
      <div className="max-w-content mx-auto px-6 md:px-10 flex flex-col md:flex-row gap-16 md:gap-24">
        {/* Left sticky column */}
        <div className="md:sticky md:top-24 md:self-start flex-shrink-0 md:w-80 flex flex-col gap-8 pt-24 pb-8">
          <Badge label={howItWorksContent.badge} />
          <h2 className="text-[clamp(36px,5vw,52px)] font-bold tracking-tight leading-tight whitespace-pre-line text-iron">
            {howItWorksContent.headline}
          </h2>
          <Button
            label={howItWorksContent.cta}
            href={localizedPath('/shop', locale)}
            variant="primary"
            className="font-bold self-start"
            onClick={() => {
              fireTrackedEvent('CTAClick', { custom: true, data: { cta_location: 'how_it_works' }, ctaLocation: 'how_it_works' })
            }}
          />
        </div>

        {/* Right stacking cards */}
        <div className="flex-1 pt-24 pb-24">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} progress={scrollYProgress} locale={locale} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  )
}
