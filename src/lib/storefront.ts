import { unstable_cache } from 'next/cache'
import { getPayloadClient } from '@/lib/payload'
import { cacheTags } from '@/lib/cache-tags'
import type { Banner, Brand, Media, Post, Product, ProductCategory, SiteSetting } from '@/payload-types'

export type StoreMedia = { url: string; alt: string; width: number; height: number }

export type StoreProduct = {
  id: string
  name: string
  slug: string
  sku: string
  category: string
  brand: string
  image: StoreMedia | null
  price: number
  oldPrice?: number | null
  badge?: string | null
  shortSpec?: string | null
  stock: number
  rating: number
  reviews: number
  description?: string | null
  highlights: string[]
  specs: { label: string; value: string }[]
  featured: boolean
}

export type StorePost = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  category: string
  image: StoreMedia | null
  publishedAt: string
  featured: boolean
}

export type StoreBanner = {
  id: string
  title: string
  eyebrow?: string | null
  accent?: string | null
  description?: string | null
  image: StoreMedia | null
  displayMode?: 'overlay' | 'image-only' | null
  ctaLabel?: string | null
  ctaURL?: string | null
}

const mediaView = (value: string | Media | null | undefined): StoreMedia | null => {
  if (!value || typeof value === 'string' || !value.url) return null
  return {
    url: value.url,
    alt: value.alt,
    width: value.width ?? 1200,
    height: value.height ?? 800,
  }
}

const relationName = (value: string | ProductCategory | Brand | null | undefined) =>
  value && typeof value === 'object' ? value.name : ''

const productView = (product: Product): StoreProduct => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  sku: product.sku,
  category: relationName(product.category),
  brand: relationName(product.brand),
  image: mediaView(product.image),
  price: product.price,
  oldPrice: product.oldPrice,
  badge: product.badge,
  shortSpec: product.shortSpec,
  stock: product.stock ?? 0,
  rating: product.rating ?? 5,
  reviews: product.reviews ?? 0,
  description: product.description,
  highlights: product.highlights?.map((item) => item.text) ?? [],
  specs: product.specs?.map((item) => ({ label: item.label, value: item.value })) ?? [],
  featured: product.featured ?? false,
})

const getProductsCached = unstable_cache(async (): Promise<StoreProduct[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 2,
    limit: 100,
    sort: '-featured,name',
  })
  return result.docs.map(productView)
}, ['store-products'], { tags: [cacheTags.products] })

export const getProducts = () => getProductsCached()

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  return unstable_cache(async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 2,
      limit: 1,
      where: { slug: { equals: slug } },
    })
    return result.docs[0] ? productView(result.docs[0]) : null
  }, ['store-product', slug], { tags: [cacheTags.products, `${cacheTags.products}:${slug}`] })()
}

const getPostsCached = unstable_cache(async (): Promise<StorePost[]> => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    overrideAccess: false,
    depth: 2,
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
    depth: 2,
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
