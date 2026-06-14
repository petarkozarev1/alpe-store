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
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-onyx px-6 py-16 text-center text-linen md:px-10">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover md:hidden"
        src="/videos/hero-mobile.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <video
        className="absolute inset-0 z-0 hidden h-full w-full object-cover md:block"
        src="/videos/hero-desktop.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-10 bg-[linear-gradient(180deg,rgba(45,14,4,0.56)_0%,rgba(45,14,4,0.34)_38%,rgba(45,14,4,0.78)_100%)]" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_34%,rgba(237,228,214,0.16),transparent_34%),linear-gradient(90deg,rgba(45,14,4,0.72)_0%,rgba(45,14,4,0.34)_52%,rgba(45,14,4,0.64)_100%)]" />

      <div className="relative z-20 mx-auto flex min-h-[calc(100svh-128px)] max-w-5xl flex-col items-center justify-center pt-10 md:min-h-[calc(100svh-160px)]">
        <motion.p
          {...fadeUp(0)}
          className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-linen/80"
        >
          ALPE
        </motion.p>

        <motion.h1
          {...fadeUp(0.1)}
          className="max-w-4xl text-[clamp(46px,8vw,96px)] font-extrabold leading-[0.98] tracking-tight text-linen drop-shadow-[0_2px_22px_rgba(45,14,4,0.55)]"
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
