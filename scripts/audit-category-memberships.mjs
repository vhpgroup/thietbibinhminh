import fs from 'node:fs'
import crypto from 'node:crypto'
import { Client } from 'pg'
import { categoryMatch, productFacts } from './catalog-category-rules.mjs'

const db = new Client({ connectionString: process.env.DATABASE_URL })
try {
 await db.connect()
 const data={}
 for(const table of ['products','product_categories','brands','products_specs','products_rels'])data[table]=(await db.query(`SELECT * FROM ${table}`)).rows
 const byId=new Map(data.product_categories.map(c=>[c.id,c])), brands=new Map(data.brands.map(b=>[b.id,b])), specs=new Map()
 for(const spec of data.products_specs){if(!specs.has(spec._parent_id))specs.set(spec._parent_id,[]);specs.get(spec._parent_id).push(spec)}
 const facts=data.products.map(p=>productFacts(p,byId.get(p.category_id),brands.get(p.brand_id),specs.get(p.id)||[]))
 const current=new Map(data.product_categories.map(c=>[c.id,new Set()]))
 for(const r of data.products_rels)if(r.path==='secondaryCategories')current.get(r.product_categories_id)?.add(r.parent_id)
 const changes=[],report=[]
 for(const category of data.product_categories.filter(c=>c.show_in_menu&&c.parent_id)){
  const ancestors=[];let node=category;const seen=new Set([node.id])
  while(node.parent_id){node=byId.get(node.parent_id);if(!node||seen.has(node.id))throw Error('Invalid category hierarchy');seen.add(node.id);ancestors.unshift(node)}
  // Structural groups aggregate descendants. Only classify actual menu links.
  if(!category.source_u_r_l)continue
  const proposed=new Set(current.get(category.id)),evidence=[]
  for(const product of facts){const match=categoryMatch(product,category,ancestors)
   if(match===true){proposed.add(product.id);evidence.push(product.id)}else if(match===false)proposed.delete(product.id)
  }
  const added=[...proposed].filter(id=>!current.get(category.id).has(id)),removed=[...current.get(category.id)].filter(id=>!proposed.has(id))
  if(added.length||removed.length)changes.push({category:category.id,added,removed})
  report.push({id:category.id,path:[...ancestors,category].map(c=>c.name).join(' > '),slug:category.slug,before:current.get(category.id).size,after:proposed.size,added:added.length,removed:removed.length,samples:evidence.slice(0,3).map(id=>facts.find(p=>p.id===id).name)})
 }
 const stamp=Date.now();fs.mkdirSync('.backups',{recursive:true})
 const reportPath='.backups/category-membership-audit.json';fs.writeFileSync(reportPath,JSON.stringify(report,null,2))
 console.log(JSON.stringify({categories:report.length,changed:changes.length,added:changes.reduce((n,c)=>n+c.added.length,0),removed:changes.reduce((n,c)=>n+c.removed.length,0),directEmpty:report.filter(c=>!c.after).length,reportPath}))
 if(process.argv.includes('--apply')){
  fs.writeFileSync(`.backups/category-memberships-${stamp}.json`,JSON.stringify(data.products_rels.filter(r=>r.path==='secondaryCategories')))
  const protectedTables=['products','posts','contact_submissions','site_settings']
  async function fingerprint(){const result={};for(const table of protectedTables)result[table]=crypto.createHash('sha256').update(JSON.stringify((await db.query(`SELECT to_jsonb(t) AS data FROM ${table} t ORDER BY id`)).rows)).digest('hex');return JSON.stringify(result)}
  await db.query('BEGIN');const before=await fingerprint()
  for(const change of changes){
   if(change.removed.length)await db.query("DELETE FROM products_rels WHERE path='secondaryCategories' AND product_categories_id=$1 AND parent_id=ANY($2::int[])",[change.category,change.removed])
   if(change.added.length)await db.query("INSERT INTO products_rels(parent_id,path,product_categories_id) SELECT id,'secondaryCategories',$1 FROM unnest($2::int[]) AS id",[change.category,change.added])
  }
  if(before!==await fingerprint())throw Error('Protected content changed')
  await db.query('COMMIT');console.log('Applied; product content, news, requests and settings preserved.')
 }
}catch(error){await db.query('ROLLBACK');throw error}finally{await db.end()}
