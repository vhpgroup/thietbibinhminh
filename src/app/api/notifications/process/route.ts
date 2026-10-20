import { timingSafeEqual } from 'node:crypto'
import { requestPool } from '@/lib/request-db'
import { deliverRequestNotification } from '@/lib/customer-notifications'

export async function POST(request: Request) {
  const secret = process.env.NOTIFICATION_CRON_SECRET
  const supplied = request.headers.get('authorization')?.replace(/^Bearer /, '') || ''
  if (!secret || Buffer.byteLength(secret) !== Buffer.byteLength(supplied) || !timingSafeEqual(Buffer.from(secret), Buffer.from(supplied))) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const jobs = await requestPool.query(`SELECT id FROM contact_submissions WHERE (notification_status='pending' OR (notification_status='failed' AND notification_attempted_at < now()-interval '15 minutes') OR (notification_status='sending' AND notification_attempted_at < now()-interval '5 minutes')) ORDER BY id LIMIT 10`)
  let sent = 0
  for (const job of jobs.rows) if (await deliverRequestNotification(job.id)) sent++
  return Response.json({ processed: jobs.rowCount, sent })
}
