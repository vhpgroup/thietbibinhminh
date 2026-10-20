import type { MetadataRoute } from 'next'
import { siteURL } from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const local = /^(localhost|127\.0\.0\.1)$/.test(new URL(siteURL()).hostname)
  return {
    rules: { userAgent: '*', allow: local ? undefined : '/', disallow: local ? ['/'] : ['/admin', '/api/', '/gio-hang'] },
    sitemap: siteURL('/sitemap.xml'),
  }
}
