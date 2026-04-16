'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/lib/data/site'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-brand-border">
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-7 h-7 rounded-full bg-brand-black flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-white" />
          </span>
          {siteConfig.brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {siteConfig.nav.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-brand-black hover:opacity-60 transition-opacity"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button label="Buy Now" href="/shop" variant="pill" />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-brand-black transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-brand-black transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-brand-black transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden md:hidden border-t border-brand-border bg-white"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {siteConfig.nav.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium py-1"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button label="Buy Now" href="/shop" variant="pill" className="w-fit mt-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
