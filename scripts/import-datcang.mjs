import fs from 'node:fs'
import crypto from 'node:crypto'
import { Client } from 'pg'

// Run prepare-datcang.py first. This command replaces the local product catalog.
// A full pg_dump backup is mandatory; articles and customer requests are checked
// byte-for-byte inside the same transaction before it can commit.
const input = process.argv[2] || '.tmp-datcang.json'
const backup = process.argv[3]
if (!backup || !fs.existsSync(backup) || fs.statSync(backup).size < 1000) throw Error('A database backup file is required')
if (!process.env.DATABASE_URL) throw Error('DATABASE_URL is required')
const data = JSON.parse(fs.readFileSync(input, 'utf8'))
for (const [items, key] of [[data.products, 'sku'], [data.products, 'slug'], [data.brands, 'slug'], [data.categories, 'slug']]) {
  if (new Set(items.map(row => row[key])).size !== items.length) throw Error(`Duplicate ${key} in source`)
}
if (!data.products.length || data.products.some(p => !p.images.length || p.price < 0)) throw Error('Invalid manifest')
const db = new Client({ connectionString: process.env.DATABASE_URL })
async function batch(items, query) {
  for (let i=0; i<items.length; i+=300) await db.query(query,[JSON.stringify(items.slice(i,i+300))])
}
const protectedTables=['posts','posts_rels','posts_content','article_categories','contact_submissions','admins','site_settings','banners']
async function snapshot() {
  const result={}
  for (const table of protectedTables) {
    const exists=await db.query('SELECT to_regclass($1) AS name',[`public.${table}`])
    if(!exists.rows[0].name)continue
    const rows=await db.query(`SELECT to_jsonb(t) AS row FROM "${table}" t ORDER BY to_jsonb(t)::text`)
    result[table]={count:rows.rowCount,hash:crypto.createHash('sha256').update(JSON.stringify(rows.rows)).digest('hex')}
  }
  return result
}
try {
  await db.connect()
  await db.query('BEGIN')
  await db.query("SET LOCAL lock_timeout = '15s'")
  const before=await snapshot()
  await db.query('LOCK TABLE products, product_categories, brands IN EXCLUSIVE MODE')
  // Remove product revision history too, preventing recovery of old catalog via drafts.
  await db.query('DELETE FROM _products_v; DELETE FROM products; DELETE FROM product_categories; DELETE FROM brands')
  await batch(data.categories,`INSERT INTO product_categories (name,slug,description,source_u_r_l,show_in_menu,indexable,icon,"order")
    SELECT name,slug,NULL,url,show_in_menu,(kind='main_menu' OR (kind='menu_link' AND show_in_menu AND url NOT LIKE '%?%')),icon,id FROM jsonb_to_recordset($1::jsonb)
    AS x(id int,name text,slug text,url text,kind text,show_in_menu boolean,icon text)`)
  const categoryMap=new Map((await db.query('SELECT id,slug FROM product_categories')).rows.map(c=>[c.slug,c.id]))
  const sourceCategories=new Map(data.categories.map(c=>[c.id,categoryMap.get(c.slug)]))
  await batch(data.categories.filter(c=>c.parent_id).map(c=>({id:sourceCategories.get(c.id),parent:sourceCategories.get(c.parent_id)})),
    'UPDATE product_categories c SET parent_id=x.parent FROM jsonb_to_recordset($1::jsonb) AS x(id int,parent int) WHERE c.id=x.id')
  await batch(data.brands,`INSERT INTO brands (name,slug,website) SELECT name,slug,source_url FROM jsonb_to_recordset($1::jsonb) AS x(name text,slug text,source_url text)`)
  const brandMap=new Map((await db.query('SELECT id,slug FROM brands')).rows.map(b=>[b.slug,b.id]))
  const sourceBrands=new Map(data.brands.map(b=>[b.id,brandMap.get(b.slug)]))
  await batch(data.media,`INSERT INTO media (alt,filename,url,external_u_r_l,mime_type)
    SELECT alt,filename,url,url,CASE WHEN filename LIKE '%.png' THEN 'image/png' WHEN filename LIKE '%.webp' THEN 'image/webp' ELSE 'image/jpeg' END
    FROM jsonb_to_recordset($1::jsonb) AS x(alt text,filename text,url text)
    ON CONFLICT (filename) DO UPDATE SET external_u_r_l=excluded.external_u_r_l,alt=excluded.alt`)
  const mediaMap=new Map((await db.query("SELECT id,filename FROM media WHERE filename LIKE 'dc-%'")).rows.map(m=>[m.filename,m.id]))
  await batch(data.products.map(p=>({...p,category:sourceCategories.get(p.category_id),brand:sourceBrands.get(p.brand_id),image:mediaMap.get(p.images[0])})),
    `INSERT INTO products (name,slug,sku,category_id,brand_id,image_id,short_spec,description,price,stock,featured,rating,reviews,_status,source_u_r_l,seo_title,seo_description)
     SELECT name,slug,sku,category,brand,image,short_spec,description,price,0,false,0,0,'published',product_url,name,left(short_spec,160)
     FROM jsonb_to_recordset($1::jsonb) AS x(name text,slug text,sku text,category int,brand int,image int,short_spec text,description text,price numeric,product_url text)`)
  const productMap=new Map((await db.query('SELECT id,sku FROM products')).rows.map(p=>[p.sku,p.id]))
  const relations=[],specs=[]
  for(const p of data.products){
    const id=productMap.get(p.sku)
    p.categories.filter(c=>c!==p.category_id).forEach((c,index)=>relations.push({parent:id,order:index+1,path:'secondaryCategories',category:sourceCategories.get(c),media:null}))
    p.images.forEach((m,index)=>relations.push({parent:id,order:index+1,path:'gallery',category:null,media:mediaMap.get(m)}))
    p.specs.forEach((s,index)=>specs.push({parent:id,order:index+1,id:crypto.randomUUID(),...s}))
  }
  await batch(relations,`INSERT INTO products_rels (parent_id,"order",path,product_categories_id,media_id)
    SELECT parent,"order",path,category,media FROM jsonb_to_recordset($1::jsonb) AS x(parent int,"order" int,path text,category int,media int)`)
  await batch(specs,`INSERT INTO products_specs (_parent_id,_order,id,label,value)
    SELECT parent,"order",id,label,value FROM jsonb_to_recordset($1::jsonb) AS x(parent int,"order" int,id text,label text,value text)`)
  const after=await snapshot()
  if(JSON.stringify(before)!==JSON.stringify(after))throw Error('Protected data changed; rolling back')
  const counts=(await db.query(`SELECT (SELECT count(*) FROM products)::int products,(SELECT count(*) FROM products_specs)::int specs,
    (SELECT count(*) FROM products_rels WHERE path='gallery')::int gallery,(SELECT count(*) FROM product_categories)::int categories,
    (SELECT count(*) FROM products WHERE image_id IS NULL OR category_id IS NULL OR brand_id IS NULL)::int incomplete`)).rows[0]
  if(counts.products!==data.products.length||counts.specs!==specs.length||counts.gallery!==relations.filter(r=>r.path==='gallery').length||counts.incomplete)throw Error('Import count mismatch')
  await db.query('COMMIT')
  await db.query('ANALYZE products; ANALYZE products_rels; ANALYZE products_specs; ANALYZE product_categories; ANALYZE media')
  fs.writeFileSync('.backups/datcang-import-result.json',JSON.stringify({counts,preserved:after,sourceSHA256:crypto.createHash('sha256').update(fs.readFileSync(input)).digest('hex'),importedAt:new Date().toISOString()},null,2))
  console.log(JSON.stringify({counts,preserved:Object.fromEntries(Object.entries(after).map(([k,v])=>[k,v.count]))},null,2))
} catch(error) {
  await db.query('ROLLBACK').catch(()=>{})
  throw error
} finally {await db.end()}
