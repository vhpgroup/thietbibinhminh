import { Client } from 'pg'
const db=new Client({connectionString:process.env.DATABASE_URL})
const rename=(text)=>text.replace(/HPT\s*Tech|HPTTech|\bHPT\b/gi,'Bình Minh')
function content(value) {
 if(Array.isArray(value)) return value.map(content)
 if(!value||typeof value!=='object') return value
 return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,key==='text'&&typeof item==='string' ? (item.startsWith('Nguồn bài viết: HPTTech') ? item.replace('Nguồn bài viết: HPTTech —','Bài viết tham khảo:') : rename(item)) : content(item)]))
}
await db.connect()
try {
 await db.query('BEGIN')
 const posts=await db.query('SELECT id,title,excerpt,content FROM posts')
 for(const post of posts.rows) await db.query('UPDATE posts SET title=$1,excerpt=$2,content=$3 WHERE id=$4',[rename(post.title),post.excerpt?rename(post.excerpt):post.excerpt,JSON.stringify(content(post.content)),post.id])
 const result=await db.query("UPDATE article_categories SET name='Hoạt động Bình Minh' WHERE slug='hoat-dong-hpt'")
 await db.query('COMMIT')
 console.log(`Updated ${posts.rowCount} articles and ${result.rowCount} category labels.`)
}catch(error){await db.query('ROLLBACK');throw error}finally{await db.end()}
