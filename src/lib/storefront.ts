import { cache } from 'react'
import { verifiedCommerce } from '@/lib/catalog-verification'
import { unstable_cache } from 'next/cache'
import { slugCandidates } from '@/lib/slug'
import { getPayloadClient } from '@/lib/payload'
import { cacheTags } from '@/lib/cache-tags'
import type { CategoryIcon } from '@/lib/home-categories'
import { descendantIds } from '@/lib/category-tree'
import type { Banner, Brand, Media, Post, Product, ProductCategory, SiteSetting } from '@/payload-types'
import type { Where } from 'payload'

export type StoreMedia = { url: string; alt: string; width: number; height: number }

export type StoreProduct = {
  id: string | number
  name: string
  slug: string
  sku: string
  category: string
  categorySlug: string
  brand: string
  image: StoreMedia | null
  gallery: StoreMedia[]
  price: number
  oldPrice?: number | null
  badge?: string | null
  shortSpec?: string | null
  stock: number | null
  priceVerified: boolean
  stockVerified: boolean
  rating: number
  reviews: number
  description?: string | null
  highlights: string[]
  specs: { label: string; value: string }[]
  featured: boolean
}

export type StorePost = {
  id: string | number
  title: string
  slug: string
  excerpt?: string | null
  category: string
  image: StoreMedia | null
  publishedAt: string
  featured: boolean
}

export type StoreBanner = {
  id: string | number
  title: string
  eyebrow?: string | null
  accent?: string | null
  description?: string | null
  image: StoreMedia | null
  displayMode?: 'overlay' | 'image-only' | null
  ctaLabel?: string | null
  ctaURL?: string | null
}

export const mediaView = (value: string | number | Media | null | undefined): StoreMedia | null => {
  if (!value || typeof value !== 'object' || !(value.externalURL || value.url)) return null
  const importedFilename = /^hpt-\d+-(.+)$/.exec(value.filename || '')
  const sourceMedia = /^https:\/\/hpttech\.vn\/api\/(?:media\/file|r2-media)\/([^/?#]+)/i.exec(value.url || '')
  return {
    url: value.externalURL || (importedFilename ? `/r2/${encodeURIComponent(importedFilename[1])}` : sourceMedia ? `/r2/${sourceMedia[1]}` : value.url!),
    alt: value.alt,
    width: value.width ?? 1200,
    height: value.height ?? 800,
  }
}

const relationName = (value: string | number | ProductCategory | Brand | null | undefined) =>
  value && typeof value === 'object' ? value.name : ''

const productView = (product: Product): StoreProduct => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  sku: product.sku,
  category: relationName(product.category),
  categorySlug: product.category && typeof product.category === 'object' ? product.category.slug : '',
  brand: relationName(product.brand),
  image: mediaView(product.image),
  gallery: (product.gallery || []).map(mediaView).filter((item): item is StoreMedia => !!item),
  price: verifiedCommerce(product).price,
  oldPrice: verifiedCommerce(product).oldPrice,
  priceVerified: product.priceVerified === true,
  stockVerified: product.stockVerified === true,
  badge: product.priceVerified ? product.badge : null,
  shortSpec: product.shortSpec,
  stock: verifiedCommerce(product).stock,
  rating: product.rating ?? 5,
  reviews: product.reviews ?? 0,
  description: product.description,
  highlights: product.highlights?.map((item) => item.text) ?? [],
  specs: product.specs?.map((item) => ({ label: item.label, value: item.value })) ?? [],
  featured: product.featured ?? false,
})

const cardSelect = { gallery: false, specs: false, highlights: false, description: false } as const

const getProductsCached = unstable_cache(async (): Promise<StoreProduct[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    select: cardSelect,
    limit: 12,
    sort: ['-featured', 'name'],
  })
  return result.docs.map(productView)
}, ['store-products'], { tags: [cacheTags.products] })

export const getProducts = () => getProductsCached()

const getHomeContentCached = unstable_cache(async () => {
  const payload = await getPayloadClient()
  const groups = await getHomeCategories()
  const categories = await payload.find({
    collection: 'product-categories', overrideAccess: false, limit: 1000,
  })
  const categoryIds = new Map(categories.docs.map((item) => [item.slug, item.id]))
  const [dealsResult, ...sectionResults] = await Promise.all([
    payload.find({
      collection: 'products', overrideAccess: false, select: cardSelect, depth: 1, limit: 30,
      sort: '-oldPrice',
      where: { and: [{ oldPrice: { greater_than: 0 } }, { priceVerified: { equals: true } }] },
    }),
    ...groups.map((section) => {
      const ids = section.slugs.map((slug) => categoryIds.get(slug)).filter((id): id is number => typeof id === 'number')
      return payload.find({
        collection: 'products', overrideAccess: false, select: cardSelect, depth: 1, limit: 20,
        sort: ['-featured', 'name'],
        where: { category: { in: ids } },
      })
    }),
  ])
  return {
    deals: dealsResult.docs.map(productView).filter((item) => item.price > 0 && !!item.oldPrice && item.oldPrice > item.price).slice(0, 5),
    sections: sectionResults.map((result, index) => ({
      key: groups[index].key,
      products: result.docs.map(productView).slice(0, 5),
    })),
  }
}, ['home-content'], { tags: [cacheTags.products] })

export const getHomeContent = () => getHomeContentCached()

const getHomeCategoriesCached = unstable_cache(async () => {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'product-categories', limit: 1000, depth: 0, sort: ['order', 'name'], overrideAccess: false })
  return result.docs.filter((item) => !item.parent && item.showInMenu).map((root) => {
    const children = result.docs.filter((item) => item.parent === root.id && item.showInMenu)
    const ids = descendantIds(result.docs, root.id)
    return { key: root.slug, name: root.name, icon: (root.icon || 'menu') as CategoryIcon, primary: root.slug,
      slugs: result.docs.filter((item) => ids.includes(item.id)).map((item) => item.slug),
      links: children.map((item) => [item.name, item.slug] as [string, string]),
      groups: children.map((item) => ({ name: item.name, slug: item.slug, links: result.docs.filter((leaf) => leaf.parent === item.id && leaf.showInMenu).map((leaf) => ({ name: leaf.name, slug: leaf.slug, children: result.docs.filter((child) => child.parent === leaf.id && child.showInMenu).map((child) => ({ name: child.name, slug: child.slug })) })) })) }
  })
}, ['home-category-tree'], { tags: [cacheTags.products], revalidate: 300 })
export const getHomeCategories = () => getHomeCategoriesCached()

export type CatalogFilters = {
  search: string
  category: string
  brand: string
  sort: string
  page: number
}

const getCatalogOptions = unstable_cache(async () => {
  const payload = await getPayloadClient()
  return Promise.all([
    payload.find({ collection: 'product-categories', overrideAccess: false, limit: 1000, depth: 0, sort: ['order', 'name'] }),
    payload.find({ collection: 'brands', overrideAccess: false, limit: 300, sort: 'name' }),
  ])
}, ['catalog-options'], { tags: [cacheTags.products], revalidate: 300 })

const getCatalogBrandIds = unstable_cache(async (conditions: Where[]) => {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'products', overrideAccess: false, depth: 0, pagination: false, select: { brand: true }, ...(conditions.length ? { where: { and: conditions } } : {}) })
  return [...new Set(result.docs.map((item) => typeof item.brand === 'object' ? item.brand?.id : item.brand))]
}, ['catalog-brand-ids'], { tags: [cacheTags.products], revalidate: 300 })

const getCatalogPageCached = unstable_cache(async (filters: CatalogFilters) => {
  const payload = await getPayloadClient()
  const [categoriesResult, brandsResult] = await getCatalogOptions()
  const category = categoriesResult.docs.find((item) => item.slug === filters.category)
  const brand = brandsResult.docs.find((item) => item.slug === filters.brand)
  const conditions: Where[] = []
  if (filters.search) conditions.push({ or: [
    { name: { contains: filters.search } },
    { sku: { contains: filters.search } },
    { shortSpec: { contains: filters.search } },
  ] })
  if (category) {
    const ids = descendantIds(categoriesResult.docs, category.id)
    conditions.push({ or: [{ category: { in: ids } }, { secondaryCategories: { in: ids } }] })
  }
  const brandIdsPromise = getCatalogBrandIds([...conditions])
  if (brand) conditions.push({ brand: { equals: brand.id } })
  const sort = filters.sort === 'price-asc' ? 'price' : filters.sort === 'price-desc' ? '-price' : filters.sort === 'rating' ? '-rating' : ['-featured', 'name']
  if (filters.sort === 'price-asc' || filters.sort === 'price-desc') conditions.push({ and: [{ priceVerified: { equals: true } }, { price: { greater_than: 0 } }] })
  const [result, availableBrandIds] = await Promise.all([payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    select: cardSelect,
    limit: 25,
    page: filters.page,
    sort,
    ...(conditions.length ? { where: { and: conditions } } : {}),
  }), brandIdsPromise])
  const brandIds = new Set(availableBrandIds)
  return {
    products: result.docs.map(productView),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? 1,
    categories: categoriesResult.docs.filter((item) => item.showInMenu).map((item) => ({ id: item.id, name: item.name, slug: item.slug, parent: typeof item.parent === 'object' ? item.parent?.id ?? null : item.parent ?? null })),
    brands: brandsResult.docs.filter((item) => brandIds.has(item.id)).map((item) => ({ name: item.name, slug: item.slug })),
  }
}, ['catalog-page-v2'], { tags: [cacheTags.products], revalidate: 300 })

export const getCatalogPage = (filters: CatalogFilters) => getCatalogPageCached(filters)

export const getProductBySlug = cache(async (slug: string): Promise<StoreProduct | null> => {
  return unstable_cache(async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 1,
      limit: 1,
      where: { slug: { in: slugCandidates(slug) } },
    })
    return result.docs[0] ? productView(result.docs[0]) : null
  }, ['store-product', slug], { tags: [cacheTags.products, `${cacheTags.products}:${slug}`] })()
})

export async function getRelatedProducts(product: StoreProduct) {
  if (!product.categorySlug) return []
  const payload = await getPayloadClient()
  const category = await payload.find({ collection: 'product-categories', where: { slug: { equals: product.categorySlug } }, limit: 1, depth: 0, overrideAccess: false })
  if (!category.docs[0]) return []
  const result = await payload.find({ collection: 'products', where: { and: [{ category: { equals: category.docs[0].id } }, { id: { not_equals: product.id } }] }, select: cardSelect, limit: 5, depth: 1, sort: ['-featured', 'name'], overrideAccess: false })
  return result.docs.map(productView)
}

const getPostsCached = unstable_cache(async (): Promise<StorePost[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    overrideAccess: false,
    depth: 1,
    limit: 100,
    sort: '-publishedAt',
  })
  return result.docs.map((post: Post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category && typeof post.category === 'object' ? post.category.name : '',
    image: mediaView(post.heroImage),
    publishedAt: post.publishedAt,
    featured: post.featured ?? false,
  }))
}, ['store-posts'], { tags: [cacheTags.posts] })

export const getPosts = () => getPostsCached()

const getBannersCached = unstable_cache(async (): Promise<StoreBanner[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'banners',
    overrideAccess: false,
    depth: 1,
    limit: 20,
    sort: 'order',
    where: { active: { equals: true } },
  })
  return result.docs.map((banner: Banner) => ({
    id: banner.id,
    title: banner.title,
    eyebrow: banner.eyebrow,
    accent: banner.accent,
    description: banner.description,
    image: mediaView(banner.image),
    displayMode: banner.displayMode,
    ctaLabel: banner.ctaLabel,
    ctaURL: banner.ctaURL,
  }))
}, ['store-banners'], { tags: [cacheTags.banners] })

export const getBanners = () => getBannersCached()

const getSiteSettingsCached = unstable_cache(async (): Promise<SiteSetting> => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'site-settings', overrideAccess: false })
}, ['site-settings'], { tags: [cacheTags.settings] })

export const getSiteSettings = () => getSiteSettingsCached()
