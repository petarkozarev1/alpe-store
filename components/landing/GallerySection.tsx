'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { getLandingContent } from '@/lib/data/content'
import type { Locale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'

type GalleryCard = {
  src: string
  alt: string
  position: string
  handle: string
  verified?: boolean
}

const images: GalleryCard[] = [
  { src: '/images/customers/01.jpg', alt: 'AMPÉ customer', position: '46% 32%', handle: 'iliyana_ddimitrova' },
  { src: '/images/customers/02.jpg', alt: 'AMPÉ customer', position: '40% 26%', handle: 'borislava_blagoeva', verified: true },
  { src: '/images/customers/06.jpg', alt: 'AMPÉ customer', position: '50% 45%', handle: 'kaloyanbachev' },
  { src: '/images/customers/03.jpg', alt: 'AMPÉ customer', position: '50% 34%', handle: 'mylifeasteaa' },
  { src: '/images/customers/04.jpg', alt: 'AMPÉ customer', position: '50% 50%', handle: 'a.sia.aa' },
  { src: '/images/customers/05.jpg', alt: 'AMPÉ customer', position: '50% 40%', handle: 'slaviargirova' },
]

function IgMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 shrink-0">
      <circle cx="12" cy="12" r="12" fill="#0095F6" />
      <path d="M7.2 12.3l3.1 3.1 6.5-6.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function GallerySection({ locale }: { locale: Locale }) {
  const { galleryContent } = getLandingContent(locale)
  return (
    <section className="w-full bg-parchment pt-24 pb-12">
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
          transition={{ duration: 33.6, ease: 'linear', repeat: Infinity }}
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
                <a
                  href={`https://instagram.com/${img.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Профил в Instagram: @${img.handle}`}
                  className="absolute bottom-2.5 left-2.5 z-[2] flex max-w-[calc(100%-1.25rem)] items-center gap-1.5 rounded-full bg-cream/75 px-2.5 py-1 backdrop-blur-md"
                >
                  <IgMark className="h-3 w-3 shrink-0 text-onyx" />
                  <span className="truncate font-sans text-[11px] font-medium text-onyx">@{img.handle}</span>
                  {img.verified ? <VerifiedBadge /> : null}
                </a>
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
