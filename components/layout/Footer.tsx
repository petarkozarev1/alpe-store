import Link from 'next/link'
import { siteConfig } from '@/lib/data/site'

export default function Footer() {
  return (
    <footer className="bg-onyx border-t border-iron">
      <div className="max-w-content mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row justify-between gap-12">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="font-serif text-lg text-gold tracking-widest">
            {siteConfig.brand}
          </Link>
          <p className="font-sans text-xs text-stone leading-relaxed max-w-xs">
            {siteConfig.footer.tagline}
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-16">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone/50 mb-5">Страници</p>
            <ul className="flex flex-col gap-3">
              {siteConfig.footer.pages.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-stone hover:text-gold transition-colors underline-offset-4 hover:underline decoration-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-widest text-stone/50 mb-5">Социални</p>
            <ul className="flex flex-col gap-3">
              {siteConfig.footer.social.map(link => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-stone hover:text-gold transition-colors underline-offset-4 hover:underline decoration-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-iron max-w-content mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between gap-2">
        <span className="font-sans text-[10px] text-stone/40">{siteConfig.brand} © 2026</span>
        <span className="font-sans text-[10px] text-stone/40">България</span>
      </div>
    </footer>
  )
}
