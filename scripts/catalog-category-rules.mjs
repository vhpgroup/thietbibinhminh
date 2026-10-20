export const normalize = value => String(value || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/đ/g, 'd').toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim()
const has = (text, pattern) => pattern.test(text)
export function productFacts(product, category, brand, specs) {
 const fields = new Map(specs.map(s => [normalize(s.label), normalize(s.value)]))
 const get = (...keys) => keys.map(k => fields.get(normalize(k)) || '').filter(Boolean).join(' ')
 const name=normalize(product.name), type=get('Loại sản phẩm','Nhóm hàng'), tax=normalize(category.name)
 const accessory=/^(bao da|ban phim|but |cap |cu sac|sac |op lung|tui |balo|gia |bo chuyen|dau chuyen)/.test(name)
 const laptop=tax==='laptop'&&!accessory, pc=tax==='may tinh de ban', monitor=tax==='man hinh'&&/^man hinh/.test(name)
 const tablet=!accessory&&/ipad|may tinh bang|galaxy tab|lenovo tab/.test(name)
 const aio=pc&&/\baio\b|all.in.one|lien man|\bimac\b|eliteone|proone|omnistudio|elitestudio|prostudio/.test(name)
 const mini=pc&&/\bmini\b|\bnuc\b|\bcubi\b|\btiny\b/.test(name)
 const printer=tax==='may in'&&/^may in/.test(name), ink=tax==='muc va vat tu may in'
 const wifi=tax==='thiet bi mang'&&/bo phat|router|access point/.test(name+' '+type)&&!/switch/.test(name)
 const camera=/^(camera|bo camera)/.test(name), server=/^may chu\b|^server\b/.test(name)
 const workstation=/workstation|thinkstation|precision|pro max|may tram/.test(name)&&!accessory
 const nas=/nas|luu tru mang/.test(name)&&!/^(ram|bo nho|o cung|card|nguon|thiet bi mo rong)/.test(name)
 const ups=tax==='bo luu dien'&&/^bo luu dien|^ups\b/.test(name)
 const cpu=get('Vi xử lý','Dòng CPU','Mã CPU','Chipset/ CPU')
 const ram=get('Bộ nhớ','Bộ nhớ trong','Dung lượng RAM'), storage=get('Ổ cứng','Dung lượng ổ cứng')
 const screen=get('Kích thước màn hình','Màn hình')||(monitor?get('Kích thước'):'')
 const inch=+(screen.match(/(\d{2}(?:[.,]\d+)?)\s*(?:inch|"|”)/)?.[1]?.replace(',','.')||0)
 const ramGB=+(ram.match(/(\d+)\s*gb/)?.[1]||0)
 const drive=storage.match(/(\d+(?:[.,]\d+)?)\s*(tb|gb)/), diskGB=drive?Number(drive[1].replace(',','.'))*(drive[2]==='tb'?1024:1):0
 return {...product,price:Number(product.price)||0,name,type,tax,brand:normalize(brand?.name),get,fields,laptop,pc,tablet,aio,mini,monitor,printer,ink,wifi,camera,server,workstation,nas,ups,cpu,ramGB,diskGB,inch,accessory,
  text:name+' '+type+' '+normalize(product.short_spec),
  hz:+(get('Tần số quét').match(/(\d+)\s*hz/)?.[1]||0),
  va:(()=>{const m=get('Công suất').match(/(\d+(?:[.,]\d+)?)\s*(kva|va)\b/);return m?Number(m[1].replace(',','.'))*(m[2]==='kva'?1000:1):0})()}
}
function scoped(p,root,group){
 if(/phu kien laptop|phu kien pc|ha tang phong may|phu kien man hinh/.test(group))return true
 if(root==='Thiết bị mạng & Camera'&&group==='nha thong minh')return /thiet bi nha thong minh/.test(p.type)||/^may hut am|^den.*thong minh|^thiet bi.*thong minh|^o cam.*thong minh/.test(p.name)
 return ({'Laptop':p.laptop,'Apple':/apple/.test(p.brand)||/macbook|ipad|iphone|imac|mac mini|airpods|apple pencil|magic keyboard|magic mouse/.test(p.name),
 'Máy tính bảng & phụ kiện':p.tax==='dien thoai'||p.tablet,'PC & Máy bộ':p.pc||(group==='loai may'&&(p.server||p.workstation)),'Màn hình':p.tax==='man hinh',
 'Thiết bị mạng & Camera':p.tax==='thiet bi mang','Máy chủ & Máy trạm':p.tax==='may chu va luu tru'||p.server||p.workstation,
 'Bộ lưu điện':p.ups,'Thiết bị văn phòng':p.tax==='thiet bi van phong'||p.monitor||p.printer,
 'Máy in & Mực in':p.printer||p.ink,'Phần mềm bản quyền':p.tax==='phan mem ban quyen'})[root]??false
}
export function categoryMatch(p,category,ancestors){
 const root=ancestors[0].name,group=normalize(ancestors[1]?.name),label=normalize(category.name).replace(/\b(hot|new)\b/g,'').trim(),n=p.name,t=p.text,g=p.get
 const inScope=scoped(p,root,group)
 // Null means no reliable rule; retain original source membership.
 if(!inScope)return false
 if(label==='may chu hp'&&p.server&&p.brand==='hpe')return true
 if(label==='may tram asus')return p.workstation&&p.brand==='asus'
 if(root==='Màn hình'&&['kich thuoc','do phan giai','tan so quet','tam nen'].includes(group)&&!p.monitor)return false
 if(root==='Máy in & Mực in'&&group!=='muc in chinh hang'&&!p.printer)return false
 if(root==='Máy in & Mực in'&&group==='muc in chinh hang'&&!p.ink)return false
 const brandMatch=label.includes(p.brand)&&p.brand&&p.brand!=='chua xac dinh'
 if(/theo gia|khoang gia/.test(group)){
  const good=root==='Máy tính bảng & phụ kiện'?p.tablet:root==='Máy in & Mực in'?p.printer:true
  if(!good||!p.price)return false
  const values=[...label.matchAll(/\d+(?:\.\d+)?/g)].map(m=>+m[0]*1000000)
  return values.length===2?p.price>=values[0]&&p.price<values[1]:label.includes('duoi')?p.price<values[0]:p.price>=values[0]
 }
 if(/cpu/.test(group)){
  if(label.includes('ultra'))return /\bultra/.test(p.cpu)&&(!/\d/.test(label)||new RegExp('ultra\\s*'+label.match(/\d/)[0]+'\\b').test(p.cpu))
  if(label.includes('ryzen'))return /ryzen|\br[3579]\b/.test(p.cpu)&&(!/\d/.test(label)||new RegExp('(?:ryzen\\s*|\\br)'+label.match(/\d/)[0]+'\\b').test(p.cpu))
  if(/core/.test(label)){const tier=label.match(/[3579]/)?.[0];return tier?new RegExp('(?:core\\s*i?'+tier+'|\\bi'+tier+')\\b').test(p.cpu):false}
  if(/apple m/.test(label)){const chips=[...label.matchAll(/m([1-9])/g)].map(m=>m[1]);return chips.some(chip=>new RegExp('\\bm'+chip+'\\b').test(p.cpu+' '+n))}
 }
 if(group.includes('ram - o cung')){
  const capacity=+(label.match(/\d+/)?.[0]||0)
  if(label.startsWith('ram'))return label.includes('tro len')?p.ramGB>=capacity:p.ramGB===capacity
  if(label.startsWith('ssd'))return p.diskGB===capacity*(label.includes('tb')?1024:1)&&/ssd/.test(g('Loại ổ cứng','Ổ cứng'))
 }
 if(group==='kich thuoc'||group.includes('theo kich thuoc')){
  if(!p.inch)return false
  const values=[...label.matchAll(/\d+(?:[.,]\d+)?/g)].map(m=>+m[0].replace(',','.'))
  return label.includes('duoi')?p.inch<values[0]:label.includes('tro len')?p.inch>=values[0]:values.length===2?p.inch>=values[0]&&p.inch<=values[1]:p.inch>=values[0]&&p.inch<values[0]+1
 }
 if(group==='tan so quet'){
  const values=[...label.matchAll(/\d+/g)].map(m=>+m[0]);return p.hz>0&&(values.length===2?p.hz>=values[0]&&p.hz<=values[1]:p.hz>=values[0])
 }
 if(group==='do phan giai'){
  const resolution=g('Độ phân giải');return label.includes('full hd')?/1920\s*[x×*]\s*1080|full hd|1080p/.test(resolution):label.includes('2k')?/2560\s*[x×*]\s*1440|2k|qhd/.test(resolution):label.includes('4k')?/3840\s*[x×*]\s*2160|4k|uhd/.test(resolution):/5k|6k|5120|6016/.test(resolution)
 }
 if(group==='tam nen')return g('Tấm nền').includes(label)
 if(group==='theo cong suat'){
  if(!p.va)return false
  const values=[...label.matchAll(/\d+/g)].map(m=>+m[0]);if(label.includes('kva'))values[0]*=1000
  return label.includes('duoi')?p.va<values[0]:values.length===2?p.va>=values[0]&&p.va<=values[1]:p.va>=values[0]
 }
 const rules={
  'dell 14 / 15 / 16':/\bdell (?:14|15|16)(?!.*plus)/,'dell 14 / 16 plus':/\bdell (?:14|16) plus/,'dell 14 / 15':/\bdell (?:14|15)(?!.*plus)/,
  'hp 14 / 15':/\bhp (?:14|15)(?:\s|[a-z0-9-])/,'rog gaming':/\brog\b/,'asus rog':/\brog\b/,'vivobook gaming':/(?:gaming.*vivobook|vivobook.*(?:gaming|\bv16\b))/,
  'loq':/\bloq\b/,'lenovo v14 / v15':/\blenovo v(?:14|15)/,'thin / crosshair':/\bthin\b|crosshair/,'titan / stealth':/titan|stealth/,
  'venture / creator':/venture|creator/,'gigabyte a16 / g6':/gigabyte.*(?:a16|g6)/,'msi modern / prestige':/msi.*(?:modern|prestige)/,
  'hp victus':/\bvictus\b/,'acer nitro':/\bnitro\b/,
  'dell pro / optiplex':/dell.*(?:pro|optiplex)/,'dell tower / slim':/dell.*(?:tower|slim)/,'hp 280 / 290':/hp.*\b(?:280|290)\b/,
  'elitestudio / prostudio':/elitestudio|prostudio/,'thinkcentre m':/thinkcentre\s+m\d/,'asus expertcenter':/asus.*(?:expert\s*center|\bp500(?:mv|sv)\b)/,
  'dell e / se':/dell\s+(?:e|se)\d/,'smart monitor':/smart monitor|man hinh thong minh samsung/,'viewsonic va':/viewsonic va\d/,'viewsonic vx':/viewsonic vx\d/,
  'viewsonic xg gaming':/viewsonic xg\d/,'viewsonic vp do hoa':/viewsonic vp\d/,'rog':/\brog\b/,'asus va / vy / vz':/asus\s+v[ayz]\d/,
  'mag':/\bmag\s*\d/,'mpg':/\bmpg\s*\d/,'hp series 3 / 5 / 7':/hp\s+(?:series\s*)?[s357]\d/,'acer ka / ek / sa':/acer\s+(?:ka|ek|sa)\d/,
  'gaming mobiuz / zowie':/mobiuz|zowie|benq.*\bxl\d/,'do hoa pd / sw':/benq\s+(?:pd|sw)\d/,'van phong gw / bl':/benq\s+(?:gw|bl)\d/,
  'samsung galaxy tab s':/samsung.*(?:galaxy\s*)?tab s/,'samsung galaxy tab a':/samsung.*(?:galaxy\s*)?tab a/,
  'sac khong day - magsafe':/sac.*(?:khong day|magsafe)/,'dau chuyen - otg':/otg|dau chuyen/,
  'ban phim cho ipad / tablet':/ban phim.*(?:ipad|tablet|surface)/,'bao da - op lung':/^(bao da|op lung)/,
  'balo - tui laptop':/^(balo|ba lo|tui).*?(?:laptop|macbook|chong soc)/,'sac laptop':/^(sac|adapter).*?(?:laptop|macbook)/,
  'ram laptop':/^(ram|bo nho).*?(?:laptop|sodimm|so-dimm)/,'bo chuyen doi - hub usb-c':/^(hub|bo chuyen|dau chuyen).*?(?:usb|type.c)/,
  'ban phim - chuot':/^(ban phim|chuot|bo ban phim)/,'cap hdmi - displayport':/^(cap|day).*?(?:hdmi|displayport)/,
  'bo chuyen doi hinh anh':/^(bo chuyen|dau chuyen).*?(?:hdmi|displayport|vga)/,'webcam - thiet bi hoi nghi':/webcam|camera.*hoi nghi/,
  'loa - mic hoi nghi':/(?:loa|micro|mic).*hoi nghi/,'lot chuot':/^(lot chuot|ban di chuot)/,
  'ghe gaming - cong thai hoc':/^ghe.*(?:gaming|cong thai hoc)/,'ban gaming':/^ban (?!phim).*gaming/,
  'may scan tai lieu':/^may (?:scan|quet)(?!.*ma vach)/,'may scan 2 mat tu dong':/^may scan/,
  'may huy cong nghiep':/^may huy.*cong nghiep/,'dien thoai ban':/^dien thoai (?:ban|co day|khong day)/,
  'may in ma vach - tem nhan':/^may in.*(?:ma vach|tem|nhan)/,'may in hoa don':/^may in.*hoa don/,
  'trong - drum':/drum|trong.*may in|cum trong/,'muc photocopy':/^(muc|hop muc).*(?:photocopy|may photo)/,
  'autodesk - autocad':/autodesk|autocad/,'trend micro - symantec':/trend micro|symantec/,
  'windows ban quyen':/windows(?! server)/,'office ban quyen':/office/,
  'card wi-fi usb':/^(card|bo thu|usb).*?(?:wifi|wi-fi)/,'card wi-fi pci-e':/^(card).*?(?:wifi|wi-fi).*?(?:pci|pcie)/,
  'cap mang - day nhay':/^(cap mang|day nhay)/,'module quang sfp':/module.*quang|\bsfp\b/,'tu mang - tu rack':/^tu.*(?:mang|rack)/,
  'tuong lua firewall':/firewall|tuong lua/,'o cung camera':/^o cung.*(?:camera|skyhawk|purple)/,'o cung nas':/^o cung.*(?:nas|ironwolf|red plus|red pro)/,
  'nang cap ram':/^(ram|bo nho ram)/,'nang cap ssd':/^(?:o cung.*ssd|ssd\b)/,
  'may tram dung san paws':/paws/,'dell pro max / precision':/dell.*(?:pro max|precision)/,'hp z workstation':/hp.*(?:\bz\d|workstation)/,
  'laptop may tram':/^(laptop).*?(?:workstation|precision|thinkpad p\d|zbook)/,
 }
 // ASUS confirms P500MV/P500SV as ExpertCenter P500:
 // https://press.asus.com/news/press-releases/asus-expertcenter-p500-mini-tower/
 // https://press.asus.com/news/press-releases/asus-expertcenter-p500-sff-desktop/
 // Source vocabulary often describes the type in specs rather than the title.
 if(label==='sac laptop')return /^(cu sac|sac |adapter)/.test(n)&&(/laptop|macbook/.test(n)||/sac laptop/.test(g('Tính năng','Dùng cho máy')))
 if(label==='bo chuyen doi hinh anh')return /^(cap chuyen doi|bo chuyen|dau chuyen)/.test(n)&&/hdmi|displayport|vga/.test(n)
 if(label==='card wi-fi usb'||label==='card wi-fi pci-e'){
  const wireless=/^card mang khong day/.test(n)||(/^card/.test(n)&&/wi-?fi/.test(n))
  const connection=n+' '+g('Cổng kết nối','Giao tiếp','Chuẩn giao tiếp','Chuẩn cắm')
  return wireless&&(label==='card wi-fi usb'?/\busb\b/.test(connection):/pci[ -]?e|pcie/.test(connection))
 }
 if(label==='phu kien mang')return /phu kien thiet bi mang/.test(p.type)&&!/^(dien thoai|switch|camera)/.test(n)
 if(label==='thiet bi nha thong minh')return /thiet bi nha thong minh/.test(p.type)
 if(label==='chuot van phong')return /^chuot/.test(n)&&/\bchuot\b/.test(p.type)&&!/gaming|choi game/.test(n+' '+p.type)
 if(label==='ban gaming')return /^ban (?!phim\b|di chuot|re cam ung|lap trinh)/.test(n)&&/gaming|choi game/.test(n)
 if(label==='dien thoai ban')return /^dien thoai/.test(n)&&(/dien thoai ban/.test(p.type)||/dien thoai (ban|co day|khong day|keo dai|cd)\b/.test(n))
 if(label==='phan mem khac')return !/bao hanh|autopilot/.test(n+' '+p.type)&&/winrar|canva|capcut|synology.*license|microsoft.*(?:visio|project|power automate|access|exchange)/.test(n)
 if(rules[label])return rules[label].test(n)
 if(group==='phu kien pc'&&label==='loa vi tinh')return /^loa/.test(n)&&/vi tinh/.test(n+' '+p.type)
 if(group==='phu kien pc'&&label==='webcam')return /^webcam/.test(n)
 if(group==='phu kien laptop'&&label==='gia do - phu kien khac')return /^gia do.*(?:laptop|macbook)/.test(n)
 if(root==='Màn hình'&&label==='google tv / tcl')return /tivi|google tv/.test(n)&&p.brand==='tcl'
 if(label==='bo mo rong song')return /mo rong song|repeater|range extender/.test(n)
 if(label==='may hut am')return /^may hut am/.test(n)
 if(label==='chuot van phong')return /^chuot/.test(n)&&/van phong/.test(g('Nhu cầu','Nhu cầu sử dụng'))
 if(label==='may chieu mini - gia dinh')return /^may chieu/.test(n)&&/mini|gia dinh/.test(n+' '+g('Nhu cầu'))
 if(label==='man hinh tuong tac')return /man hinh.*tuong tac/.test(n)
 if(root==='Máy in & Mực in'&&label==='may in ma vach')return p.printer&&/ma vach|tem|nhan/.test(n)
 if(label==='ban phim logitech')return /^ban phim/.test(n)&&p.brand==='logitech'
 if(label==='tat ca may tinh bang'||label==='apple ipad')return p.tablet&&(label!=='apple ipad'||/ipad/.test(n))
 if(label==='ban 5g / lte')return p.tablet&&/5g|lte|cellular/.test(g('Kết nối di động')+' '+t)
 if(label==='pc dong bo de ban')return p.pc&&!p.aio&&!p.mini&&!p.workstation
 if(label==='may tinh all in one')return p.aio
 if(label==='mini pc')return p.mini
 if(label==='may tram workstation'||label==='tat ca may tram')return p.workstation
 if(label==='may chu - server'||label==='tat ca may chu')return p.server
 if(group==='all in one theo hang')return p.aio&&(brandMatch||(label==='apple imac'&&/imac/.test(n))||(label.includes('27 inch')&&p.inch===27)||(label.includes('23.8')&&p.inch>=23.8&&p.inch<=24))
 if(group==='mini pc theo hang')return p.mini&&brandMatch&&(label==='asus nuc'?/\bnuc/.test(n):label==='msi cubi'?/\bcubi/.test(n):label==='hp pro mini'?/pro.*mini|mini.*pro/.test(n):/mac mini/.test(n))
 if(group==='phu kien pc'){
  if(label==='man hinh')return p.monitor
  if(label==='bo luu dien ups')return p.ups
 }
 if(group==='phu kien laptop'&&label==='chuot')return /^chuot/.test(n)
 if(root==='Laptop'&&group.includes('theo nhu cau')){
  const gaming=/gaming|rog|tuf|legion|loq|victus|omen|nitro|predator|katana|cyborg|sword|thin|crosshair|titan|stealth|aorus/.test(n)
  if(label.includes('gaming'))return gaming
  if(label.includes('van phong'))return !gaming&&!p.workstation
  if(label.includes('do hoa'))return /do hoa|thiet ke|creator|studio|workstation/.test(n+' '+g('Nhu cầu'))
  if(label.includes('laptop ai'))return /ultra|ryzen ai|copilot/.test(p.cpu+' '+g('Tính năng đặc biệt'))
  if(label.includes('mong nhe')){const kg=g('Trọng lượng').match(/(\d+(?:[.,]\d+)?)\s*kg/);return !!kg&&+kg[1].replace(',','.')<=1.5}
  if(label.includes('2 trong 1'))return /2.in.1|2 trong 1|x360|flip/.test(n+' '+g('Tính năng đặc biệt'))
  if(label.includes('may tram'))return p.workstation
 }
 if(root==='Màn hình'&&group.includes('theo nhu cau')){
  if(!p.monitor)return false
  const need=g('Nhu cầu')
  if(label.includes('van phong'))return /van phong/.test(need)
  if(label.includes('ultrawide'))return p.inch>=34&&/21:9|32:9|ultrawide|uwqhd|3440|5120/.test(g('Tỷ lệ khung hình','Tỉ lệ màn hình','Tỷ lệ màn hình','Độ phân giải')+' '+n)
  if(label.includes('usb-c'))return /usb.?c|type.?c/.test(g('Cổng giao tiếp'))
  if(label.includes('oled'))return /oled/.test(g('Tấm nền')+' '+n)
 }
 if(root==='Thiết bị mạng & Camera'&&group.startsWith('bo phat wi-fi')){
  if(!p.wifi)return false
  if(label.includes('tat ca'))return true
  if(label.includes('wi-fi 7'))return /wifi 7|wi-fi 7|802.11be/.test(t+' '+g('Chuẩn wifi'))
  if(label.includes('wi-fi 6'))return /wifi 6|wi-fi 6|802.11ax/.test(t+' '+g('Chuẩn wifi'))
  if(label.includes('mesh'))return /mesh/.test(t+' '+g('Công nghệ'))
  if(label.includes('4g / 5g'))return /4g|5g/.test(t)
  if(label.includes('access point'))return /access point|eap\d|unifi|eap/.test(n+' '+p.type)
  return brandMatch
 }
 if(root==='Thiết bị mạng & Camera'&&group==='switch - router'){
  if(label.includes('poe'))return /switch/.test(n)&&/poe/.test(t+' '+g('Cổng kết nối'))
  if(label.includes('managed'))return /switch/.test(n)&&/managed|quan ly/.test(t+' '+g('Loại sản phẩm'))&&!/unmanaged|khong quan ly/.test(t)
  if(label.includes('cong')){const port=+(g('Số cổng','Cổng kết nối').match(/(\d+)\s*(?:cong|port)/)?.[1]||n.match(/(\d+)\s*(?:cong|port)/)?.[1]||0),v=[...label.matchAll(/\d+/g)].map(m=>+m[0]);return /switch/.test(n)&&port>0&&(v.length===2?port>=v[0]&&port<=v[1]:port===v[0])}
 }
 if(group==='camera an ninh'){
  if(label==='tat ca camera')return p.camera
  if(label.includes('camera')&&/imou|ezviz|dahua|tapo/.test(label))return p.camera&&(/tapo/.test(label)?/tapo/.test(n):brandMatch)
  if(label.includes('trong nha'))return p.camera&&/trong nha/.test(g('Vị trí','Loại camera'))&&/wifi|wi-fi/.test(t)
  if(label.includes('dung pin'))return p.camera&&/dung pin|4g/.test(t)
 }
 if(group==='may chu - server'){
  if(label.startsWith('may chu '))return p.server&&brandMatch
  if(label.includes('dang thap'))return p.server&&/tower|dang thap/.test(t+' '+g('Kiểu dáng'))
  if(label.includes('gan tu'))return p.server&&/rack|\br\d{3}\b|\b[124]u\b/.test(t+' '+g('Kiểu dáng'))
  if(label.includes('linh kien'))return p.tax==='may chu va luu tru'&&!p.server&&!p.nas&&!p.workstation
 }
 if(group==='thiet bi luu tru nas'){
  if(label==='tat ca nas')return p.nas
  if(label.includes('khay')){const bays=+(g('Số khay ổ cứng','Số lượng ổ cứng','Số khay').match(/\d+/)?.[0]||t.match(/(\d+)\s*khay/)?.[1]||0);return p.nas&&bays>0&&(label.includes('1 - 2')?bays<=2:bays>=4)}
  if(label.includes('mo rong'))return /mo rong.*nas|expansion/.test(t)
  if(label.startsWith('nas '))return p.nas&&brandMatch
 }
 if(group==='ha tang phong may'){
  if(label==='bo luu dien online')return p.ups&&/\bonline\b/.test(g('Công nghệ'))
  if(label==='switch')return /^switch\b|^bo chia mang/.test(n)
  if(label==='windows server')return p.tax==='phan mem ban quyen'&&/windows server/.test(n)
 }
 if(group==='loai bo luu dien'){
  const tech=g('Công nghệ')
  if(label==='ups online')return /\bonline\b/.test(tech)
  if(label==='ups line interactive')return /line.interactive/.test(tech)
  if(label.includes('offline'))return /offline|line.interactive/.test(tech)
  if(label.includes('rack'))return /rack|\brm\b/.test(t+' '+g('Kiểu dáng'))
 }
 if(label==='smart-ups')return p.ups&&p.brand==='apc'&&/smart/.test(n)
 if(label==='easy ups')return p.ups&&p.brand==='apc'&&/easy/.test(n)
 if(label==='santak online')return p.brand==='santak'&&/\bonline\b/.test(g('Công nghệ'))
 if(label==='santak offline')return p.brand==='santak'&&/offline|line.interactive/.test(g('Công nghệ'))
 if(root==='Máy in & Mực in'){
  if(group==='muc in chinh hang'){
   if(label==='tat ca muc in')return p.ink
   if(label.startsWith('muc ')&&brandMatch)return p.ink
  }
  if(group==='may in theo hang'&&ancestors.length===2)return p.printer&&brandMatch
  if(ancestors.length>2&&normalize(ancestors[1].name)==='may in theo hang'){
   const parent=normalize(ancestors[2].name);if(!p.printer||!parent.includes(p.brand)||!p.brand)return false
  }
  if(label==='da nang'||label==='may in da nang')return p.printer&&/da nang|multifunction|copy.*scan|scan.*copy/.test(t+' '+g('Chức năng','Loại máy in'))
  if(label==='may in in 2 mat tu dong')return p.printer&&/tu dong|co|duplex/.test(g('In đảo mặt'))&&!/khong/.test(g('In đảo mặt'))
  if(label==='may in kho a3')return p.printer&&/\ba3\b/.test(g('Khổ giấy','Khổ giấy chi tiết'))
  if(label==='may in wi-fi')return p.printer&&/wifi|wi-fi|wireless/.test(t+' '+g('Kết nối','Cổng giao tiếp'))
 }
 if(label==='tat ca phan mem diet virus')return /kaspersky|bkav|trend micro|symantec|bitdefender|eset|norton|diet virus/.test(t)
 // General brand/model rules require the actual named series, not brand alone.
 if(/theo hang/.test(group)&&ancestors.length===2&&brandMatch)return true
 return null
}
