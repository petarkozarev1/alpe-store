import CheckoutPageClient from '@/components/checkout/CheckoutPageClient'
import { localizedNoIndexMetadata } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: string } }) {
  const en = params.locale === 'en'
  return localizedNoIndexMetadata(
    params.locale,
    en ? 'Checkout' : 'Плащане',
    en ? 'Complete your AMPÉ order. Free delivery on 2 or more pairs.' : 'Завърши поръчката си за AMPÉ очила. Безплатна доставка за 2 или повече чифта.',
  )
}

export default function CheckoutPage() {
  return <CheckoutPageClient />
}
