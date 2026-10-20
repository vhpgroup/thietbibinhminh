import { requestPool } from '@/lib/request-db'

export async function GET() {
  try {
    await requestPool.query('SELECT 1')
    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503 })
  }
}
