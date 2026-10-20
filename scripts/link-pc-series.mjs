import fs from 'node:fs'
import { Client } from 'pg'
import { linkPCSeries } from './pc-category-memberships.mjs'

const db = new Client({ connectionString: process.env.DATABASE_URL })
try {
  await db.connect()
  await db.query('BEGIN')
  fs.mkdirSync('.backups', { recursive: true })
  fs.writeFileSync(`.backups/pc-memberships-${Date.now()}.json`, JSON.stringify(
    (await db.query("SELECT * FROM products_rels WHERE path='secondaryCategories'")).rows))
  const report = await linkPCSeries(db)
  await db.query('COMMIT')
  console.log(JSON.stringify(report, null, 2))
} catch (error) {
  await db.query('ROLLBACK')
  throw error
} finally { await db.end() }
