import type { CollectionConfig } from 'payload'
import { cacheTags, revalidateCollection, revalidateCollectionDelete } from '@/lib/cache-tags'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Bài viết', plural: 'Tin tức & bài viết' },
  admin: {
    group: 'Nội dung',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', 'featured', '_status'],
  },
  access: {
    read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
  },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    afterChange: [revalidateCollection(cacheTags.posts)],
    afterDelete: [revalidateCollectionDelete(cacheTags.posts)],
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
    },
    { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, unique: true, index: true },
    { name: 'excerpt', label: 'Mô tả ngắn', type: 'textarea' },
    { name: 'category', label: 'Chuyên mục', type: 'relationship', relationTo: 'article-categories', required: true },
    { name: 'heroImage', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', required: true },
    { name: 'publishedAt', label: 'Ngày xuất bản', type: 'date', required: true },
    { name: 'featured', label: 'Tin nổi bật', type: 'checkbox', defaultValue: false },
    {
      name: 'content',
      label: 'Nội dung',
      type: 'richText',
    },
  ],
}
