import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:net'
import { verifiedCommerce } from '../src/lib/catalog-verification'
import { jsonLD } from '../src/lib/site-url'
import { guardSubmission } from '../src/lib/submission-guard'
import { deliverRequestNotification } from '../src/lib/customer-notifications'
import { requestPool } from '../src/lib/request-db'
import { Products } from '../src/collections/Products'

test('Unverified source data never becomes a live price or stock claim', () => {
  assert.deepEqual(verifiedCommerce({ price: 123, stock: 999, oldPrice: 200 }), { price: 0, oldPrice: null, stock: null })
  assert.deepEqual(verifiedCommerce({ price: 123, stock: 0, priceVerified: true, stockVerified: true }), { price: 123, oldPrice: undefined, stock: 0 })
  assert.ok(!jsonLD({ name: '</script><script>alert(1)</script>' }).includes('<'))
})

test('Changing an approved value requires a fresh verification and records the confirmation date', () => {
  const hook = Products.hooks!.beforeChange![0] as (args: any) => any
  const data = hook({ data: { price: 200, priceVerified: true, stock: 0, stockVerified: true }, originalDoc: { price: 100, priceVerified: true, stock: 5, stockVerified: true }, req: { user: { collection: 'admins' } } })
  assert.equal(data.priceVerified, false); assert.equal(data.stockVerified, false)
  assert.equal(data.priceVerifiedAt, null); assert.equal(data.stockVerifiedAt, null)
  const confirmed = hook({ data: { priceVerified: true, stockVerified: true }, originalDoc: { price: 200, priceVerified: false, stock: 0, stockVerified: false }, req: { user: { collection: 'admins' } } })
  assert.ok(confirmed.priceVerifiedAt); assert.ok(confirmed.stockVerifiedAt)
})

test('Database limiter is atomic under concurrent submissions; SMTP retries do not duplicate a claimed job', { skip: !process.env.DATABASE_URL }, async () => {
  const testEmail = `launch-test-${Date.now()}@example.invalid`
  const ids: number[] = []
  let deliveries = 0
  const server = createServer(socket => {
    socket.write('220 localhost test SMTP\r\n')
    let buffer = '', data = false
    socket.on('data', chunk => {
      buffer += chunk.toString()
      let end: number
      while ((end = buffer.indexOf('\r\n')) >= 0) {
        const line = buffer.slice(0, end); buffer = buffer.slice(end + 2)
        if (data) { if (line === '.') { data = false; deliveries++; socket.write(deliveries === 2 ? '451 temporary failure\r\n' : '250 accepted\r\n') }; continue }
        if (/^EHLO|^HELO/.test(line)) socket.write('250 localhost\r\n')
        else if (/^DATA/.test(line)) { data = true; socket.write('354 send\r\n') }
        else if (/^QUIT/.test(line)) { socket.end('221 bye\r\n') }
        else socket.write('250 ok\r\n')
      }
    })
  })
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const guards = await Promise.allSettled(Array.from({ length: 8 }, () => guardSubmission(testEmail, new Headers())))
    assert.equal(guards.filter(g => g.status === 'fulfilled').length, 3)
    assert.equal(guards.filter(g => g.status === 'rejected').length, 5)
    const result = await requestPool.query(`INSERT INTO contact_submissions(name,phone,email,topic,message,status,notification_status,created_at,updated_at) VALUES ('TEST ONLY','0000000000',$1,'Mua sản phẩm','Synthetic SMTP test','new','pending',now(),now()) RETURNING id`, [testEmail])
    const id = result.rows[0].id; ids.push(id)
    delete process.env.SMTP_HOST; delete process.env.SMTP_FROM
    assert.equal(await deliverRequestNotification(id), false)
    assert.equal((await requestPool.query('SELECT notification_status FROM contact_submissions WHERE id=$1', [id])).rows[0].notification_status, 'failed')
    process.env.SMTP_HOST = '127.0.0.1'; process.env.SMTP_PORT = String((server.address() as { port: number }).port)
    process.env.SMTP_FROM = 'test@example.invalid'; process.env.SALES_NOTIFICATION_EMAIL = 'sales@example.invalid'; process.env.SMTP_ALLOW_INSECURE = 'true'
    delete process.env.SMTP_USER; delete process.env.SMTP_PASSWORD
    const sent = await Promise.all(Array.from({ length: 8 }, () => deliverRequestNotification(id)))
    assert.equal(sent.filter(Boolean).length, 0)
    const partial = (await requestPool.query('SELECT notification_sent_at,customer_email_sent_at FROM contact_submissions WHERE id=$1', [id])).rows[0]
    assert.ok(partial.notification_sent_at); assert.equal(partial.customer_email_sent_at, null)
    assert.equal(await deliverRequestNotification(id), true)
    assert.equal(deliveries, 3) // Staff once, customer first attempt failed, customer retried.
    const saved = (await requestPool.query('SELECT notification_status,notification_sent_at,notification_error FROM contact_submissions WHERE id=$1', [id])).rows[0]
    assert.equal(saved.notification_status, 'sent'); assert.ok(saved.notification_sent_at); assert.equal(saved.notification_error, null)
  } finally {
    await requestPool.query('DELETE FROM contact_submissions WHERE id=ANY($1::int[])', [ids])
    // Only remove this test identity's rate bucket; never clear customer/global buckets.
    const { createHmac } = await import('node:crypto')
    const key = createHmac('sha256', process.env.PAYLOAD_SECRET || 'local').update('email:' + testEmail).digest('hex')
    await requestPool.query('DELETE FROM submission_limits WHERE key=$1', [key])
    server.close(); await requestPool.end()
  }
})
