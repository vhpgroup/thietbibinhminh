import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { siteURL } from '@/lib/site-url'
import { getPolicies } from '@/lib/policies'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayloadClient()
  const [products, categories, posts, policies] = await Promise.all([
    payload.find({ collection: 'products', overrideAccess: false, depth: 0, limit: 50000, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'product-categories', overrideAccess: false, depth: 0, limit: 5000, where: { and: [{ showInMenu: { equals: true } }, { indexable: { not_equals: false } }] }, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'posts', overrideAccess: false, depth: 0, limit: 50000, select: { slug: true, updatedAt: true } }),
    getPolicies(),
  ])
  return [
    ...['/', '/san-pham', '/tin-tuc', '/gioi-thieu', '/lien-he', ...policies.map(p => `/chinh-sach/${p.slug}`)].map(path => ({ url: siteURL(path) })),
    ...products.docs.map(p => ({ url: siteURL(`/san-pham/${p.slug}`), lastModified: p.updatedAt })),
    ...categories.docs.map(p => ({ url: siteURL(`/danh-muc/${p.slug}`), lastModified: p.updatedAt })),
    ...posts.docs.map(p => ({ url: siteURL(`/tin-tuc/${p.slug}`), lastModified: p.updatedAt })),
  ]
}
