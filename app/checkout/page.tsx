import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Плащане — ALPÉ',
  description: 'Завърши поръчката си за ALPÉ очила. Безплатна доставка над 50€.',
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
