import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { Client } from 'pg'
import { normalize } from './catalog-category-rules.mjs'

const manifest=JSON.parse(fs.readFileSync(process.argv[2]||'scripts/catalog-supplement-20261020.json','utf8'))
const db=new Client({connectionString:process.env.DATABASE_URL})
const slug=value=>normalize(value).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
try {
 await db.connect()
 const categories=(await db.query('SELECT * FROM product_categories')).rows
 const brands=(await db.query('SELECT * FROM brands')).rows
 const originalProducts=(await db.query('SELECT id,sku,category_id FROM products')).rows
 const categoryById=new Map(categories.map(c=>[c.id,c]))
 for(const product of manifest.products){
  if(!product.sourceURL?.startsWith('https://')||!product.sku.startsWith('BM-SUP-'))throw Error('Missing provenance')
  if(!fs.existsSync(path.join('public',product.image.url)))throw Error('Missing image asset: '+product.image.url)
  for(const key of product.categories)if(!categories.some(c=>c.slug===key))throw Error('Missing category '+key)
 }
 const targetSlugs=[...new Set(manifest.products.flatMap(p=>p.categories))]
 const before=(await db.query(`SELECT p.id,p.sku,to_jsonb(p) AS data FROM products p ORDER BY p.id`)).rows
 fs.mkdirSync('.backups',{recursive:true})
 fs.writeFileSync(`.backups/before-catalog-supplement-${Date.now()}.json`,JSON.stringify({products:before,relations:(await db.query('SELECT * FROM products_rels')).rows}))
 async function protectedSnapshot(){
  const result={}
  for(const table of ['products','posts','contact_submissions','site_settings']){
   const where=table==='products'?" WHERE sku NOT LIKE 'BM-SUP-%'":''
   result[table]=crypto.createHash('sha256').update(JSON.stringify((await db.query(`SELECT to_jsonb(t) AS data FROM ${table} t${where} ORDER BY id`)).rows)).digest('hex')
  }
  return JSON.stringify(result)
 }
 await db.query('BEGIN');const protectedBefore=await protectedSnapshot();const created=[]
 for(const item of manifest.products){
  let brand=brands.find(b=>normalize(b.name)===normalize(item.brand))
  if(!brand){brand=(await db.query('INSERT INTO brands(name,slug,website) VALUES($1,$2,$3) RETURNING *',[item.brand,slug(item.brand),new URL(item.sourceURL).origin])).rows[0];brands.push(brand)}
  const primaryIds=item.taxSlug
   ? categories.filter(c=>c.slug===item.taxSlug&&normalize(c.name)===normalize(item.tax)).map(c=>c.id)
   : [...new Set(originalProducts.filter(p=>normalize(categoryById.get(p.category_id)?.name)===normalize(item.tax)).map(p=>p.category_id))]
  if(primaryIds.length!==1)throw Error('Ambiguous product taxonomy: '+item.tax)
  const filename='bm-supp-'+path.basename(item.image.url)
  const image=(await db.query(`INSERT INTO media(alt,filename,url,external_u_r_l,mime_type,width,height)
   VALUES($1,$2,$3,$3,$4,$5,$6) ON CONFLICT(filename) DO UPDATE SET external_u_r_l=EXCLUDED.external_u_r_l,alt=EXCLUDED.alt RETURNING id`,[item.image.alt||item.name,filename,item.image.url,item.image.mime,item.image.width,item.image.height])).rows[0]
  const inserted=await db.query(`INSERT INTO products(name,slug,sku,category_id,brand_id,image_id,short_spec,description,price,stock,featured,rating,reviews,_status,source_u_r_l,seo_title,seo_description)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,0,0,false,0,0,'published',$9,$1,$7) ON CONFLICT(sku) DO NOTHING RETURNING id`,[item.name,item.slug,item.sku,primaryIds[0],brand.id,image.id,item.shortSpec,item.description,item.sourceURL])
  const id=inserted.rows[0]?.id||(await db.query('SELECT id FROM products WHERE sku=$1',[item.sku])).rows[0].id
  if(inserted.rowCount){
   for(let i=0;i<item.specs.length;i++)await db.query('INSERT INTO products_specs(_parent_id,_order,id,label,value) VALUES($1,$2,$3,$4,$5)',[id,i+1,crypto.randomUUID(),item.specs[i].label,item.specs[i].value])
   created.push(item.sku)
  }
  const memberships=new Set()
  for(const key of item.categories){let category=categories.find(c=>c.slug===key);while(category){if(memberships.has(category.id))break;memberships.add(category.id);category=categoryById.get(category.parent_id)}}
  for(const category of memberships)if(category!==primaryIds[0])await db.query(`INSERT INTO products_rels(parent_id,path,product_categories_id)
   SELECT $1,'secondaryCategories',$2 WHERE NOT EXISTS(SELECT 1 FROM products_rels WHERE parent_id=$1 AND path='secondaryCategories' AND product_categories_id=$2)`,[id,category])
 }
 if(protectedBefore!==await protectedSnapshot())throw Error('Protected catalog or customer data changed')
 for(const key of targetSlugs){const c=categories.find(c=>c.slug===key);const result=await db.query(`SELECT count(DISTINCT p.id)::int AS count FROM products p LEFT JOIN products_rels r ON r.parent_id=p.id AND r.path='secondaryCategories' WHERE p._status='published' AND (p.category_id=$1 OR r.product_categories_id=$1)`,[c.id]);if(!result.rows[0].count)throw Error('Empty target category: '+key)}
 await db.query('COMMIT')
 const report={verifiedAt:manifest.verifiedAt,created,targetSlugs,existingContentPreserved:true}
 fs.writeFileSync('.backups/catalog-supplement-result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2))
}catch(error){await db.query('ROLLBACK');throw error}finally{await db.end()}
