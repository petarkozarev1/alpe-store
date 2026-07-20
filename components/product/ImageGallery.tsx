'use client'
import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-linen">
        <Image
          src={images[activeIndex]}
          alt={alt}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto px-0.5 pb-2 pt-1 sm:gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
              className={`relative aspect-[4/3] w-[5.25rem] flex-none overflow-hidden rounded-xl border bg-parchment shadow-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-24 ${
                i === activeIndex
                  ? '-translate-y-0.5 border-onyx shadow-md ring-1 ring-onyx/10'
                  : 'border-iron/10 opacity-80 hover:-translate-y-0.5 hover:border-gold/60 hover:opacity-100'
              }`}
            >
              <Image
                src={src}
                alt={`${alt} ${i + 1}`}
                fill
                sizes="(max-width: 640px) 84px, 96px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
