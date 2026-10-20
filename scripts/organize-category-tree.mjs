import { Client } from 'pg'

const client = new Client({ connectionString: process.env.DATABASE_URL })
const range = (a,b) => Array.from({length:b-a+1},(_,i)=>a+i)
// Existing IDs are preserved. Each entry is root, intermediate group, existing leaf IDs.
const plan = [
 ['van-phong','may-scan','Máy scan',[...range(1,8)]],
 ['van-phong','may-in','Máy in',[9,10,11,22,23,126]],
 ['van-phong','sao-chep-tai-lieu','Sao chép tài liệu',[12]],
 ['van-phong','vat-tu-in-an','Vật tư & phụ kiện in ấn',[26,...range(28,33),123]],
 ['may-tinh','may-tinh-xach-tay','Máy tính xách tay',[24,25]],
 ['may-tinh','may-tinh-de-ban','Máy tính để bàn',[55,57,58,61]],
 ['may-tinh','he-thong-may-chu','Hệ thống máy chủ',[56,59]],
 ['may-tinh','phu-kien-may-tinh','Phụ kiện máy tính',[63,64,93,128,134]],
 ['mang','ket-noi-khong-day','Kết nối không dây',[34,39,40,41]],
 ['mang','chuyen-mach-bao-mat','Chuyển mạch & bảo mật',[36,42,43,44,45]],
 ['mang','ha-tang-phu-kien-mang','Hạ tầng & phụ kiện mạng',[...range(46,52)]],
 ['camera','he-thong-giam-sat','Hệ thống giám sát',[35]],
 ['camera','luu-tru-phu-kien-giam-sat','Lưu trữ & phụ kiện giám sát',[37,38]],
 ['hoi-nghi','thiet-bi-hoi-nghi','Thiết bị hội nghị',[54,88]],
 ['hoi-nghi','trinh-chieu-giao-duc','Trình chiếu & giáo dục',[62,113]],
 ['phan-mem','ung-dung-van-phong','Ứng dụng văn phòng',[13,14]],
 ['phan-mem','nen-tang-may-chu','Hệ điều hành & máy chủ',[15,16]],
 ['phan-mem','an-toan-thong-tin','An toàn thông tin',[17,18]],
 ['phan-mem','sang-tao-ky-thuat','Sáng tạo & kỹ thuật',[19,20,21]],
 ['hinh-anh','may-anh','Máy ảnh',range(65,73)],
 ['hinh-anh','ong-kinh','Ống kính',range(74,81)],
 ['hinh-anh','may-quay','Máy quay',[...range(82,87),89,90]],
 ['hinh-anh','quay-phat-truc-tiep','Quay & phát trực tiếp',[91,95,101,110]],
 ['hinh-anh','anh-sang-studio','Ánh sáng & studio',[...range(105,109),111,112,114,121]],
 ['hinh-anh','phu-kien-hinh-anh','Phụ kiện hình ảnh',[92,96,...range(115,120),122,124,125,127,...range(129,133)]],
 ['iot','giai-phap-iot','Giải pháp IoT',[135,137]],
 ['iot','cong-nghiep-nang-luong','Công nghiệp & năng lượng',[60,136,138]],
 ['am-thanh','thu-am-xu-ly-am-thanh','Thu âm & xử lý âm thanh',[94,97,98,100]],
 ['am-thanh','nghe-lien-lac','Nghe & liên lạc',[99,103,104]],
 ['am-thanh','phu-kien-nguon-dien','Phụ kiện & nguồn điện',[53,102]],
]
await client.connect()
try {
 await client.query('BEGIN')
 const before = await client.query('SELECT id,category_id,image_id FROM products ORDER BY id')
 const roots = ['van-phong','may-tinh','mang','camera','hoi-nghi','phan-mem','hinh-anh','iot','am-thanh']
 const assigned = plan.flatMap(x=>x[3])
 if (new Set(assigned).size !== assigned.length || assigned.length !== 137) throw new Error('Incomplete or duplicate category mapping')
 await client.query('UPDATE product_categories SET parent_id=NULL WHERE slug=ANY($1)',[roots])
 for (const [root,slug,name,ids] of plan) {
   const parent = (await client.query('SELECT id FROM product_categories WHERE slug=$1',[root])).rows[0].id
   const group = (await client.query(`INSERT INTO product_categories(name,slug,parent_id,show_in_menu,indexable) VALUES($1,$2,$3,true,true)
     ON CONFLICT(slug) DO UPDATE SET parent_id=excluded.parent_id RETURNING id`,[name,slug,parent])).rows[0].id
   await client.query('UPDATE product_categories SET parent_id=$1 WHERE id=ANY($2)',[group,ids])
 }
 const check=await client.query(`WITH RECURSIVE tree AS (SELECT id,1 depth FROM product_categories WHERE parent_id IS NULL UNION ALL SELECT c.id,t.depth+1 FROM product_categories c JOIN tree t ON c.parent_id=t.id) SELECT (SELECT count(*) FROM product_categories WHERE parent_id IS NULL)::int roots,count(*)::int total,max(depth)::int depth FROM tree`)
 const after = await client.query('SELECT id,category_id,image_id FROM products ORDER BY id')
 if(JSON.stringify(before.rows)!==JSON.stringify(after.rows)) throw new Error('Product relationships changed')
 const stats=check.rows[0]
 if(stats.roots!==9 || stats.depth!==3) throw new Error('Invalid tree')
 await client.query('COMMIT')
 console.log(JSON.stringify({...stats,products:after.rowCount,relationshipsPreserved:true}))
} catch(error) { await client.query('ROLLBACK'); throw error }
finally {await client.end()}
