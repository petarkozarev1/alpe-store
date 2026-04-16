'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

type ButtonVariant = 'primary' | 'outlined-black' | 'outlined-white' | 'pill'

interface ButtonProps {
  label: string
  href?: string
  onClick?: () => void
  variant?: ButtonVariant
  className?: string
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-black text-white hover:bg-neutral-800 rounded-xl px-6 py-3',
  'outlined-black': 'border border-brand-black text-brand-black hover:bg-brand-black hover:text-white rounded-xl px-6 py-3',
  'outlined-white': 'border border-white text-white hover:bg-white hover:text-brand-black rounded-xl px-6 py-3',
  pill: 'bg-brand-black text-white hover:bg-neutral-800 rounded-full px-5 py-2',
}

export default function Button({ label, href, onClick, variant = 'primary', className = '' }: ButtonProps) {
  const classes = `inline-flex items-center gap-2 font-medium text-sm transition-colors ${variantClasses[variant]} ${className}`

  if (href) {
    return (
      <motion.div whileHover={{ scale: 0.97 }} whileTap={{ scale: 0.95 }}>
        <Link href={href} className={classes}>{label} →</Link>
      </motion.div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 0.97 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={classes}
    >
      {label} →
    </motion.button>
  )
}
