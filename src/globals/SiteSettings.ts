import type { GlobalConfig } from 'payload'
import { cacheTags, revalidateGlobal } from '@/lib/cache-tags'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cấu hình website',
  admin: { group: 'Cấu hình' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal(cacheTags.settings)] },
  fields: [
    { name: 'announcement', label: 'Thanh thông báo', type: 'text', defaultValue: 'HỆ SINH THÁI CÔNG NGHỆ 2027' },
    { name: 'shippingMessage', label: 'Thông báo giao hàng', type: 'text', defaultValue: 'Miễn phí giao hàng toàn quốc cho đơn từ 1 triệu' },
    { name: 'hotline', label: 'Hotline', type: 'text', defaultValue: '1800 6868' },
    { name: 'email', label: 'Email', type: 'email', defaultValue: 'hello@binhminh.vn' },
    { name: 'address', label: 'Địa chỉ', type: 'text', defaultValue: 'Hà Nội, Việt Nam' },
    { name: 'footerDescription', label: 'Mô tả chân trang', type: 'textarea' },
  ],
}
