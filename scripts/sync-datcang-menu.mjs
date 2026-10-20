import fs from 'node:fs'
import { Client } from 'pg'
import { linkPCSeries } from './pc-category-memberships.mjs'
import { execFileSync } from 'node:child_process'

// Sync public product navigation without replacing products or customer data.
const menu=JSON.parse(fs.readFileSync(process.argv[2]||'scripts/datcang-menu.json','utf8'))
if(menu.length!==11||menu.some(r=>r.name==='Linh kiện nâng cấp'))throw Error('Expected 11 product roots excluding upgrades')
const norm=s=>s.normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/g,'d').toLowerCase().replace(/\s+/g,' ').trim()
function removeServices(nodes){return nodes.filter(n=>norm(n.name)!=='bao hanh mo rong'&&!/(^|\s)(dich vu|sua |thue |cho thue |bao tri |ve sinh |cai dat |cuu du lieu)/.test(norm(n.name))).map(n=>({...n,children:removeServices(n.children)}))}
menu.splice(0,menu.length,...removeServices(menu))
const slug=s=>norm(s).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
const db=new Client({connectionString:process.env.DATABASE_URL})
try {
 await db.connect();await db.query('BEGIN')
 const before=(await db.query('SELECT * FROM product_categories ORDER BY id')).rows
 fs.mkdirSync('.backups',{recursive:true})
 fs.writeFileSync('.backups/categories-before-menu-sync.json',JSON.stringify(before,null,2))
 const preserved=(await db.query('SELECT (SELECT count(*) FROM products)::int products,(SELECT count(*) FROM posts)::int posts,(SELECT count(*) FROM contact_submissions)::int requests')).rows[0]
 await db.query('UPDATE product_categories SET show_in_menu=false')
 const occupied=new Set(before.map(c=>c.slug)),nodes=[]
 let order=0
 async function save(node,parent=null,root=null) {
  let existing=before.find(c=>c.parent_id===parent&&norm(c.name)===norm(node.name))
  let id=existing?.id
  if(!id){
   let key=slug(node.name);if(occupied.has(key))key+=`-menu-${order}`;occupied.add(key)
   id=(await db.query('INSERT INTO product_categories (name,slug,parent_id,show_in_menu,indexable,source_u_r_l,"order") VALUES ($1,$2,$3,true,false,$4,$5) RETURNING id',[node.name,key,parent,node.url,order])).rows[0].id
  }else await db.query('UPDATE product_categories SET name=$1,source_u_r_l=$2,show_in_menu=true,"order"=$3 WHERE id=$4',[node.name,node.url,order,id])
  order++;nodes.push({...node,id,root:root||id,parent})
  for(const child of node.children)await save(child,id,root||id)
 }
 for(const root of menu)await save(root)
 const apple=nodes.find(n=>n.name==='Apple'&&!n.parent)
 const appleNodes=nodes.filter(n=>n.root===apple.id)
 const products=(await db.query('SELECT id,name,short_spec FROM products')).rows
 const current=new Set((await db.query("SELECT parent_id,product_categories_id FROM products_rels WHERE path='secondaryCategories'")).rows.map(r=>`${r.parent_id}:${r.product_categories_id}`))
 const links=[]
 function add(product,category){const key=`${product.id}:${category.id}`;if(!current.has(key)){current.add(key);links.push({parent:product.id,category:category.id})}}
 for(const product of products){
  const name=norm(product.name),details=name+' '+norm(product.short_spec||'')
  const accessory=/bao da|ban phim|but cam ung|cap sac|cu sac|op lung|sac laptop|tui|gia do/.test(name)
  const macbook=/macbook/.test(name)&&!accessory
  const ipad=/ipad/.test(name)&&!accessory
  const iphone=/iphone/.test(name)&&!accessory
  const rules={
   'macbook':macbook,'tat ca macbook':macbook,
   'macbook air':macbook&&/macbook air/.test(name),'macbook pro':macbook&&/macbook pro/.test(name),
   'macbook neo':macbook&&/macbook neo/.test(name),'macbook chip m5':macbook&&/\bm5\b/.test(name),
   'imac – mac mini':/\bimac\b|\bmac mini\b/.test(name),'imac':/\bimac\b/.test(name),'mac mini':/\bmac mini\b/.test(name),
   'ipad':ipad,'tat ca ipad':ipad,'ipad pro':ipad&&/ipad pro/.test(name),'ipad air':ipad&&/ipad air/.test(name),'ipad mini':ipad&&/ipad mini/.test(name),
   'ipad gen (a16)':ipad&&/\ba16\b/.test(name),'ipad ban wi-fi':ipad&&/wi-?fi/.test(details)&&!/5g|cellular|lte/.test(details),'ipad ban 5g':ipad&&/5g|cellular/.test(details),
   'iphone':iphone,'iphone 18 series':iphone&&/iphone 18/.test(name),'iphone 16 pro max':iphone&&/iphone 16 pro max/.test(name),'iphone 16 / 16 plus':iphone&&/iphone 16(?! pro)/.test(name),
   'ban phim magic keyboard':/magic keyboard/.test(name),'chuot – trackpad':/magic mouse|trackpad/.test(name),'apple pencil':/apple pencil/.test(name),'airpods':/airpods/.test(name),
   'cu sac – cap apple':/(apple|iphone|ipad)/.test(name)&&/(cu sac|cap sac)/.test(name),'op lung iphone':/iphone/.test(name)&&/op lung/.test(name),
  }
  let hit=false
  for(const category of appleNodes)if(rules[norm(category.name)]){add(product,category);hit=true}
  if(hit){add(product,apple);const group=appleNodes.find(n=>n.name==='Phụ kiện Apple');if(group&&/magic keyboard|magic mouse|trackpad|apple pencil|airpods|op lung|cu sac|cap sac/.test(name))add(product,group)}
 }
 for(let i=0;i<links.length;i+=500)await db.query(`INSERT INTO products_rels (parent_id,path,product_categories_id) SELECT parent,'secondaryCategories',category FROM jsonb_to_recordset($1::jsonb) AS x(parent int,category int)`,[JSON.stringify(links.slice(i,i+500))])
 const pcSeries = await linkPCSeries(db)
 const after=(await db.query('SELECT (SELECT count(*) FROM products)::int products,(SELECT count(*) FROM posts)::int posts,(SELECT count(*) FROM contact_submissions)::int requests')).rows[0]
 if(JSON.stringify(preserved)!==JSON.stringify(after))throw Error('Unexpected product or customer data change')
 await db.query('COMMIT')
 const report={roots:menu.length,menuNodes:nodes.length,appleGroups:appleNodes.filter(n=>n.parent===apple.id).map(n=>n.name),addedAppleRelationships:links.length,pcSeries,preserved:after}
 fs.writeFileSync('.backups/datcang-menu-sync-result.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2))
}catch(error){await db.query('ROLLBACK');throw error}finally{await db.end()}
// Reconcile specifications and cross-category navigation after every menu sync.
execFileSync(process.execPath, ['scripts/audit-category-memberships.mjs', '--apply'], { stdio: 'inherit', env: process.env })
