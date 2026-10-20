import { readFileSync } from 'node:fs'
import { Client } from 'pg'

const rows = readFileSync('scripts/hpttech-posts.jsonl','utf8').trim().split(/\r?\n/).map(JSON.parse)
const db = new Client({connectionString: process.env.DATABASE_URL})
await db.connect()
try {
  await db.query('BEGIN')
  for (const row of rows) {
    await db.query('UPDATE posts SET published_at=$1 WHERE slug=$2 AND published_at IS NULL',[row.publishedAt,row.slug])
    await db.query('UPDATE posts SET content=replace(content::text,$1,$2)::jsonb WHERE slug=$3',[`Nguồn bài viết: HPTTech — https://hpttech.vn/${row.slug}`,`Nguồn bài viết: HPTTech — https://hpttech.vn/${row.category.slug}/${row.slug}`,row.slug])
    if (row.content?.root?.children) row.content.root.children.push({type:'paragraph',version:1,format:'',indent:0,direction:null,children:[{type:'text',version:1,mode:'normal',style:'',detail:0,format:0,text:`Nguồn bài viết: HPTTech — https://hpttech.vn/${row.category.slug}/${row.slug}`} ]})
    const category = await db.query('INSERT INTO article_categories(name,slug) VALUES($1,$2) ON CONFLICT(slug) DO UPDATE SET name=excluded.name RETURNING id',[row.category.name,row.category.slug])
    let imageId = null
    if (row.image.filename) {
      const image = await db.query(`INSERT INTO media(alt,filename,url,width,height) VALUES($1,$2,$3,$4,$5) ON CONFLICT(filename) DO UPDATE SET url=excluded.url RETURNING id`,[row.image.alt || row.title,`hpt-${row.image.id}-${row.image.filename}`,`/r2/${encodeURIComponent(row.image.filename)}`,row.image.width,row.image.height])
      imageId=image.rows[0].id
    }
    await db.query(`INSERT INTO posts(title,slug,excerpt,content,category_id,hero_image_id,published_at,featured,_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'published') ON CONFLICT(slug) DO UPDATE SET content=excluded.content WHERE posts.content=$9::jsonb`,[row.title,row.slug,row.excerpt,JSON.stringify(row.content),category.rows[0].id,imageId,row.publishedAt,row.featured || false,JSON.stringify({...row.content,root:{...row.content.root,children:row.content.root.children.slice(0,-1)}})])
  }
  await db.query('COMMIT')
  console.log(`Imported ${rows.length} published HPTTech posts; original titles and content preserved.`)
} catch(error) {await db.query('ROLLBACK'); throw error} finally {await db.end()}
