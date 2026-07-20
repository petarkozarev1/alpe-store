import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/lib/types'

export default function ComplementaryProductCard({ product }: { product: Product }) {
  return (
    <section
      aria-labelledby="complete-routine-title"
      className="relative overflow-hidden rounded-[2rem] border border-iron/10 bg-linen"
    >
      <div className="grid md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[280px] bg-parchment md:min-h-[420px]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-contain p-8 md:p-12"
          />
          <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-iron/10 bg-linen/90 px-4 py-2 backdrop-blur">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E4B94F]" aria-hidden="true" />
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone">Ден</span>
            <span className="text-stone/50" aria-hidden="true">→</span>
            <span className="h-2.5 w-2.5 rounded-full bg-[#C76832]" aria-hidden="true" />
            <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-stone">Вечер</span>
          </div>
        </div>

        <div className="flex flex-col justify-center px-7 py-10 sm:px-10 md:px-14 md:py-14">
          <p className="font-sans text-xs uppercase tracking-[0.22em] text-gold">Завърши рутината</p>
          <h2 id="complete-routine-title" className="mt-4 font-serif text-4xl leading-none text-iron md:text-5xl">
            {product.name}
          </h2>
          <p className="mt-5 max-w-lg font-sans text-sm leading-7 text-stone">
            {product.description} Комбинирай двата филтъра и използвай подходящите очила според часа от деня.
          </p>
          <p className="mt-5 font-serif text-2xl text-iron">€{product.price.toFixed(2)}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop?bundle=daily-evening"
              className="rounded-full bg-iron px-6 py-3.5 text-center font-sans text-sm font-semibold text-linen transition-colors hover:bg-onyx focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Вземи Daily + Evening
            </Link>
            <Link
              href={`/product/${product.slug}`}
              className="rounded-full border border-iron/20 px-6 py-3.5 text-center font-sans text-sm font-semibold text-iron transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              Разгледай {product.name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
