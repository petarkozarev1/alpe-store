'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { faqs, faqSectionContent } from '@/lib/data/content'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faqs" className="w-full bg-white py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row gap-16">

          {/* Left sticky */}
          <div className="md:sticky md:top-24 md:self-start md:w-72 flex-shrink-0 flex flex-col gap-6">
            <Badge label={faqSectionContent.badge} />
            <h2 className="text-[clamp(28px,4vw,40px)] font-bold tracking-tight leading-tight whitespace-pre-line">
              {faqSectionContent.headline}
            </h2>
            <Button label={faqSectionContent.cta} href="/shop" variant="primary" />
          </div>

          {/* Right accordion */}
          <div className="flex-1 flex flex-col">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between py-5 text-left gap-4"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <span className="font-medium text-base">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 text-brand-muted"
                    aria-hidden="true"
                  >
                    ∨
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-brand-muted text-sm leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {i < faqs.length - 1 && <hr className="border-brand-border" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
