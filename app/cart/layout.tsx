import type { ReactNode } from 'react'
import { noIndexMetadata } from '@/lib/seo'

export const metadata = noIndexMetadata('Количка')

export default function CartLayout({ children }: { children: ReactNode }) {
  return children
}
