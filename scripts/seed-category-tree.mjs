import { Client } from 'pg'
import { readFileSync } from 'node:fs'

// The existing homepage mapping is the initial migration input, not runtime configuration.
const source = readFileSync('src/lib/home-categories.ts', 'utf8')
const groups = Function(source.replace('export const homeCategories =', 'return').replace('as const', ''))()
const client = new Client({ connectionString: process.env.DATABASE_URL })
await client.connect()
try {
  await client.query('BEGIN')
  for (const [index, group] of groups.entries()) {
    const result = await client.query(`INSERT INTO product_categories(name,slug,icon,"order") VALUES($1,$2,$3,$4)
      ON CONFLICT(slug) DO UPDATE SET icon=excluded.icon RETURNING id`, [group.name, group.key, group.icon, index])
    await client.query('UPDATE product_categories SET parent_id=$1 WHERE slug=ANY($2) AND parent_id IS NULL AND id<>$1', [result.rows[0].id, group.slugs])
  }
  await client.query('COMMIT')
  console.log('Category tree seeded; product IDs and category assignments preserved.')
} catch (error) {
  await client.query('ROLLBACK')
  throw error
} finally { await client.end() }
