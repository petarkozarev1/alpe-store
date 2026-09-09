import { notFound } from 'next/navigation'
import Link from 'next/link'
import { products, getProducts, getLocalizedProductBySlug } from '@/lib/data/products'
import ImageGallery from '@/components/product/ImageGallery'
import ProductDetailClient from '@/components/product/ProductDetailClient'
import ComplementaryProductCard from '@/components/product/ComplementaryProductCard'
import {
  absoluteUrl,
  defaultSeo,
  merchantReturnPolicy,
  offerShippingDetails,
  productUrl,
} from '@/lib/seo'
import { isLocale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'

export function generateStaticParams() {
  return products.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) return {}
  const product = getLocalizedProductBySlug(params.slug, params.locale)

  if (!product) {
    return {
      title: params.locale === 'en' ? 'Product not found' : 'Продуктът не е намерен',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const url = productUrl(product, params.locale)
  const image = absoluteUrl(product.images[0])

  return {
    title: product.name,
    description: product.description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
      languages: {
        'bg-BG': productUrl(product, 'bg'),
        en: productUrl(product, 'en'),
        'x-default': productUrl(product, 'bg'),
      },
    },
    openGraph: {
      type: 'website',
      locale: params.locale === 'en' ? 'en_US' : defaultSeo.locale,
      alternateLocale: [params.locale === 'en' ? defaultSeo.locale : 'en_US'],
      url,
      siteName: defaultSeo.siteName,
      title: product.name,
      description: product.description,
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [image],
    },
  }
}

export default function ProductPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const product = getLocalizedProductBySlug(params.slug, locale)
  if (!product) notFound()
  const complementaryProduct = getProducts(locale).find((candidate) => candidate.id !== product.id)!

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((image) => absoluteUrl(image)),
    brand: {
      '@type': 'Brand',
      name: defaultSeo.siteName,
    },
    sku: product.id,
    offers: {
      '@type': 'Offer',
      url: productUrl(product, locale),
      priceCurrency: 'EUR',
      price: product.price,
      availability: product.variants.some((variant) => variant.inStock)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      hasMerchantReturnPolicy: merchantReturnPolicy,
      shippingDetails: offerShippingDetails(product.price),
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'en' ? 'Home' : 'Начало',
        item: absoluteUrl(localizedPath('/', locale)),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: locale === 'en' ? 'Lenses' : 'Стъкла',
        item: absoluteUrl(localizedPath('/lenses', locale)),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: productUrl(product),
      },
    ],
  }

  return (
    <main className="max-w-content mx-auto px-6 py-16 md:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label={locale === 'en' ? 'Breadcrumb' : 'Навигация'} className="mb-8 font-sans text-xs text-stone/75">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={localizedPath('/', locale)} className="transition-colors hover:text-gold">{locale === 'en' ? 'Home' : 'Начало'}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={localizedPath('/lenses', locale)} className="transition-colors hover:text-gold">{locale === 'en' ? 'Lenses' : 'Стъкла'}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-iron">{product.name}</li>
        </ol>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <ImageGallery images={product.images} alt={product.name} />
        <ProductDetailClient product={product} />
      </div>
      <section
        aria-labelledby="product-information-title"
        className="mt-20 border-y border-iron/10 py-12 md:mt-24 md:py-16"
      >
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-gold">{locale === 'en' ? 'Recommended use' : 'Подходяща употреба'}</p>
        <h2 id="product-information-title" className="mt-3 font-serif text-3xl text-iron md:text-4xl">
          {locale === 'en' ? 'More about' : 'Повече за'} {product.name}
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
          {product.details.map((detail) => (
            <article key={detail.title}>
              <h3 className="font-serif text-xl text-iron">{detail.title}</h3>
              <p className="mt-3 max-w-xl font-sans text-sm leading-7 text-stone">{detail.body}</p>
            </article>
          ))}
        </div>
      </section>
      <div className="mt-20 md:mt-28">
        <ComplementaryProductCard product={complementaryProduct} locale={params.locale} />
      </div>
    </main>
  )
}
