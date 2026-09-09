import type { ReactNode } from 'react'
import { localizedNoIndexMetadata } from '@/lib/seo'

export function generateMetadata({ params }: { params: { locale: string } }) {
  return localizedNoIndexMetadata(params.locale, 'Количка')
}

export default function CartLayout({ children }: { children: ReactNode }) {
  return children
}
