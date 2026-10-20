import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { after } from 'next/server'
import { guardSubmission } from '@/lib/submission-guard'
import { deliverRequestNotification } from '@/lib/customer-notifications'

const adminOnly: Access = ({ req }) => req.user?.collection === 'admins'
const adminFieldOnly: FieldAccess = ({ req }) => req.user?.collection === 'admins'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: { singular: 'Yêu cầu tư vấn', plural: 'Yêu cầu tư vấn' },
  admin: {
    group: 'Khách hàng',
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'topic', 'status', 'notificationStatus', 'createdAt'],
  },
  access: {
    create: () => true,
    read: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  hooks: {
    beforeValidate: [async ({ data, operation, req }) => {
      if (operation === 'create' && !req.user) await guardSubmission(String(data?.email || ''), req.headers)
      return data
    }],
    afterChange: [async ({ doc, operation }) => {
      if (operation === 'create') {
        try { after(async () => { await deliverRequestNotification(Number(doc.id)) }) }
        catch { await deliverRequestNotification(Number(doc.id)) }
      }
      return doc
    }],
  },
  endpoints: [{ path: '/:id/retry-notification', method: 'post', handler: async (req) => {
    if (req.user?.collection !== 'admins') return Response.json({ message: 'Vui lòng đăng nhập quản trị.' }, { status: 401 })
    const origin = req.headers.get('origin')
    if (origin && origin !== new URL(req.url!).origin && origin !== process.env.NEXT_PUBLIC_SITE_URL) return Response.json({ message: 'Yêu cầu không hợp lệ.' }, { status: 403 })
    const id = Number(req.routeParams?.id)
    if (!Number.isSafeInteger(id) || id < 1) return Response.json({ message: 'Yêu cầu không hợp lệ.' }, { status: 400 })
    const sent = await deliverRequestNotification(id)
    return Response.json({ message: sent ? 'Đã gửi email. Tải lại để xem trạng thái mới.' : 'Chưa gửi: kiểm tra cấu hình SMTP, hoặc yêu cầu này đã được gửi/đang gửi.' })
  }}],
  fields: [
    { name: 'name', label: 'Họ và tên', type: 'text', required: true, minLength: 2, maxLength: 120 },
    { name: 'phone', label: 'Số điện thoại', type: 'text', required: true, maxLength: 20 },
    { name: 'email', label: 'Email', type: 'email', required: true, validate: (value: unknown) => typeof value === 'string' && value.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Email chưa hợp lệ.' },
    {
      name: 'topic',
      label: 'Nhu cầu',
      type: 'select',
      required: true,
      options: ['Mua sản phẩm', 'Tư vấn giải pháp', 'Báo giá dự án', 'Hỗ trợ kỹ thuật'],
    },
    { name: 'message', label: 'Nội dung', type: 'textarea', required: true, maxLength: 25000 },
    { name: 'notificationStatus', label: 'Email thông báo', type: 'select', defaultValue: 'pending', options: [{ label: 'Chờ gửi', value: 'pending' }, { label: 'Đang gửi', value: 'sending' }, { label: 'Đã gửi', value: 'sent' }, { label: 'Chưa gửi được', value: 'failed' }], access: { create: () => false, update: () => false }, admin: { readOnly: true } },
    { name: 'notificationError', label: 'Lỗi gửi thư', type: 'text', access: { create: () => false, update: () => false }, admin: { readOnly: true } },
    { name: 'notificationSentAt', label: 'Đã gửi lúc', type: 'date', access: { create: () => false, update: () => false }, admin: { readOnly: true } },
    { name: 'customerEmailSentAt', label: 'Email xác nhận cho khách đã gửi lúc', type: 'date', access: { create: () => false, update: () => false }, admin: { readOnly: true } },
    { name: 'notificationAttemptedAt', type: 'date', admin: { hidden: true }, access: { create: () => false, update: () => false } },
    { name: 'notificationLease', type: 'text', admin: { hidden: true }, access: { create: () => false, update: () => false } },
    { name: 'retryEmail', type: 'ui', admin: { components: { Field: '@/components/RetryNotification#RetryNotification' } } },
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
