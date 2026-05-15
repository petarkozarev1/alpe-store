import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Raleway } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import CookieBanner from '@/components/layout/CookieBanner'
import GoogleTagManager from '@/components/layout/GoogleTagManager'
import MetaPixel from '@/components/analytics/MetaPixel'

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
  title: 'ALPÉ — Screen All Day. Sleep All Night.',
  description: 'ALPÉ blue light blocking glasses protect your eyes during long screen sessions — reducing eye strain and sleep disruption.',
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
    <html lang="en" className={`${cormorant.variable} ${raleway.variable}`}>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CartDrawer />
        <GoogleTagManager />
        <CookieBanner />
        <MetaPixel />
      </body>
    </html>
  )
}
