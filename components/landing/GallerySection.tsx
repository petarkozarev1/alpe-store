'use client'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Button from '@/components/ui/Button'
import { galleryContent } from '@/lib/data/content'

export default function GallerySection() {
  return (
    <section className="w-full bg-sand py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[clamp(32px,4vw,48px)] font-bold tracking-tight text-center mb-12 text-onyx"
        >
          {galleryContent.headline}
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryContent.images.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] rounded-xl overflow-hidden"
            >
              <Image
                src={src}
                alt={`Gallery photo ${i + 1}`}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button label={galleryContent.cta} href="/shop" variant="primary" />
        </div>

      </div>
    </section>
  )
}
