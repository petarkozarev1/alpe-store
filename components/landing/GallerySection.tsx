'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { galleryContent } from '@/lib/data/content'

const images = [
  { src: '/images/shuffle5.png', alt: 'ALPE customer' },
  { src: '/images/shuffle2.png', alt: 'ALPE customer' },
  { src: '/images/shuffle4.png', alt: 'ALPE customer' },
  { src: '/images/shuffle1.png', alt: 'ALPE customer' },
  { src: '/images/shuffle6.png', alt: 'ALPE customer' },
  { src: '/images/shuffle3.png', alt: 'ALPE customer' },
]

export default function GallerySection() {
  return (
    <section className="w-full bg-parchment py-24">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-center mb-12 text-onyx px-6"
      >
        {galleryContent.headline}
      </motion.h2>

      {/* Carousel constrained to content width */}
      <div className="max-w-content mx-auto px-6 md:px-10">
        <div className="relative overflow-hidden">
          {/* Blur edges */}
          <div
            aria-hidden="true"
            className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              maskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
            style={{
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              maskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 30%, transparent 100%)',
            }}
          />

          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
            className="flex gap-4 w-max"
          >
            {[...images, ...images].map((img, i) => (
              <div
                key={i}
                className="flex-shrink-0 rounded-2xl border-[3px] border-white p-[3px] shadow-sm"
                style={{ width: 200 }}
              >
                <div className="relative w-full rounded-xl overflow-hidden" style={{ height: 260 }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="200px"
                    className="object-cover"
                    style={{ objectPosition: 'center' }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Button label={galleryContent.cta} href="/shop" variant="primary" className="font-bold" />
      </div>
    </section>
  )
}
