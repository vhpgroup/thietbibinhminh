import type { Access, CollectionConfig } from 'payload'
import { cacheTags, revalidateCollection, revalidateCollectionDelete } from '@/lib/cache-tags'

const publishedOrAdmin: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'Banner', plural: 'Banner trang chủ' },
  admin: {
    group: 'Nội dung',
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'order', '_status'],
  },
  access: { read: publishedOrAdmin },
  versions: { drafts: true, maxPerDoc: 15 },
  hooks: {
    afterChange: [revalidateCollection(cacheTags.banners)],
    afterDelete: [revalidateCollectionDelete(cacheTags.banners)],
  },
  fields: [
    { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
    { name: 'eyebrow', label: 'Dòng nhãn', type: 'text' },
    { name: 'accent', label: 'Dòng nhấn mạnh', type: 'text' },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'image', label: 'Ảnh banner', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'displayMode',
      label: 'Kiểu hiển thị',
      type: 'select',
      defaultValue: 'overlay',
      options: [
        { label: 'Ảnh kèm nội dung phủ', value: 'overlay' },
        { label: 'Chỉ hiển thị ảnh', value: 'image-only' },
      ],
    },
    { name: 'ctaLabel', label: 'Nhãn nút', type: 'text', defaultValue: 'Khám phá ngay' },
    { name: 'ctaURL', label: 'Liên kết nút', type: 'text', defaultValue: '/san-pham' },
    { name: 'active', label: 'Đang hiển thị', type: 'checkbox', defaultValue: true },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0 },
  ],
}
