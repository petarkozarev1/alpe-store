'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, type Transition } from 'framer-motion'
import Button from '@/components/ui/Button'
import { heroContent } from '@/lib/data/content'

const INTERVAL_MS = 1500

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' } as Transition,
})

export default function HeroSection() {
  const [index, setIndex] = useState(0)
  const images = [
    { src: '/images/shuffle5.png', alt: 'ALPÉ customer', objectPosition: '50% 25%' },
    { src: '/images/shuffle2.png', alt: 'ALPÉ customer', objectPosition: '50% 25%' },
    { src: '/images/shuffle4.png', alt: 'ALPÉ customer', objectPosition: '50% 25%' },
    { src: '/images/shuffle1.png', alt: 'ALPÉ customer', objectPosition: '50% 25%' },
    { src: '/images/shuffle6.png', alt: 'ALPÉ customer', objectPosition: '50% 25%' },
    { src: '/images/shuffle3.png', alt: 'ALPÉ customer', objectPosition: '50% 25%' },
  ]

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % images.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [images.length])

  const current = images[index]

  return (
    <section className="w-full bg-parchment pt-10 pb-10 flex flex-col items-center text-center px-6">
      <motion.h1
        {...fadeUp(0.1)}
        className="mt-6 text-[clamp(48px,7vw,80px)] font-extrabold leading-[1.1] tracking-tight text-onyx max-w-3xl"
      >
        {heroContent.headlinePart1}
        <br />
        <span className="inline-flex items-center gap-3 flex-wrap justify-center">
          {heroContent.headlinePart2Before}
          <span className="relative inline-block w-14 h-14 md:w-16 md:h-16 rounded-[30%] overflow-hidden border-2 border-white shadow-md align-middle rotate-[8deg]">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(min-width: 768px) 64px, 56px"
                  className="object-cover"
                  style={{ objectPosition: current.objectPosition ?? '50% 25%' }}
                />
              </motion.div>
            </AnimatePresence>
          </span>
          {heroContent.headlinePart2After}
        </span>
      </motion.h1>

      <motion.p
        {...fadeUp(0.2)}
        className="mt-6 text-base text-stone max-w-md leading-relaxed"
      >
        {heroContent.subtext}
      </motion.p>

      <motion.div {...fadeUp(0.3)} className="mt-8">
        <Button label={heroContent.cta} href="/shop" variant="primary" className="font-bold" />
      </motion.div>
    </section>
  )
}
