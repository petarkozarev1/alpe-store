'use client'
import { motion } from 'framer-motion'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { ingredientsContent, ingredients } from '@/lib/data/content'

export default function IngredientsSection() {
  return (
    <section id="ingredients" className="w-full bg-parchment py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <Badge label={ingredientsContent.badge} />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-6 text-[clamp(36px,5vw,56px)] font-bold tracking-tight leading-tight whitespace-pre-line text-onyx"
          >
            {ingredientsContent.headline}
          </motion.h2>
        </div>

        {/* Editorial video */}
        <div className="relative w-full aspect-[16/7] rounded-xl overflow-hidden mb-16">
          <video
            src="/videos/ingredients.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Key ingredients table */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-onyx">{ingredientsContent.sectionTitle}</h3>
            <Button label={ingredientsContent.cta} href="/shop" variant="primary" className="font-bold" />
          </div>

          <div className="flex flex-col">
            {ingredients.map((ingredient, i) => (
              <motion.div
                key={ingredient.number}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between py-5 gap-6">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="w-8 h-8 rounded-full border border-gold flex items-center justify-center text-sm font-medium flex-shrink-0 text-gold">
                      {ingredient.number}
                    </span>
                    <span className="font-medium text-onyx">{ingredient.name}</span>
                    {ingredient.badge && (
                      <span className="font-sans text-[9px] font-semibold tracking-widest uppercase text-gold border border-gold/50 rounded px-1.5 py-0.5 flex-shrink-0">{ingredient.badge}</span>
                    )}
                  </div>
                  <span className="text-stone text-sm text-right max-w-sm shrink-0">{ingredient.description}</span>
                </div>
                {i < ingredients.length - 1 && <hr className="border-stone/30" />}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
