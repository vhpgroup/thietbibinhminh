import type { Access, CollectionConfig } from 'payload'
import { cacheTags, revalidateCollection, revalidateCollectionDelete } from '@/lib/cache-tags'

const publishedOrAdmin: Access = ({ req }) =>
  req.user ? true : { _status: { equals: 'published' } }

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Sản phẩm', plural: 'Sản phẩm' },
  admin: {
    group: 'Cửa hàng',
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'category', 'price', 'stock', '_status'],
  },
  access: { read: publishedOrAdmin },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    afterChange: [revalidateCollection(cacheTags.products)],
    afterDelete: [revalidateCollectionDelete(cacheTags.products)],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin chính',
          fields: [
            { name: 'name', label: 'Tên sản phẩm', type: 'text', required: true },
            { name: 'slug', label: 'Đường dẫn', type: 'text', required: true, unique: true, index: true },
            { name: 'sku', label: 'Mã sản phẩm', type: 'text', required: true, unique: true, index: true },
            { name: 'category', label: 'Danh mục', type: 'relationship', relationTo: 'product-categories', required: true },
            { name: 'brand', label: 'Thương hiệu', type: 'relationship', relationTo: 'brands', required: true },
            { name: 'image', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', required: true },
            { name: 'shortSpec', label: 'Thông số ngắn', type: 'text' },
            { name: 'description', label: 'Mô tả', type: 'textarea' },
          ],
        },
        {
          label: 'Giá & kho',
          fields: [
            { name: 'price', label: 'Giá bán', type: 'number', required: true, min: 0 },
            { name: 'oldPrice', label: 'Giá niêm yết', type: 'number', min: 0 },
            { name: 'badge', label: 'Nhãn khuyến mại', type: 'text' },
            { name: 'stock', label: 'Tồn kho', type: 'number', defaultValue: 0, min: 0 },
            { name: 'featured', label: 'Sản phẩm nổi bật', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          label: 'Thông số',
          fields: [
            {
              name: 'highlights',
              label: 'Điểm nổi bật',
              type: 'array',
              fields: [{ name: 'text', label: 'Nội dung', type: 'text', required: true }],
            },
            {
              name: 'specs',
              label: 'Bảng thông số',
              type: 'array',
              fields: [
                { name: 'label', label: 'Thông số', type: 'text', required: true },
                { name: 'value', label: 'Giá trị', type: 'text', required: true },
              ],
            },
            { name: 'rating', label: 'Điểm đánh giá', type: 'number', defaultValue: 5, min: 0, max: 5 },
            { name: 'reviews', label: 'Số đánh giá', type: 'number', defaultValue: 0, min: 0 },
          ],
        },
      ],
    },
  ],
}
