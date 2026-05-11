'use client'
import Link from 'next/link'
import { siteConfig } from '@/lib/data/site'
import { resetCookieConsent } from '@/components/layout/CookieBanner'

export default function Footer() {
  return (
    <footer className="bg-onyx border-t border-iron/30">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand + description */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-serif text-xl text-linen tracking-widest">
              {siteConfig.brand}
            </Link>
            <p className="font-sans text-xs text-linen/60 leading-relaxed max-w-[200px]">
              {siteConfig.footer.description}
            </p>
          </div>

          {/* 3 link columns */}
          {siteConfig.footer.columns.map(col => (
            <div key={col.title}>
              <p className="font-sans text-[10px] uppercase tracking-widest text-linen/50 mb-5">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-xs text-linen/65 hover:text-gold transition-colors"
                    >
                      {link.label}
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
            {siteConfig.footer.copyright}
          </span>
          <div className="flex gap-6 flex-wrap justify-center">
            {siteConfig.footer.legal.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-[10px] text-linen/45 hover:text-linen transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[10px] text-linen/45 hover:text-linen transition-colors"
            >
              Онлайн решаване на спорове (ЕС)
            </a>
            <button
              onClick={resetCookieConsent}
              className="font-sans text-[10px] text-linen/45 hover:text-linen transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              Настройки за бисквитки
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
