import type { MetadataRoute } from 'next'
import { absoluteUrl, indexableRoutes, seoLastModified } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  return indexableRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: seoLastModified,
    changeFrequency: route === '' || route === '/shop' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : route === '/shop' ? 0.9 : route.startsWith('/product/') ? 0.8 : 0.7,
  }))
}
