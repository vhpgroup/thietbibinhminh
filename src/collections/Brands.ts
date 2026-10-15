import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Thương hiệu', plural: 'Thương hiệu' },
  admin: {
    group: 'Cửa hàng',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Tên thương hiệu', type: 'text', required: true },
    { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, unique: true, index: true },
    { name: 'logo', label: 'Logo', type: 'upload', relationTo: 'media' },
    { name: 'website', label: 'Website', type: 'text' },
  ],
}
