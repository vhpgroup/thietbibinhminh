import type { Access, CollectionConfig, FieldAccess } from 'payload'

const adminOnly: Access = ({ req }) => req.user?.collection === 'admins'
const adminFieldOnly: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Yêu cầu tư vấn', plural: 'Yêu cầu tư vấn' },
  admin: {
    group: 'Khách hàng',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'topic', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', label: 'Họ và tên', type: 'text', required: true },
    { name: 'phone', label: 'Số điện thoại', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'topic',
      label: 'Nhu cầu',
      type: 'select',
      required: true,
      options: ['Mua sản phẩm', 'Tư vấn giải pháp', 'Báo giá dự án', 'Hỗ trợ kỹ thuật'],
    },
    { name: 'message', label: 'Nội dung', type: 'textarea', required: true },
    {
      name: 'status',
      label: 'Trạng thái xử lý',
      type: 'select',
      defaultValue: 'new',
      access: { create: () => false, update: adminFieldOnly },
      options: [
        { label: 'Mới', value: 'new' },
        { label: 'Đang xử lý', value: 'processing' },
        { label: 'Đã hoàn tất', value: 'done' },
      ],
    },
    {
      name: 'internalNote',
      label: 'Ghi chú nội bộ',
      type: 'textarea',
      access: { create: () => false, read: adminFieldOnly, update: adminFieldOnly },
    },
  ],
}
