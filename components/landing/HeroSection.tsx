'use client'
import { motion, type Transition } from 'framer-motion'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import Button from '@/components/ui/Button'
import { heroContent } from '@/lib/data/content'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' } as Transition,
})

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100svh-97px)] w-full overflow-hidden bg-onyx text-center text-linen">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover object-[68%_center] motion-reduce:hidden md:object-center"
        src="/videos/alpe-hero-web.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(45,14,4,0.62)_0%,rgba(45,14,4,0.28)_38%,rgba(45,14,4,0.8)_100%)]" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_34%,rgba(237,228,214,0.14),transparent_34%),linear-gradient(90deg,rgba(45,14,4,0.66)_0%,rgba(45,14,4,0.24)_52%,rgba(45,14,4,0.58)_100%)]" />

      <div
        data-testid="hero-content"
        className="relative z-20 mx-auto flex min-h-[calc(100svh-97px)] max-w-5xl flex-col items-center justify-center px-6 py-10 md:px-10 md:py-14"
      >
        <motion.h1
          {...fadeUp(0)}
          className="max-w-4xl text-[clamp(40px,11vw,96px)] font-extrabold leading-[0.98] tracking-tight text-linen drop-shadow-[0_2px_22px_rgba(45,14,4,0.55)] md:text-[clamp(56px,8vw,96px)]"
        >
          {heroContent.headlinePart1}
          <br />
          {heroContent.headlinePart2Before} {heroContent.headlinePart2After}
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 max-w-xl text-base leading-relaxed text-linen/86 drop-shadow-[0_1px_12px_rgba(45,14,4,0.55)] md:text-lg"
        >
          {heroContent.subtext}
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mt-8">
          <Button
            label={heroContent.cta}
            href="/shop"
            variant="outlined-white"
            className="border-linen bg-linen text-onyx shadow-[0_18px_40px_rgba(45,14,4,0.28)] hover:bg-parchment hover:text-onyx"
            onClick={() => {
              fireTrackedEvent('CTAClick', { custom: true, data: { cta_location: 'hero' }, ctaLocation: 'hero' })
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
