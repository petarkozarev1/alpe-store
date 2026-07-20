import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import { noIndexMetadata } from '@/lib/seo'

export const metadata = noIndexMetadata(
  'Плащане',
  'Завърши поръчката си за ALPÉ очила. Безплатна доставка над 50€.',
)

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
