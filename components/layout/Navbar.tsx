'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/lib/data/site'
import { useCartStore } from '@/lib/store/cartStore'
import { fireTrackedEvent } from '@/components/analytics/MetaPixel'
import { useLocale, useTranslations } from '@/components/i18n/LocaleProvider'
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher'
import { localizedPath } from '@/lib/i18n/routing'
import { usePricingSnapshot } from '@/components/pricing/PricingProvider'
import FormerlyLine from '@/components/layout/FormerlyLine'
import SaleMarquee from '@/components/layout/SaleMarquee'
import { saleBarMessage } from '@/lib/sale'
import { displayedPairs } from '@/lib/order-lines'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations()
  const pricing = usePricingSnapshot()
  const announcement = saleBarMessage(pricing, locale)

  function navHref(href: string) {
    const base = href.startsWith('#') && pathname !== '/' && pathname !== '/en' ? '/' + href : href
    return localizedPath(base, locale)
  }

  function trackCtaClick() {
    fireTrackedEvent('CTAClick', { custom: true, data: { cta_location: 'navbar_desktop' }, ctaLocation: 'navbar_desktop' })
  }
  const { items, openDrawer } = useCartStore()
  const itemCount = items.reduce((s, i) => s + displayedPairs(i), 0)

  return (
    <header className="sticky top-0 z-50 w-full">
      <SaleMarquee text={announcement} />
      <div className="w-full bg-[#B8906A] border-b border-stone/30">
      <div className="relative max-w-content mx-auto px-2 md:px-10 min-h-16 flex items-center">

        <div className="md:hidden relative z-10 flex items-center">
          <LanguageSwitcher variant="toggle" />
        </div>

        <div className="hidden md:flex flex-1">
          <Link href={localizedPath('/', locale)} className="inline-flex flex-col">
            <img src="/brand/ampe-wordmark-cream-on-transparent.svg" alt={siteConfig.brand} className="h-7 w-auto" />
            <FormerlyLine locale={locale} className="font-sans text-[9px] tracking-wide text-[#1A1A1A] mt-0.5" />
          </Link>
        </div>

        <Link
          href={localizedPath('/', locale)}
          className="md:hidden absolute left-1/2 top-1/2 z-10 flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <img src="/brand/ampe-wordmark-cream-on-transparent.svg" alt={siteConfig.brand} className="h-7 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {siteConfig.nav.map(link => (
            <Link
              key={link.label}
              href={navHref(link.href)}
              className="font-sans text-xs uppercase tracking-widest text-linen hover:text-parchment transition-colors duration-200"
            >
              {t(link.label)}
            </Link>
          ))}
        </nav>

        {/* Desktop right: CTA + cart */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-6">
          <Link
            href={localizedPath('/shop', locale)}
            onClick={() => trackCtaClick()}
            className="font-sans text-xs font-bold uppercase tracking-widest bg-onyx text-linen px-5 py-2 rounded-full hover:bg-iron transition-colors"
          >
            {t('Поръчай сега')}
          </Link>
          <button
            onClick={openDrawer}
            aria-label={t('Отвори количката')}
            className="relative text-linen hover:text-parchment transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gold text-onyx text-[9px] font-sans font-semibold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        <div className="hidden md:flex items-center ml-5"><LanguageSwitcher /></div>
        <div className="md:hidden relative z-10 ml-auto flex items-center">
          <button onClick={openDrawer} aria-label={t('Отвори количката')} className="relative flex min-h-11 min-w-11 items-center justify-center text-linen hover:text-parchment">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-gold text-onyx text-[9px] font-sans font-semibold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
          <button
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={t('Меню')}
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-px bg-linen transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`block w-5 h-px bg-linen transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-linen transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
        </div>
      </div>

      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden border-t border-stone/30 bg-[#B8906A]"
          >
            <div className="flex flex-col px-4 py-3">
              {siteConfig.nav.map(link => (
                <Link
                  key={link.label}
                  href={navHref(link.href)}
                  className="flex min-h-11 items-center font-sans text-xs uppercase tracking-widest text-linen hover:text-parchment"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
