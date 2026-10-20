import { test } from 'node:test'
import assert from 'node:assert/strict'
import { categoryMatch, productFacts, normalize } from './catalog-category-rules.mjs'

const fact=(name,tax,brand,specs=[],price=20000000)=>productFacts({id:1,name,price,short_spec:''},{name:tax},{name:brand},specs.map(([label,value])=>({label,value})))
const match=(product,root,group,label)=>categoryMatch(product,{name:label},[{name:root},{name:group}])

test('Vietnamese names and spec labels normalize consistently',()=>{
 assert.equal(normalize('Điện thoại'),'dien thoai')
 assert.equal(normalize('Độ phân giải'),'do phan giai')
})
test('installed RAM and SSD capacity use actual configuration, not supported maximum',()=>{
 const p=fact('Laptop MSI Venture Pro 16 AI','Laptop','MSI',[['Bộ nhớ','16GB'],['Hỗ trợ RAM tối đa','96GB'],['Ổ cứng','512GB SSD'],['Loại ổ cứng','SSD'],['Vi xử lý','Ultra 7 155H'],['Màn hình','16 inch 2K']])
 assert.equal(match(p,'Laptop','Laptop theo RAM – ổ cứng','RAM 16GB'),true)
 assert.equal(match(p,'Laptop','Laptop theo RAM – ổ cứng','RAM 64GB trở lên'),false)
 assert.equal(match(p,'Laptop','Laptop theo RAM – ổ cứng','SSD 512GB'),true)
 assert.equal(match(p,'Laptop','Laptop theo CPU','Intel Core Ultra 7'),true)
 assert.equal(match(p,'Laptop','Laptop theo kích thước','16 inch'),true)
})
test('AIO and Mini PC distinguish form factors within the same brand',()=>{
 const tower=fact('PC Dell Tower ECT1250','Máy tính để bàn','Dell')
 const aio=fact('Máy tính AIO Dell 24 EC24250','Máy tính để bàn','Dell')
 assert.equal(match(tower,'PC & Máy bộ','All in One theo hãng','AIO Dell'),false)
 assert.equal(match(aio,'PC & Máy bộ','All in One theo hãng','AIO Dell'),true)
 assert.equal(match(tower,'PC & Máy bộ','PC đồng bộ theo dòng','Dell Tower / Slim'),true)
 assert.equal(match(tower,'PC & Máy bộ','Mini PC theo hãng','Asus NUC'),false)
})
test('tablet pricing excludes accessories; printer pricing excludes ink',()=>{
 const charger=fact('Củ sạc Pisen 20W','Điện thoại','Pisen',[],200000)
 const ink=fact('Mực in HP 72','Mực và vật tư máy in','HP',[],500000)
 assert.equal(match(charger,'Máy tính bảng & phụ kiện','Máy tính bảng theo giá','Dưới 5 triệu'),false)
 assert.equal(match(ink,'Máy in & Mực in','Máy in theo giá','Dưới 3 triệu'),false)
 assert.equal(match(ink,'Máy in & Mực in','Mực in chính hãng','Mực HP'),true)
})
test('server infrastructure switch does not include keyboard switch names',()=>{
 const keyboard=fact('Bàn phím cơ Aula switch Brown','Thiết bị văn phòng','Aula')
 assert.equal(match(keyboard,'Máy chủ & Máy trạm','Hạ tầng phòng máy','Switch'),false)
})

test('source aliases recover wireless adapters, gaming desks and landline phones',()=>{
 const usb=fact('Card mạng không dây TP-Link USB Archer TX20U','Thiết bị mạng','TP-Link')
 const pci=fact('Card mạng không dây Totolink PCI-E X5400PE','Thiết bị mạng','Totolink')
 const desk=fact('Bàn chơi game EDRA EGT1460ZS','Thiết bị văn phòng','E-Dra',[['Loại sản phẩm','Bàn']])
 const keyboard=fact('Bàn phím gaming E-Dra EK398L','Thiết bị văn phòng','E-Dra')
 const phone=fact('Điện thoại CĐ Panasonic KXTS820-Đen','Thiết bị văn phòng','Panasonic',[['Loại sản phẩm','Điện thoại bàn']])
 assert.equal(match(usb,'Thiết bị mạng & Camera','Card mạng – Phụ kiện','Card Wi-Fi USB'),true)
 assert.equal(match(usb,'Thiết bị mạng & Camera','Card mạng – Phụ kiện','Card Wi-Fi PCI-e'),false)
 assert.equal(match(pci,'Thiết bị mạng & Camera','Card mạng – Phụ kiện','Card Wi-Fi PCI-e'),true)
 assert.equal(match(desk,'Thiết bị văn phòng','Gaming gear HOT','Bàn gaming'),true)
 assert.equal(match(keyboard,'Thiết bị văn phòng','Gaming gear HOT','Bàn gaming'),false)
 assert.equal(match(phone,'Thiết bị văn phòng','Máy văn phòng','Điện thoại bàn'),true)
})
test('source type and compatibility support categories without guessing from brand',()=>{
 const vivo=fact('Laptop Asus Gaming Vivobook V3607VU-TK416W','Laptop','Asus')
 const charger=fact('Củ sạc Pisen Pro-EVA Mecha 65W TP-C04','Điện thoại','Pisen',[['Tính năng','Sạc laptop']])
 const smallCharger=fact('Củ sạc Pisen 20W','Điện thoại','Pisen')
 const mouse=fact('Chuột không dây Thunderobot ML101','Thiết bị văn phòng','Thunderobot',[['Loại sản phẩm','Chuột']])
 const gamingMouse=fact('Chuột Gaming Logitech G304','Thiết bị văn phòng','Logitech',[['Loại sản phẩm','Chuột']])
 const warranty=fact('Gói bảo hành Microsoft','Phần mềm bản quyền','Microsoft',[['Loại sản phẩm','Gói bảo hành mở rộng']])
 assert.equal(match(vivo,'Laptop','Laptop theo hãng','Vivobook Gaming'),true)
 assert.equal(match(charger,'Laptop','Phụ kiện laptop','Sạc laptop'),true)
 assert.equal(match(smallCharger,'Laptop','Phụ kiện laptop','Sạc laptop'),false)
 assert.equal(match(mouse,'Thiết bị văn phòng','Chuột – Bàn phím','Chuột văn phòng'),true)
 assert.equal(match(gamingMouse,'Thiết bị văn phòng','Chuột – Bàn phím','Chuột văn phòng'),false)
 assert.equal(match(warranty,'Phần mềm bản quyền','Phần mềm ứng dụng','Phần mềm khác'),false)
})

test('manufacturer-confirmed ExpertCenter P500 models exclude unrelated ASUS desktops',()=>{
 for(const model of ['P500MV-05210H003W','P500SV-13620H004W'])assert.equal(match(fact(`PC Asus ${model}`,'Máy tính để bàn','Asus'),'PC & Máy bộ','PC đồng bộ theo dòng','Asus ExpertCenter'),true)
 assert.equal(match(fact('PC Asus V501MV-03100U014W','Máy tính để bàn','Asus'),'PC & Máy bộ','PC đồng bộ theo dòng','Asus ExpertCenter'),false)
 assert.equal(match(fact('PC Asus S501SER-514400057W','Máy tính để bàn','Asus'),'PC & Máy bộ','PC đồng bộ theo dòng','Asus ExpertCenter'),false)
})

test('zero PostgreSQL prices stay out of price bands and standalone SSD titles classify',()=>{
 const mac=fact('Apple Mac mini M4 16GB 256GB SSD','Máy tính để bàn','Apple',[],'0')
 const ssd=fact('SSD Samsung 990 EVO Plus 1TB','Linh kiện máy tính','Samsung')
 assert.equal(match(mac,'PC & Máy bộ','Theo khoảng giá','Dưới 10 triệu'),false)
 assert.equal(match(ssd,'PC & Máy bộ','Phụ kiện PC','Nâng cấp SSD'),true)
 const hpe=fact('Máy chủ HPE ProLiant MicroServer Gen11','Máy chủ và lưu trữ','HPE')
 assert.equal(match(hpe,'Máy chủ & Máy trạm','Máy chủ – Server','Máy chủ HP'),true)
})
