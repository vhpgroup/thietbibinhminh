import type { CollectionConfig } from 'payload'

export const ArticleCategories: CollectionConfig = {
  slug: 'article-categories',
  labels: { singular: 'Chuyên mục', plural: 'Chuyên mục tin tức' },
  admin: { group: 'Nội dung', useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Tên chuyên mục', type: 'text', required: true },
    { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, unique: true, index: true },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0 },
  ],
}
