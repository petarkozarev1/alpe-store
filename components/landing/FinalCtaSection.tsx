'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { finalCtaContent } from '@/lib/data/content'

export default function FinalCtaSection() {
  return (
    <section className="w-full bg-iron text-linen py-24 relative overflow-hidden">
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

        <div className="relative mt-12 w-full max-w-4xl aspect-[16/9] overflow-hidden rounded-[2.5rem]">
          <Image
            src="/images/finalcta.png"
            alt="Couple wearing ALPE glasses"
            fill
            sizes="(min-width: 768px) 896px, 100vw"
            className="object-cover"
            style={{ objectPosition: '50% 15%' }}
          />
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #7C3018 0%, transparent 20%, transparent 75%, #7C3018 100%), linear-gradient(to right, #7C3018 0%, transparent 15%, transparent 85%, #7C3018 100%)' }} />
        </div>



      </div>
    </section>
  )
}
