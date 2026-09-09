import ProductPage from '@/components/shop/ProductPage'
import {
  absoluteUrl,
  defaultSeo,
  merchantReturnPolicy,
  offerShippingDetails,
  createLocalizedPageMetadata,
} from '@/lib/seo'
import { getInitialShopSelection } from '@/lib/shop-selection'
import { isLocale } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { translate } from '@/lib/i18n/translations'
import { localizedPath } from '@/lib/i18n/routing'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return createLocalizedPageMetadata(params.locale, {
    title: 'ALPÉ очила за синя светлина и компютър',
    description: 'Поръчай ALPÉ очила за синя светлина, blue light glasses и очила за компютър. Daily и Evening филтри за екран, фокус и сън с безплатна доставка над 50 евро.',
    path: '/shop',
  })
}

export default function ShopPage({ params, searchParams }: { params: { locale: string }; searchParams?: { bundle?: string | string[] } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const t = (source: string) => translate(locale, source)
  const bundleParam = Array.isArray(searchParams?.bundle) ? searchParams?.bundle[0] : searchParams?.bundle
  const initialSelection = getInitialShopSelection(bundleParam)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: t('ALPÉ очила за синя светлина'),
    description: t('ALPÉ Daily и Evening очила за синя и зелена светлина, очила за компютър и blue light blocking glasses с EU сертифицирани стъкла, UV400 защита и лека рамка за ежедневна употреба.'),
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
        name: t('1 чифт ALPÉ'),
        url: absoluteUrl(localizedPath('/shop', locale)),
        priceCurrency: 'EUR',
        price: '44.99',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails: offerShippingDetails(44.99),
      },
      {
        '@type': 'Offer',
        name: t('2 чифта ALPÉ'),
        url: absoluteUrl(localizedPath('/shop', locale)),
        priceCurrency: 'EUR',
        price: '66.99',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        hasMerchantReturnPolicy: merchantReturnPolicy,
        shippingDetails: offerShippingDetails(66.99),
      },
      {
        '@type': 'Offer',
        name: t('3 чифта ALPÉ'),
        url: absoluteUrl(localizedPath('/shop', locale)),
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
        name: t('Начало'),
        item: absoluteUrl(localizedPath('/', locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('Магазин'),
        item: absoluteUrl(localizedPath('/shop', locale)),
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
