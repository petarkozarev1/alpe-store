import { redirect } from 'next/navigation'
import { isLocale } from '@/lib/i18n/config'
import { localizedPath } from '@/lib/i18n/routing'

export default function FramesPage({ params }: { params: { locale: string } }) {
  redirect(localizedPath('/shop', isLocale(params.locale) ? params.locale : 'bg'))
}
