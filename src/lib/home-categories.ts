export type CategoryIcon = 'printer' | 'laptop' | 'network' | 'camera' | 'meeting' | 'software' | 'power' | 'menu'

// Legacy HPT import mapping. Live navigation is loaded from product-categories.
export const homeCategories = [
  {
    key: 'van-phong', name: 'Thiết bị văn phòng', icon: 'printer', primary: 'may-scan',
    slugs: ['may-scan', 'may-scan-tai-lieu-adf', 'may-in-laser-den-trang', 'may-in-laser-mau', 'may-photocopy', 'may-in-phun'],
    links: [['Máy scan', 'may-scan'], ['Scan tài liệu ADF', 'may-scan-tai-lieu-adf'], ['Máy in laser', 'may-in-laser-den-trang'], ['Máy photocopy', 'may-photocopy']],
  },
  {
    key: 'may-tinh', name: 'Laptop & máy tính', icon: 'laptop', primary: 'laptop',
    slugs: ['laptop', 'laptop-gaming-do-hoa', 'pc-dong-bo', 'pc-all-in-one', 'mini-pc-nuc', 'may-chu-server'],
    links: [['Laptop văn phòng', 'laptop'], ['Laptop gaming', 'laptop-gaming-do-hoa'], ['PC đồng bộ', 'pc-dong-bo'], ['Máy chủ', 'may-chu-server']],
  },
  {
    key: 'mang', name: 'Thiết bị mạng', icon: 'network', primary: 'router-wifi',
    slugs: ['router-wifi', 'access-point-controller', 'switch-poe', 'switch-thuong', 'mesh-bo-mo-rong-song', 'thiet-bi-firewall'],
    links: [['Router WiFi', 'router-wifi'], ['Access Point', 'access-point-controller'], ['Switch PoE', 'switch-poe'], ['Firewall', 'thiet-bi-firewall']],
  },
  {
    key: 'camera', name: 'Camera & giám sát', icon: 'camera', primary: 'camera-quan-sat',
    slugs: ['camera-quan-sat', 'camera-hoi-nghi', 'o-cung-camera', 'phu-kien-camera'],
    links: [['Camera quan sát', 'camera-quan-sat'], ['Camera hội nghị', 'camera-hoi-nghi'], ['Ổ cứng camera', 'o-cung-camera'], ['Phụ kiện', 'phu-kien-camera']],
  },
  {
    key: 'hoi-nghi', name: 'Hội nghị & giáo dục', icon: 'meeting', primary: 'camera-hoi-nghi',
    slugs: ['camera-hoi-nghi', 'camera-meeting-kandao', 'may-chieu-vat-the-document-camera', 'may-nhac-chu'],
    links: [['Camera hội nghị', 'camera-hoi-nghi'], ['Camera Kandao', 'camera-meeting-kandao'], ['Máy chiếu vật thể', 'may-chieu-vat-the-document-camera']],
  },
  {
    key: 'phan-mem', name: 'Phần mềm bản quyền', icon: 'software', primary: 'phan-mem-office-van-phong',
    slugs: ['phan-mem-office-van-phong', 'microsoft-365-dich-vu-dam-may', 'phan-mem-he-dieu-hanh', 'phan-mem-diet-virus-bao-mat', 'windows-server-sql'],
    links: [['Office', 'phan-mem-office-van-phong'], ['Microsoft 365', 'microsoft-365-dich-vu-dam-may'], ['Hệ điều hành', 'phan-mem-he-dieu-hanh'], ['Bảo mật', 'phan-mem-diet-virus-bao-mat']],
  },
  {
    key: 'hinh-anh', name: 'Thiết bị hình ảnh', icon: 'camera', primary: 'may-anh-canon',
    slugs: ['may-anh-canon', 'may-anh-sony', 'may-anh-fujifilm', 'ong-kinh-canon', 'ong-kinh-sony', 'may-quay-sony'],
    links: [['Máy ảnh Canon', 'may-anh-canon'], ['Máy ảnh Sony', 'may-anh-sony'], ['Ống kính', 'ong-kinh-canon'], ['Máy quay', 'may-quay-sony']],
  },
  {
    key: 'iot', name: 'IoT & công nghiệp', icon: 'network', primary: 'thiet-bi-iot',
    slugs: ['thiet-bi-iot', 'mo-dun-iot', 'iot-nang-luong-mat-troi', 'may-tinh-cong-nghiep'],
    links: [['Thiết bị IoT', 'thiet-bi-iot'], ['Mô-đun IoT', 'mo-dun-iot'], ['Năng lượng mặt trời', 'iot-nang-luong-mat-troi'], ['Máy tính công nghiệp', 'may-tinh-cong-nghiep']],
  },
  {
    key: 'am-thanh', name: 'Âm thanh & nguồn điện', icon: 'power', primary: 'micro-thu-am',
    slugs: ['micro-thu-am', 'loa-kiem-am', 'sound-card-am-thanh', 'nguon-poe-adapter', 'linh-kien-cao-tan-rf'],
    links: [['Micro thu âm', 'micro-thu-am'], ['Loa kiểm âm', 'loa-kiem-am'], ['Sound Card', 'sound-card-am-thanh'], ['Nguồn PoE', 'nguon-poe-adapter']],
  },
] as const
