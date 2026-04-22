'use client'
import { motion } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import { testimonialContent } from '@/lib/data/content'

export default function TestimonialSection() {
  return (
    <section className="w-full bg-parchment py-24 text-onyx">
      <div className="max-w-content mx-auto px-6 md:px-10 flex flex-col items-center text-center">
        <Badge label={testimonialContent.badge} />

        <div className="mt-8 flex gap-1" role="img" aria-label={`${testimonialContent.stars} out of 5 stars`}>
          {Array.from({ length: testimonialContent.stars }).map((_, i) => (
            <span key={i} aria-hidden="true" className="text-onyx text-xl">★</span>
          ))}
        </div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-6 text-2xl font-bold leading-snug max-w-2xl text-onyx"
        >
          &ldquo;{testimonialContent.quote}&rdquo;
        </motion.blockquote>

        <p className="mt-4 text-onyx/70 text-sm">~ {testimonialContent.author}</p>
      </div>
    </section>
  )
}
