'use server'

import { getPayloadClient } from '@/lib/payload'

export type ContactState = { success: boolean; message: string; errors?: Record<string, string> }
const topics = ['Mua sản phẩm', 'Tư vấn giải pháp', 'Báo giá dự án', 'Hỗ trợ kỹ thuật']

export async function submitContact(_: ContactState, formData: FormData): Promise<ContactState> {
  const value = (name: string) => String(formData.get(name) ?? '').trim()
  const name = value('name')
  const phone = value('phone')
  const email = value('email')
  const topic = value('topic')
  const message = value('message')
  const errors: Record<string, string> = {}
  if (name.length < 2 || name.length > 120) errors.name = 'Vui lòng nhập họ tên hợp lệ.'
  if (!/^[0-9+\s().-]{8,20}$/.test(phone)) errors.phone = 'Số điện thoại chưa hợp lệ.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) errors.email = 'Email chưa hợp lệ.'
  if (!topics.includes(topic)) errors.topic = 'Nhu cầu tư vấn chưa hợp lệ.'
  if (message.length < 10 || message.length > 3000) errors.message = 'Nội dung cần từ 10 đến 3000 ký tự.'
  if (Object.keys(errors).length) return { success: false, message: 'Vui lòng kiểm tra lại thông tin.', errors }
  const payload = await getPayloadClient()
  await payload.create({
    collection: 'contact-submissions',
    data: { name, phone, email, topic: topic as 'Mua sản phẩm' | 'Tư vấn giải pháp' | 'Báo giá dự án' | 'Hỗ trợ kỹ thuật', message },
    overrideAccess: false,
  })
  return { success: true, message: 'Đã nhận yêu cầu. Bình Minh sẽ liên hệ với bạn sớm nhất.' }
}
