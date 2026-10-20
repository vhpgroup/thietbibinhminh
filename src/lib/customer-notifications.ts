import nodemailer from 'nodemailer'
import { randomUUID } from 'node:crypto'
import { requestPool } from './request-db'

export const salesEmail = 'kinhdoanh@thietbibinhminh.com.vn'

export async function deliverRequestNotification(id: number) {
  const lease = randomUUID()
  const claimed = await requestPool.query(`UPDATE contact_submissions SET notification_status='sending', notification_lease=$2, notification_attempted_at=now()
    WHERE id=$1 AND (notification_status IS NULL OR notification_status IN ('pending','failed') OR (notification_status='sending' AND notification_attempted_at < now()-interval '5 minutes')) RETURNING *`, [id, lease])
  const doc = claimed.rows[0]
  if (!doc) return false
  let errorMessage = ''
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_FROM || (process.env.SMTP_USER && !process.env.SMTP_PASSWORD)) throw new Error('Chưa cấu hình đầy đủ tài khoản SMTP. Yêu cầu đã được lưu; cấu hình email rồi gửi lại.')
    const port = Number(process.env.SMTP_PORT || 587)
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port, secure: port === 465,
      requireTLS: port !== 465 && process.env.SMTP_ALLOW_INSECURE !== 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD } : undefined,
      connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000,
    })
    // A stable Message-ID helps mail servers identify retries after an uncertain delivery.
    if (!doc.notification_sent_at) {
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SALES_NOTIFICATION_EMAIL || salesEmail,
      replyTo: doc.email,
      messageId: `<binhminh-request-${id}@thietbibinhminh.com.vn>`,
      subject: `[Bình Minh #${id}] ${doc.topic}`,
      text: [`Yêu cầu khách hàng #${id}`, `Họ tên: ${doc.name}`, `Điện thoại: ${doc.phone}`, `Email: ${doc.email}`, `Nhu cầu: ${doc.topic}`, '', doc.message, '', 'Đăng nhập quản trị để cập nhật trạng thái xử lý.'].join('\n'),
    })
    await requestPool.query('UPDATE contact_submissions SET notification_sent_at=now() WHERE id=$1 AND notification_lease=$2', [id, lease])
    }
    if (!doc.customer_email_sent_at) {
      await transport.sendMail({
        from: process.env.SMTP_FROM, to: doc.email,
        messageId: `<binhminh-receipt-${id}@thietbibinhminh.com.vn>`,
        subject: `Bình Minh đã tiếp nhận yêu cầu #${id}`,
        text: `Bình Minh đã nhận được yêu cầu #${id} gửi từ website. Nhân viên sẽ liên hệ theo thông tin bạn đã cung cấp để tư vấn và xác nhận. Đây là xác nhận tiếp nhận, chưa phải xác nhận đơn hàng hoặc thanh toán.\n\nHỗ trợ: 0876 645 432\nEmail: kinhdoanh@thietbibinhminh.com.vn\nNếu bạn không gửi yêu cầu này, vui lòng bỏ qua email.`,
      })
      await requestPool.query('UPDATE contact_submissions SET customer_email_sent_at=now() WHERE id=$1 AND notification_lease=$2', [id, lease])
    }
  } catch (error) {
    // Do not persist SMTP responses, which can contain credentials or customer details.
    errorMessage = process.env.SMTP_HOST && process.env.SMTP_FROM && (!process.env.SMTP_USER || process.env.SMTP_PASSWORD) ? 'Gửi email chưa thành công. Kiểm tra kết nối và cấu hình SMTP rồi gửi lại.' : 'Chưa cấu hình đầy đủ SMTP hoặc thiếu mật khẩu hộp thư.'
  }
  await requestPool.query(`UPDATE contact_submissions SET notification_status=$3::enum_contact_submissions_notification_status, notification_error=$4 WHERE id=$1 AND notification_lease=$2`, [id, lease, errorMessage ? 'failed' : 'sent', errorMessage || null])
  return !errorMessage
}
