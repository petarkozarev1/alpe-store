'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { howItWorksContent, steps } from '@/lib/data/content'

const cardTransition = (i: number): Transition => ({
  duration: 0.5,
  delay: i * 0.1,
  ease: 'easeOut',
})

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-brand-black text-white py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row gap-16 md:gap-24">

          {/* Left sticky column */}
          <div className="md:sticky md:top-24 md:self-start flex-shrink-0 md:w-80 flex flex-col gap-8">
            <Badge label={howItWorksContent.badge} light />
            <h2 className="text-[clamp(36px,5vw,52px)] font-bold tracking-tight leading-tight whitespace-pre-line">
              {howItWorksContent.headline}
            </h2>
            <Button label={howItWorksContent.cta} href="/shop" variant="outlined-white" />
          </div>

          {/* Right scrolling cards */}
          <div className="flex flex-col gap-8 flex-1">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={cardTransition(i)}
                viewport={{ once: true, amount: 0.4 }}
                className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              >
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(min-width: 1024px) 720px, (min-width: 768px) calc(100vw - 80px), 100vw"
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="inline-block bg-white text-brand-black text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Step {step.number}
                  </span>
                  <h3 className="text-white text-2xl font-bold mb-1">{step.title}</h3>
                  <p className="text-white/80 text-sm max-w-xs">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
