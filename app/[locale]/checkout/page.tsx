import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import { localizedNoIndexMetadata } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return localizedNoIndexMetadata(params.locale, 'Плащане', 'Завърши поръчката си за ALPÉ очила. Безплатна доставка над 50€.')
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
