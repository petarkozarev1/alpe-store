'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { heroContent } from '@/lib/data/content'

const tr = (delay: number): Transition => ({ duration: 0.6, delay, ease: 'easeOut' })
const fadeUp0  = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: tr(0) }
const fadeUp01 = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: tr(0.1) }
const fadeUp02 = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: tr(0.2) }
const fadeUp03 = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: tr(0.3) }

export default function HeroSection() {
  return (
    <section className="w-full bg-white pt-20 pb-10 flex flex-col items-center text-center px-6">
      <motion.div {...fadeUp0}>
        <Badge label={heroContent.badge} />
      </motion.div>

      <motion.h1
        {...fadeUp01}
        className="mt-6 text-[clamp(48px,7vw,80px)] font-extrabold leading-tight tracking-tight text-brand-black max-w-3xl"
      >
        {heroContent.headlinePart1}
        <br />
        <span className="inline-flex items-center gap-3 flex-wrap justify-center">
          {heroContent.headlinePart2Before}
          <span className="relative inline-block w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-brand-border align-middle">
            <Image
              src={heroContent.heroFaceImage}
              alt=""
              fill
              className="object-cover"
            />
          </span>
          {heroContent.headlinePart2After}
        </span>
      </motion.h1>

      <motion.p
        {...fadeUp02}
        className="mt-6 text-base text-brand-muted max-w-md leading-relaxed"
      >
        {heroContent.subtext}
      </motion.p>

      <motion.div {...fadeUp03} className="mt-8">
        <Button label={heroContent.cta} href="/shop" variant="primary" />
      </motion.div>
    </section>
  )
}
