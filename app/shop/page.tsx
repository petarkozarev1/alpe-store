import ProductPage from '@/components/shop/ProductPage'
import {
  absoluteUrl,
  defaultSeo,
  merchantReturnPolicy,
  offerShippingDetails,
} from '@/lib/seo'
import { getInitialShopSelection } from '@/lib/shop-selection'

export const metadata = {
  title: 'ALPÉ очила за синя светлина и компютър',
  description:
    'Поръчай ALPÉ очила за синя светлина, blue light glasses и очила за компютър. Daily и Evening филтри за екран, фокус и сън с безплатна доставка над 50 евро.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    type: 'website',
    locale: defaultSeo.locale,
    url: absoluteUrl('/shop'),
    siteName: defaultSeo.siteName,
    title: 'ALPÉ очила за синя светлина и компютър',
    description:
      'Очилa против синя светлина за работа пред екран, фокус и по-спокоен сън. Daily и Evening филтри, UV400 защита и безплатна доставка над 50 евро.',
    images: [
      {
        url: '/images/shop/shop-evening-1.png',
        width: 1200,
        height: 1200,
        alt: 'ALPÉ Evening очила за синя светлина',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALPÉ очила за синя светлина и компютър',
    description:
      'Blue light blocking glasses за работа пред екран, ежедневен фокус и вечерна употреба.',
    images: ['/images/shop/shop-evening-1.png'],
  },
}

export default function ShopPage({ searchParams }: { searchParams?: { bundle?: string | string[] } }) {
  const bundleParam = Array.isArray(searchParams?.bundle) ? searchParams?.bundle[0] : searchParams?.bundle
  const initialSelection = getInitialShopSelection(bundleParam)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'ALPÉ очила за синя светлина',
    description:
      'ALPÉ Daily и Evening очила за синя и зелена светлина, очила за компютър и blue light blocking glasses с EU сертифицирани стъкла, UV400 защита и лека рамка за ежедневна употреба.',
    image: [
      absoluteUrl('/images/shop/shop-evening-1.png'),
      absoluteUrl('/images/shop/shop-daily-1.png'),
    ],
    brand: {
      '@type': 'Brand',
      name: defaultSeo.siteName,
    },
    sku: 'alpe-glasses',
    offers: [
      {
        '@type': 'Offer',
        name: '1 чифт ALPÉ',
        url: absoluteUrl('/shop'),
        priceCurrency: 'EUR',
        price: '44.99',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails: offerShippingDetails(44.99),
      },
      {
        '@type': 'Offer',
        name: '2 чифта ALPÉ',
        url: absoluteUrl('/shop'),
        priceCurrency: 'EUR',
        price: '66.99',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails: offerShippingDetails(66.99),
      },
      {
        '@type': 'Offer',
        name: '3 чифта ALPÉ',
        url: absoluteUrl('/shop'),
        priceCurrency: 'EUR',
        price: '89.99',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails: offerShippingDetails(89.99),
      },
    ],
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Начало',
        item: absoluteUrl(),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Магазин',
        item: absoluteUrl('/shop'),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPage initialSelection={initialSelection} />
    </>
  )
}
