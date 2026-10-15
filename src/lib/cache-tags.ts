import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

export const cacheTags = {
  banners: 'banners',
  posts: 'posts',
  products: 'products',
  settings: 'site-settings',
}

export const revalidateCollection =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc, previousDoc }) => {
    revalidateTag(tag, 'max')
    if (typeof doc?.slug === 'string') revalidateTag(`${tag}:${doc.slug}`, 'max')
    if (typeof previousDoc?.slug === 'string' && previousDoc.slug !== doc?.slug) {
      revalidateTag(`${tag}:${previousDoc.slug}`, 'max')
    }
    return doc
  }

export const revalidateCollectionDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc }) => {
    revalidateTag(tag, 'max')
    if (typeof doc?.slug === 'string') revalidateTag(`${tag}:${doc.slug}`, 'max')
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc }) => {
    revalidateTag(tag, 'max')
    return doc
  }
