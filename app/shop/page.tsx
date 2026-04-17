import ProductGrid from '@/components/shop/ProductGrid'
import { products } from '@/lib/data/products'

export const metadata = { title: 'Shop — ALPE' }

export default function ShopPage() {
  return (
    <div className="max-w-content mx-auto px-6 md:px-10 py-16">
      <h1 className="text-[clamp(32px,5vw,52px)] font-bold tracking-tight mb-2">Shop</h1>
      <p className="text-stone mb-12">All Products</p>
      <ProductGrid products={products} />
    </div>
  )
}
