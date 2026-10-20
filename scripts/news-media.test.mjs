import { test } from 'node:test'
import assert from 'node:assert/strict'
import { resolveNewsMedia } from '../src/lib/news-media.ts'

test('Lexical nested uploads and links resolve to R2 without mutating the saved article',()=>{
 const article={root:{children:[{type:'upload',value:{url:'/api/media/file/hpt-1866-nbas1586-2cefa7a8.jpg'}},{type:'link',fields:{url:'https://hpttech.vn/api/media/file/hpt-5979-1004-1.jpg'}}]}}
 const before=structuredClone(article),resolved=resolveNewsMedia(article)
 assert.equal(resolved.root.children[0].value.url,'/r2/nbas1586-2cefa7a8.jpg')
 assert.equal(resolved.root.children[1].fields.url,'/r2/1004-1.jpg')
 assert.deepEqual(article,before)
})
test('new uploads, external links and ordinary article text remain intact',()=>{
 for(const value of ['/api/media/file/new-upload.jpg','https://example.com/api/media/file/hpt-1-file.jpg','Hướng dẫn sử dụng máy scan',null,1])assert.deepEqual(resolveNewsMedia(value),value)
 assert.equal(resolveNewsMedia('/api/media/file/hpt-100-Camera%20PTZ.jpg'),'/r2/Camera%20PTZ.jpg')
})
