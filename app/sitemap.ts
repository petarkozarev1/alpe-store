import type { MetadataRoute } from 'next'
import { absoluteUrl, indexableRoutes, seoLastModified } from '@/lib/seo'
import { localizedPath } from '@/lib/i18n/routing'

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.flatMap((route) => (['bg', 'en'] as const).map(locale => ({
    url: absoluteUrl(localizedPath(route, locale)),
    lastModified: seoLastModified,
    changeFrequency: route === '' || route === '/shop' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : route === '/shop' ? 0.9 : route.startsWith('/product/') ? 0.8 : 0.7,
    alternates: {
      languages: {
        'bg-BG': absoluteUrl(localizedPath(route, 'bg')),
        en: absoluteUrl(localizedPath(route, 'en')),
      },
    },
  })))
}
