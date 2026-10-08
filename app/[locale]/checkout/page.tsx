import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import { localizedNoIndexMetadata } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: string } }) {
  const en = params.locale === 'en'
  return localizedNoIndexMetadata(
    params.locale,
    en ? 'Checkout' : 'Плащане',
    en ? 'Complete your ALPÉ order. Free delivery over €50.' : 'Завърши поръчката си за ALPÉ очила. Безплатна доставка над 50€.',
  )
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
