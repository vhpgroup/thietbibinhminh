'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { useState } from 'react'

export function RetryNotification() {
  const { id } = useDocumentInfo()
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  if (!id) return null
  return <div style={{ marginBottom: 24 }}><button type="button" disabled={busy} onClick={async () => {
    setBusy(true)
    try {
      const response = await fetch(`/api/contact-submissions/${id}/retry-notification`, { method: 'POST' })
      const data = await response.json()
      setMessage(data.message || 'Chưa gửi được email.')
    } catch { setMessage('Không kết nối được. Vui lòng thử lại.') } finally { setBusy(false) }
  }}>{busy ? 'Đang gửi…' : 'Gửi lại thông báo email'}</button><p role="status">{message}</p></div>
}
