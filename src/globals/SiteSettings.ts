import type { GlobalConfig } from 'payload'
import { cacheTags, revalidateGlobal } from '@/lib/cache-tags'
import { companyDetails } from '@/lib/company'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Cấu hình website',
  admin: { group: 'Cấu hình' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal(cacheTags.settings)] },
  fields: [
    { name: 'announcement', label: 'Thanh thông báo', type: 'text', defaultValue: 'HỆ SINH THÁI CÔNG NGHỆ 2027' },
    { name: 'shippingMessage', label: 'Thông báo giao hàng', type: 'text', defaultValue: 'Tư vấn giao hàng và lắp đặt theo nhu cầu' },
    { name: 'companyName', label: 'Tên doanh nghiệp', type: 'text', defaultValue: companyDetails.companyName },
    { name: 'businessCode', label: 'Mã số doanh nghiệp', type: 'text', defaultValue: companyDetails.businessCode },
    { name: 'legalRepresentative', label: 'Người đại diện', type: 'text', defaultValue: companyDetails.legalRepresentative },
    { name: 'representativeTitle', label: 'Chức vụ', type: 'text', defaultValue: companyDetails.representativeTitle },
    { name: 'hotline', label: 'Hotline', type: 'text', defaultValue: companyDetails.hotline },
    { name: 'email', label: 'Email', type: 'email', defaultValue: 'kinhdoanh@thietbibinhminh.com.vn' },
    { name: 'address', label: 'Địa chỉ', type: 'text', defaultValue: companyDetails.address },
    { name: 'footerDescription', label: 'Mô tả chân trang', type: 'textarea' },
  ],
}
