import { createHmac } from 'node:crypto'
import { APIError } from 'payload'
import { requestPool } from './request-db'

export async function guardSubmission(email: string, headers: Headers) {
  // Only trust the proxy address when the deployment explicitly strips incoming forwarded headers.
  const ip = process.env.TRUST_PROXY_HEADERS === 'true' ? (headers.get('x-forwarded-for') || '').split(',')[0].trim() : ''
  const hash = (key: string) => createHmac('sha256', process.env.PAYLOAD_SECRET || 'local').update(key).digest('hex')
  const bucket = Math.floor(Date.now() / 900000)
  const limits = [{ key: hash('email:' + email.trim().toLowerCase()), limit: 3 }, { key: 'global', limit: 100 }, ...(ip ? [{ key: hash('ip:' + ip), limit: 10 }] : [])]
  const client = await requestPool.connect()
  try {
    await client.query('BEGIN')
    for (const entry of limits) {
      const result = await client.query('INSERT INTO submission_limits (key, bucket, hits) VALUES ($1,$2,1) ON CONFLICT (key,bucket) DO UPDATE SET hits=submission_limits.hits+1 RETURNING hits', [entry.key, bucket])
      if (result.rows[0].hits > entry.limit) throw new APIError('Bạn đã gửi nhiều yêu cầu. Vui lòng thử lại sau 15 phút hoặc gọi 0876 645 432.', 429)
    }
    await client.query('DELETE FROM submission_limits WHERE bucket < $1', [bucket - 2])
    await client.query('COMMIT')
  } catch (error) { await client.query('ROLLBACK'); throw error } finally { client.release() }
}

export function isSpamForm(form: FormData) { return Boolean(String(form.get('website') || '').trim()) }
