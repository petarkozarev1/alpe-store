'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { benefits } from '@/lib/data/content'

export default function BenefitsScroll() {
  return (
    <section id="benefits" className="relative w-full bg-white overflow-hidden">
      {/* Tall scroll container with sticky bottle */}
      <div className="relative">
        {/* Sticky product bottle — fixed in center as user scrolls */}
        <div aria-hidden="true" className="sticky top-0 h-screen w-full flex items-center justify-center pointer-events-none -mb-[100vh]">
          <div className="relative w-56 h-80 md:w-72 md:h-96">
            <Image
              src="https://via.placeholder.com/300x450/F5F5F0/000000?text=Serum+Bottle"
              alt="Raydiant Serum"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Benefit panels — scroll over the sticky bottle */}
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="relative h-screen flex items-center"
          >
            <div className={`w-full max-w-content mx-auto px-6 md:px-10 flex ${
              benefit.side === 'right' ? 'justify-end' : 'justify-start'
            }`}>
              <motion.h2
                initial={{ opacity: 0, x: benefit.side === 'right' ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.5 }}
                className="text-[clamp(28px,4vw,52px)] font-bold tracking-tight max-w-xs md:max-w-sm leading-tight"
              >
                {benefit.headline}
              </motion.h2>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
