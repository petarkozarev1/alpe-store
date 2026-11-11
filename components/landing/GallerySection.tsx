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
  { src: '/images/customers/04.jpg', alt: 'AMPÉ customer', position: '50% 50%' },
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

      {/* Four sharp cards on desktop, two on a phone, with a blurred partial card at each edge */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden md:left-auto md:mx-auto md:w-[min(95vw,1400px)] md:translate-x-0">
        {/* Blur edges */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 z-10 w-6 pointer-events-none md:w-[max(40px,calc((min(95vw,1400px)-1208px)/2))]"
          style={{
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            maskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, black 30%, transparent 100%)',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 z-10 w-6 pointer-events-none md:w-[max(40px,calc((min(95vw,1400px)-1208px)/2))]"
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
              className="w-[calc((100vw-64px)/2)] flex-shrink-0 rounded-2xl border-[3px] border-white p-[3px] shadow-sm md:w-[clamp(210px,calc((min(95vw,1400px)-128px)/4),290px)]"
            >
              <div className="relative h-[calc((100vw-64px)/2*376/290)] w-full overflow-hidden rounded-xl md:h-[clamp(272px,calc((min(95vw,1400px)-128px)/4*376/290),376px)]">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 290px, 45vw"
                  className="object-cover"
                  style={{ objectPosition: img.position }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center mt-12">
        <Button label={galleryContent.cta} href={localizedPath('/shop', locale)} variant="primary" className="font-bold" />
      </div>
    </section>
  )
}
