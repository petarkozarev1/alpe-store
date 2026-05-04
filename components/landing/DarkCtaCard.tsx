'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { darkCtaContent } from '@/lib/data/content'

export default function DarkCtaCard() {
  return (
    <section className="w-full bg-parchment px-6 md:px-10 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative max-w-content mx-auto bg-iron rounded-2xl overflow-visible px-10 pt-24 pb-8 flex flex-col items-center text-center"
      >
        {/* Product image overlapping top of card */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-xl h-72 md:h-80 pointer-events-none">
          <Image
            src="/images/glasses-duo3.png"
            alt="ALPÉ blue light blocking glasses"
            fill
            sizes="(max-width: 768px) 100vw, 576px"
            className="object-contain"
          />
        </div>

        {/* Headline */}
        <h2 className="text-linen text-[clamp(28px,5vw,52px)] font-bold tracking-tight leading-tight max-w-2xl mb-3">
          {darkCtaContent.headline}
        </h2>

        {/* Social proof row */}
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-gold text-sm" aria-hidden="true">★</span>
          ))}
          <span className="text-linen/70 text-sm ml-1">{darkCtaContent.socialProof}</span>
        </div>
      </motion.div>
    </section>
  )
}
