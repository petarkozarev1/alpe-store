'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { finalCtaContent } from '@/lib/data/content'

export default function FinalCtaSection() {
  return (
    <section className="w-full bg-brand-charcoal text-white py-24 relative overflow-hidden">
      <div className="max-w-content mx-auto px-6 md:px-10 flex flex-col items-center text-center relative z-10">
        <Badge label={finalCtaContent.badge} light />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-6 text-[clamp(36px,5vw,60px)] font-bold tracking-tight leading-tight whitespace-pre-line"
        >
          {finalCtaContent.headline}
        </motion.h2>
        <div className="mt-8">
          <Button label={finalCtaContent.cta} href="/shop" variant="outlined-white" />
        </div>

        {/* Woman image */}
        <div className="relative mt-12 w-72 h-96 md:w-96 md:h-[480px]">
          <Image
            src={finalCtaContent.image}
            alt="Radiant skin"
            fill
            sizes="(min-width: 768px) 384px, 288px"
            className="object-cover object-top rounded-2xl"
          />
        </div>
      </div>
    </section>
  )
}
