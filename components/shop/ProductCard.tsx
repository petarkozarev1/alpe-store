'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-square rounded-xl overflow-hidden bg-linen mb-4">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-onyx text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="bg-white text-onyx text-sm font-semibold px-4 py-2 rounded-full">
              View Product
            </span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-base">{product.name}</h3>
          <p className="text-stone text-sm mt-0.5">{product.subtitle}</p>
          <p className="font-bold text-base mt-2">${product.price}</p>
        </div>
      </Link>
    </motion.div>
  )
}
