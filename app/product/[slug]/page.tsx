import { notFound } from 'next/navigation'
import { products, getProductBySlug } from '@/lib/data/products'
import ImageGallery from '@/components/product/ImageGallery'
import ProductDetailClient from '@/components/product/ProductDetailClient'

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  return { title: product ? `${product.name} — ALPE` : 'Product Not Found' }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()

  return (
    <div className="max-w-content mx-auto px-6 md:px-10 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <ImageGallery images={product.images} alt={product.name} />
        <ProductDetailClient product={product} />
      </div>
    </div>
  )
}
