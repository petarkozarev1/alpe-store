import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Raleway } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import CookieBanner from '@/components/layout/CookieBanner'
import GoogleTagManager from '@/components/layout/GoogleTagManager'
import MetaPixel from '@/components/analytics/MetaPixel'
import MicrosoftClarity from '@/components/analytics/MicrosoftClarity'
import RouteChangeTracker from '@/components/analytics/RouteChangeTracker'
import { defaultSeo, organizationJsonLd, siteUrl, websiteJsonLd } from '@/lib/seo'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultSeo.title,
    template: `%s | ${defaultSeo.siteName}`,
  },
  description: defaultSeo.description,
  applicationName: defaultSeo.siteName,
  openGraph: {
    type: 'website',
    locale: defaultSeo.locale,
    url: siteUrl,
    siteName: defaultSeo.siteName,
    title: defaultSeo.title,
    description: defaultSeo.description,
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
    title: defaultSeo.title,
    description: defaultSeo.description,
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bg" className={`${cormorant.variable} ${raleway.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
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
      </body>
    </html>
  )
}
