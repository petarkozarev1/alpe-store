'use client'
import Link from 'next/link'
import { siteConfig } from '@/lib/data/site'
import { resetCookieConsent } from '@/components/layout/CookieBanner'
import { useLocale, useTranslations } from '@/components/i18n/LocaleProvider'
import { localizedPath } from '@/lib/i18n/routing'

export default function Footer() {
  const locale = useLocale()
  const t = useTranslations()
  return (
    <footer className="bg-onyx border-t border-iron/30">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand + description */}
          <div className="flex flex-col gap-4">
            <Link href={localizedPath('/', locale)} className="font-serif text-xl text-linen tracking-widest">
              {siteConfig.brand}
            </Link>
            <p className="font-sans text-xs text-linen/60 leading-relaxed max-w-[200px]">
              {t(siteConfig.footer.description)}
            </p>
          </div>

          {/* 3 link columns */}
          {siteConfig.footer.columns.map(col => (
            <div key={col.title}>
              <p className="font-sans text-[10px] uppercase tracking-widest text-linen/50 mb-5">
                {t(col.title)}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={localizedPath(link.href, locale)}
                      className="font-sans text-xs text-linen/65 hover:text-gold transition-colors"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-iron/30">
        <div className="max-w-content mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="font-sans text-[10px] text-linen/45">
            {t(siteConfig.footer.copyright)}
          </span>
          <div className="flex gap-6 flex-wrap justify-center">
            {siteConfig.footer.legal.map(link => (
              <Link
                key={link.label}
                href={localizedPath(link.href, locale)}
                className="font-sans text-[10px] text-linen/45 hover:text-linen transition-colors"
              >
                {t(link.label)}
              </Link>
            ))}
            <button
              onClick={resetCookieConsent}
              className="font-sans text-[10px] text-linen/45 hover:text-linen transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              {t('Настройки за бисквитки')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
