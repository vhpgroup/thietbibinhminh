import type { CollectionConfig } from 'payload'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  labels: { singular: 'Danh mục sản phẩm', plural: 'Danh mục sản phẩm' },
  admin: {
    group: 'Cửa hàng',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order'],
  },
  access: { read: () => true },
  fields: [
    { name: 'name', label: 'Tên danh mục', type: 'text', required: true },
    { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, unique: true, index: true },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'icon', label: 'Tên biểu tượng', type: 'text' },
    { name: 'order', label: 'Thứ tự', type: 'number', defaultValue: 0 },
  ],
}
