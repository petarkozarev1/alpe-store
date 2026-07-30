import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import {
  getP2GAttribution,
  P2G_COOKIE_NAME,
} from '@/lib/orders/attribution'

export const metadata: Metadata = {
  title: 'Плащане — ALPÉ',
  description: 'Завърши поръчката си за ALPÉ очила. Безплатна доставка над 50€.',
}

export default function CheckoutPage() {
  const affiliateId = getP2GAttribution(
    cookies().get(P2G_COOKIE_NAME)?.value,
    process.env.P2G_AFFILIATE_ID
  )

  return <CheckoutPageClient isP2G={Boolean(affiliateId)} />
}
