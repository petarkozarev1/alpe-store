'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { siteConfig } from '@/lib/data/site'
import { useCartStore } from '@/lib/store/cartStore'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { items, openDrawer } = useCartStore()
  const itemCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full bg-cream border-b border-stone/30">
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-serif text-xl text-gold tracking-widest flex-1">
          {siteConfig.brand}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {siteConfig.nav.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="font-sans text-xs uppercase tracking-widest text-stone hover:text-onyx transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right: cart */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-6">
          <button
            onClick={openDrawer}
            aria-label="Отвори количката"
            className="relative text-stone hover:text-onyx transition-colors"
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

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-5">
          <button onClick={openDrawer} aria-label="Отвори количката" className="relative text-stone hover:text-onyx">
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
          <button
            className="flex flex-col gap-1.5 p-1"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Меню"
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-px bg-onyx transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`block w-5 h-px bg-onyx transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-onyx transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
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
            className="overflow-hidden md:hidden border-t border-stone/30 bg-cream"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {siteConfig.nav.map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="font-sans text-xs uppercase tracking-widest text-stone hover:text-onyx transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
