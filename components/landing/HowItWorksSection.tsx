'use client'
import Image from 'next/image'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getLandingContent, steps as sourceSteps } from '@/lib/data/content'
import type { Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'

type Step = typeof sourceSteps[0]

const imagePosition: Record<number, string> = {
  1: 'object-cover object-[center_26%]',
  2: 'object-cover object-[64%_22%]',
  3: 'object-cover object-[52%_40%]',
}

function StepCard({ step, locale }: { step: Step; locale: Locale }) {
  return (
    <article className="relative aspect-[4/5] w-full max-h-[70vh] overflow-hidden rounded-2xl md:aspect-auto md:h-[580px] md:w-[500px] md:max-h-none">
      <Image
        src={step.image}
        alt={step.title}
        fill
        sizes="(min-width: 768px) 500px, 100vw"
        className={imagePosition[step.number] ?? 'object-cover'}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#2D0E04]/80 via-[#2D0E04]/15 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5 md:p-6">
        <span className="mb-3 inline-block rounded-full bg-linen px-3 py-1 text-xs font-semibold text-onyx">
          {locale === 'en' ? 'Step' : 'Стъпка'} {step.number}
        </span>
        <h3 className="mb-1 text-2xl font-bold text-linen">{step.title}</h3>
        <p className="max-w-xs text-sm text-linen/80">{step.description}</p>
      </div>
    </article>
  )
}

export default function HowItWorksSection({ locale }: { locale: Locale }) {
  const { howItWorksContent, steps } = getLandingContent(locale)

  return (
    <section id="how-it-works" className="w-full bg-parchment text-iron">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-6 py-16 md:flex-row md:items-start md:justify-between md:gap-16 md:px-10 md:py-24">
        <div className="flex flex-shrink-0 flex-col gap-8 md:sticky md:top-24 md:w-80 md:self-start">
          <Badge label={howItWorksContent.badge} />
          <h2 className="whitespace-pre-line text-[clamp(36px,5vw,52px)] font-bold leading-tight tracking-tight text-iron">
            {howItWorksContent.headline}
          </h2>
          <Button
            label={howItWorksContent.cta}
            href={localizedPath('/shop', locale)}
            variant="primary"
            className="self-start font-bold"
            onClick={() => {
              fireTrackedEvent('CTAClick', { custom: true, data: { cta_location: 'how_it_works' }, ctaLocation: 'how_it_works' })
            }}
          />
        </div>

        <div className="flex flex-col gap-6 md:w-[500px] md:shrink-0 md:gap-8">
          {steps.map((step) => (
            <StepCard key={step.number} step={step} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  )
}
