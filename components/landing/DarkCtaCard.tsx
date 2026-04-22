'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { darkCtaContent } from '@/lib/data/content'

const AVATARS = [
  'https://via.placeholder.com/80x80/CCCCCC/000000?text=A1',
  'https://via.placeholder.com/80x80/AAAAAA/000000?text=A2',
  'https://via.placeholder.com/80x80/888888/000000?text=A3',
]

export default function DarkCtaCard() {
  return (
    <section className="w-full bg-parchment px-6 md:px-10 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative max-w-content mx-auto bg-iron rounded-2xl overflow-visible px-10 pt-24 pb-12"
      >
        {/* Product image bleeding above card */}
        <div
          aria-hidden="true"
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-64 md:w-56 md:h-72 pointer-events-none"
        >
          <Image
            src="https://via.placeholder.com/300x450/F5F5F0/000000?text=Serum+Bottle"
            alt=""
            fill
            className="object-contain"
          />
        </div>

        {/* Social proof row */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-3">
            {AVATARS.map((src, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-iron relative"
              >
                <Image src={src} alt={`Customer ${i + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-gold text-sm" aria-hidden="true">★</span>
            ))}
            <span className="text-linen/70 text-sm ml-1">{darkCtaContent.socialProof}</span>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-linen text-[clamp(32px,5vw,52px)] font-bold tracking-tight leading-tight max-w-lg mb-8 whitespace-pre-line">
          {darkCtaContent.headline}
        </h2>

        <Button label={darkCtaContent.cta} href="/shop" variant="outlined-white" />
      </motion.div>
    </section>
  )
}
