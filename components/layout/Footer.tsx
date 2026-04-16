import Link from 'next/link'
import { siteConfig } from '@/lib/data/site'

export default function Footer() {
  return (
    <footer className="bg-brand-footer text-white">
      {/* Main footer row */}
      <div className="max-w-content mx-auto px-6 md:px-10 pt-16 pb-8 flex flex-col md:flex-row md:items-start justify-between gap-10">

        {/* Brand */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-brand-black" />
            </span>
            {siteConfig.brand}
          </Link>
          <p className="text-sm text-white/60">{siteConfig.footer.tagline}</p>
        </div>

        {/* Links */}
        <div className="flex gap-16">
          <div>
            <p className="text-sm font-semibold mb-4 text-white/40 uppercase tracking-wider">Pages Link</p>
            <ul className="flex flex-col gap-3">
              {siteConfig.footer.pages.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-4 text-white/40 uppercase tracking-wider">Social Media</p>
            <ul className="flex flex-col gap-3">
              {siteConfig.footer.social.map(link => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div className="overflow-hidden px-2">
        <p className="text-[clamp(80px,12vw,160px)] font-extrabold leading-none tracking-tighter text-[#2a2a2a] select-none whitespace-nowrap">
          {siteConfig.brand.toUpperCase()}
        </p>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10 max-w-content mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row justify-between gap-2 text-xs text-white/40">
        <span>{siteConfig.brand} © 2026 – All Rights Reserved</span>
        <span>Template By Charles Owoeye</span>
      </div>
    </footer>
  )
}
