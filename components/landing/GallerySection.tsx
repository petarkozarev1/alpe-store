'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { getLandingContent } from '@/lib/data/content'
import type { Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'

const images = [
  { src: '/images/customers/01.jpg', alt: 'AMPÉ customer', position: '46% 32%' },
  { src: '/images/customers/02.jpg', alt: 'AMPÉ customer', position: '40% 26%' },
  { src: '/images/customers/03.jpg', alt: 'AMPÉ customer', position: '50% 34%' },
  { src: '/images/customers/04.jpg', alt: 'AMPÉ customer', position: '50% 46%' },
  { src: '/images/customers/05.jpg', alt: 'AMPÉ customer', position: '50% 40%' },
]

export default function GallerySection({ locale }: { locale: Locale }) {
  const { galleryContent } = getLandingContent(locale)
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
                style={{ width: 174 }}
              >
                <div className="relative w-full rounded-xl overflow-hidden" style={{ height: 226 }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="174px"
                    className="object-cover"
                    style={{ objectPosition: img.position }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Button label={galleryContent.cta} href={localizedPath('/shop', locale)} variant="primary" className="font-bold" />
      </div>
    </section>
  )
}
