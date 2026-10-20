import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/cache-tags'

export const Policies: GlobalConfig = {
  slug: 'policies', label: 'Chính sách khách hàng', access: { read: () => true },
  admin: { group: 'Nội dung' }, hooks: { afterChange: [revalidateGlobal('policies')] },
  fields: [{ name: 'pages', label: 'Các trang chính sách', type: 'array', fields: [
    { name: 'slug', label: 'Đường dẫn', type: 'text', required: true },
    { name: 'title', label: 'Tiêu đề', type: 'text', required: true },
    { name: 'summary', label: 'Mô tả ngắn', type: 'text' },
    { name: 'content', label: 'Nội dung (mỗi đoạn cách nhau một dòng trống)', type: 'textarea', required: true },
  ] }],
}
