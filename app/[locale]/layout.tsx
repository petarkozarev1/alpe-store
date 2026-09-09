import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Raleway } from 'next/font/google'
import '../globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import CookieBanner from '@/components/layout/CookieBanner'
import GoogleTagManager from '@/components/layout/GoogleTagManager'
import MetaPixel from '@/components/analytics/MetaPixel'
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity'
import RouteChangeTracker from '@/components/analytics/RouteChangeTracker'
import { defaultSeo, organizationJsonLd, siteUrl, websiteJsonLd } from '@/lib/seo'
import { isLocale, locales } from '@/lib/i18n/config'
import { notFound } from 'next/navigation'
import { LocaleProvider } from '@/components/i18n/LocaleProvider'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
})

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-raleway',
})

function rootMetadata(locale: 'bg' | 'en'): Metadata {
  const title = locale === 'en' ? 'ALPÉ - Blue-light glasses' : defaultSeo.title
  const description = locale === 'en'
    ? 'ALPÉ blue- and green-light glasses with EU-certified lenses, UV400 protection and free delivery over €50.'
    : defaultSeo.description
  return {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${defaultSeo.siteName}`,
  },
  description,
  applicationName: defaultSeo.siteName,
  openGraph: {
    type: 'website',
    locale: locale === 'en' ? 'en_US' : defaultSeo.locale,
    alternateLocale: [locale === 'en' ? defaultSeo.locale : 'en_US'],
    url: locale === 'en' ? `${siteUrl}/en` : siteUrl,
    siteName: defaultSeo.siteName,
    title,
    description,
    images: [
      {
        url: '/images/logo.png',
        width: 512,
        height: 512,
        alt: 'ALPÉ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    other: {
      'facebook-domain-verification': 'gxj9eq9kycevuqe4cxh9d1dqn1qb39',
    },
  },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return rootMetadata(params.locale === 'en' ? 'en' : 'bg')
}

export default function RootLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  return (
    <html lang={params.locale} className={`${cormorant.variable} ${raleway.variable}`}>
      <body>
        <LocaleProvider locale={params.locale}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...websiteJsonLd, inLanguage: params.locale === 'en' ? 'en' : 'bg-BG' }) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <GoogleTagManager />
        <CookieBanner />
        <MetaPixel />
        <MicrosoftClarity />
        <RouteChangeTracker />
        </LocaleProvider>
      </body>
    </html>
  )
}
