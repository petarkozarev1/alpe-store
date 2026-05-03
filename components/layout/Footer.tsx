import Link from 'next/link'
import { siteConfig } from '@/lib/data/site'

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
            <p className="font-sans text-xs text-stone leading-relaxed max-w-[200px]">
              {siteConfig.footer.description}
            </p>
          </div>

          {/* 3 link columns */}
          {siteConfig.footer.columns.map(col => (
            <div key={col.title}>
              <p className="font-sans text-[10px] uppercase tracking-widest text-stone/50 mb-5">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-sans text-xs text-stone hover:text-gold transition-colors"
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
          <span className="font-sans text-[10px] text-stone/40">
            {siteConfig.footer.copyright}
          </span>
          <div className="flex gap-6">
            {siteConfig.footer.legal.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-[10px] text-stone/40 hover:text-stone transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
