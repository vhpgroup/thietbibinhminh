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
    defaultColumns: ['name', 'sku', 'price', 'priceVerified', 'stock', 'stockVerified', '_status'],
    components: { beforeList: ['@/components/CommercialReviewHelp#CommercialReviewHelp'] },
  },
  access: { read: publishedOrAdmin },
  versions: { drafts: true, maxPerDoc: 20 },
  hooks: {
    beforeChange: [({ data, originalDoc, req }) => {
      for (const key of ['price', 'stock'] as const) {
        const flag = `${key}Verified`
        if (originalDoc && data[key] !== undefined && data[key] !== originalDoc[key]) data[flag] = false
        if (data[flag] === true && (data[key] ?? originalDoc?.[key] ?? 0) < 0) data[flag] = false
        if (data[flag] === true && req.user && (data[flag] !== originalDoc?.[flag] || data[key] !== undefined)) data[`${key}VerifiedAt`] = new Date().toISOString()
        if (data[flag] === false) data[`${key}VerifiedAt`] = null
      }
      return data
    }],
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
            { name: 'secondaryCategories', label: 'Danh mục phụ', type: 'relationship', relationTo: 'product-categories', hasMany: true },
            { name: 'seoTitle', label: 'Tiêu đề SEO', type: 'text' },
            { name: 'seoDescription', label: 'Mô tả SEO', type: 'textarea' },
            { name: 'brand', label: 'Thương hiệu', type: 'relationship', relationTo: 'brands', required: true },
            { name: 'image', label: 'Ảnh đại diện', type: 'upload', relationTo: 'media', required: true },
            { name: 'gallery', label: 'Thư viện ảnh', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'sourceURL', label: 'Nguồn dữ liệu', type: 'text' },
            { name: 'shortSpec', label: 'Thông số ngắn', type: 'text' },
            { name: 'description', label: 'Mô tả', type: 'textarea' },
          ],
        },
        {
          label: 'Giá & kho',
          fields: [
            { name: 'price', label: 'Giá bán', type: 'number', required: true, min: 0 },
            { name: 'priceVerified', label: 'Đã xác nhận giá bán tại Bình Minh', type: 'checkbox', defaultValue: false, admin: { description: 'Chỉ bật sau khi kiểm tra giá thực tế. Giá chưa xác minh sẽ hiển thị Liên hệ báo giá.' } },
            { name: 'priceVerifiedAt', label: 'Lần xác nhận giá gần nhất', type: 'date', admin: { readOnly: true } },
            { name: 'oldPrice', label: 'Giá niêm yết', type: 'number', min: 0 },
            { name: 'badge', label: 'Nhãn khuyến mại', type: 'text' },
            { name: 'stock', label: 'Tồn kho', type: 'number', defaultValue: 0, min: 0 },
            { name: 'stockVerified', label: 'Đã kiểm đếm tồn kho tại Bình Minh', type: 'checkbox', defaultValue: false },
            { name: 'stockVerifiedAt', label: 'Lần kiểm đếm gần nhất', type: 'date', admin: { readOnly: true } },
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
