'use client'
import { motion } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import BeforeAfterSlider from '@/components/landing/BeforeAfterSlider'
import { beforeAfterContent, withoutItems, withItems } from '@/lib/data/content'

export default function ComparisonSection() {
  return (
    <section id="why-raydiant" className="w-full bg-white py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <Badge label={beforeAfterContent.badge} />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-6 text-[clamp(36px,5vw,56px)] font-bold tracking-tight leading-tight whitespace-pre-line"
          >
            {beforeAfterContent.headline}
          </motion.h2>
        </div>

        {/* Before/After slider */}
        <BeforeAfterSlider
          beforeImage={beforeAfterContent.beforeImage}
          afterImage={beforeAfterContent.afterImage}
        />

        {/* Comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Without Raydiant */}
          <div className="bg-brand-gray-light rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-brand-muted mb-6 text-center">Without Raydiant</h3>
            <ul className="flex flex-col gap-4">
              {withoutItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-brand-muted">
                  <span className="w-6 h-6 rounded-full bg-brand-muted/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="text-brand-muted text-xs font-bold">✕</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* With Raydiant */}
          <div className="bg-brand-gray-light rounded-2xl p-8">
            <h3 className="text-lg font-bold text-brand-black mb-6 text-center">With Raydiant</h3>
            <ul className="flex flex-col gap-4">
              {withItems.map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-medium text-brand-black">
                  <span className="w-6 h-6 rounded-full bg-brand-black flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <span className="text-white text-xs font-bold">✓</span>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10">
          <Button label="Buy Now" href="/shop" variant="primary" />
        </div>

      </div>
    </section>
  )
}
