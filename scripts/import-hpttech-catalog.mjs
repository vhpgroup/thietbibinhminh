import fs from 'node:fs'
import path from 'node:path'
import { Client } from 'pg'

const input = path.resolve(process.argv[2] || 'scripts/hpttech-catalog-20261008.jsonl')
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')

const rows = fs.readFileSync(input, 'utf8').trim().split(/\r?\n/).map((line) => JSON.parse(line))
const categories = [...new Map(rows.map((row) => [row.category.slug, row.category])).values()]
const brands = [...new Map(rows.map((row) => [row.brand.slug, row.brand])).values()]
const images = [...new Map(rows.filter((row) => row.image?.filename).map((row) => [row.image.sourceId, row.image])).values()]
const client = new Client({ connectionString: process.env.DATABASE_URL })

function price(value) {
  const digits = String(value || '').replace(/[^0-9]/g, '')
  return digits ? Number(digits) : 0
}

function imageURL(image) {
  return `/r2/${encodeURIComponent(image.filename)}`
}

async function batches(items, sql, map = (item) => item) {
  for (let index = 0; index < items.length; index += 500) {
    await client.query(sql, [JSON.stringify(items.slice(index, index + 500).map(map))])
  }
}

try {
  await client.connect()
  await client.query('BEGIN')

  await batches(categories, `
    INSERT INTO product_categories (name, slug, description, icon, "order")
    SELECT name, slug, description, icon, sort_order
    FROM jsonb_to_recordset($1::jsonb) AS x(name text, slug text, description text, icon text, sort_order numeric)
    ON CONFLICT (slug) DO NOTHING
  `, (category) => ({
    name: category.name, slug: category.slug, description: category.description,
    icon: category.icon, sort_order: category.order,
  }))

  await batches(brands, `
    INSERT INTO brands (name, slug, website)
    SELECT name, slug, website
    FROM jsonb_to_recordset($1::jsonb) AS x(name text, slug text, website text)
    ON CONFLICT (slug) DO NOTHING
  `)

  await batches(images, `
    INSERT INTO media (alt, url, filename, mime_type, width, height)
    SELECT alt, url, filename, mime_type, width, height
    FROM jsonb_to_recordset($1::jsonb) AS x(alt text, url text, filename text, mime_type text, width numeric, height numeric)
    ON CONFLICT (filename) DO NOTHING
  `, (image) => ({
    alt: image.alt || image.filename,
    url: imageURL(image),
    filename: `hpt-${image.sourceId}-${image.filename}`,
    mime_type: /\.png$/i.test(image.filename) ? 'image/png' : /\.webp$/i.test(image.filename) ? 'image/webp' : 'image/jpeg',
    width: image.width || null,
    height: image.height || null,
  }))

  await batches(rows, `
    INSERT INTO products (
      name, slug, sku, category_id, brand_id, image_id, short_spec, description,
      price, old_price, badge, stock, featured, rating, reviews, _status
    )
    SELECT x.name, x.slug, x.sku, c.id, b.id, m.id, x.short_spec, x.description,
      x.price, x.old_price, x.badge, 0, x.featured, x.rating, x.reviews, 'published'::enum_products_status
    FROM jsonb_to_recordset($1::jsonb) AS x(
      name text, slug text, sku text, category_slug text, brand_slug text,
      image_filename text, short_spec text, description text, price numeric,
      old_price numeric, badge text, featured boolean, rating numeric, reviews numeric
    )
    JOIN product_categories c ON c.slug = x.category_slug
    JOIN brands b ON b.slug = x.brand_slug
    LEFT JOIN media m ON m.filename = x.image_filename
    ON CONFLICT (slug) DO NOTHING
  `, (row) => ({
    name: row.name,
    slug: row.slug,
    sku: `HPT-${row.sourceId}`,
    category_slug: row.category.slug,
    brand_slug: row.brand.slug,
    image_filename: row.image?.filename ? `hpt-${row.image.sourceId}-${row.image.filename}` : null,
    short_spec: row.shortSpec || (row.sourceSku && row.sourceSku !== '0' ? `Mã gốc: ${row.sourceSku}` : null),
    description: row.description || null,
    price: price(row.priceText),
    old_price: price(row.oldPriceText) || null,
    badge: row.badge || null,
    featured: row.featured,
    rating: Number(row.rating) || 0,
    reviews: Number(row.reviews) || 0,
  }))

  await client.query('COMMIT')
  const result = await client.query(`
    SELECT
      (SELECT count(*) FROM products WHERE sku LIKE 'HPT-%') AS products,
      (SELECT count(*) FROM product_categories) AS categories,
      (SELECT count(*) FROM brands) AS brands,
      (SELECT count(*) FROM media WHERE filename LIKE 'hpt-%') AS images
  `)
  console.log(result.rows[0])
} catch (error) {
  await client.query('ROLLBACK').catch(() => {})
  throw error
} finally {
  await client.end()
}
