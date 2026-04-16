import type { ReactNode } from 'react'

interface SectionWrapperProps {
  children: ReactNode
  id?: string
  className?: string
  dark?: boolean
}

export default function SectionWrapper({ children, id, className = '', dark = false }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`w-full py-24 md:py-20 ${dark ? 'bg-brand-black text-white' : 'bg-white text-brand-black'} ${className}`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10">
        {children}
      </div>
    </section>
  )
}
