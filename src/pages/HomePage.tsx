import { useEffect, useState } from "react";
import { Link } from "react-router";
import binhMinhLogo from "../assets/binh-minh-logo.png";
import { StoreHeader } from "../components/StoreShell";
import { catalogProducts } from "../data/catalog";

type IconName =
  | "menu" | "search" | "map" | "user" | "cart" | "heart" | "chevron"
  | "truck" | "shield" | "refresh" | "headset" | "laptop" | "printer"
  | "network" | "camera" | "meeting" | "software" | "iot" | "power" | "close";

function Icon({ name, size = 21 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    cart: <><path d="M3 4h2l2.2 11h10.9l2-7H6.2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    shield: <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 9a7 7 0 0 1 11.5-2.6L20 9M4 15l2.4 2.6A7 7 0 0 0 18 15" /></>,
    headset: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><path d="M6 14H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2zM18 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2z" /></>,
    laptop: <><rect x="4" y="4" width="16" height="12" rx="1" /><path d="M2 20h20M8 16l-1 4M16 16l1 4" /></>,
    printer: <><path d="M7 8V3h10v5M7 17H4V9h16v8h-3" /><rect x="7" y="14" width="10" height="7" /><path d="M17 11h.01" /></>,
    network: <><circle cx="12" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="m11 8-5 8M13 8l5 8M7 18h10" /></>,
    camera: <><path d="M4 7h3l2-2h6l2 2h3v12H4z" /><circle cx="12" cy="13" r="4" /></>,
    meeting: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M2 20a6 6 0 0 1 12 0M14 16a5 5 0 0 1 8 4" /></>,
    software: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></>,
    iot: <><path d="M8.5 16a5 5 0 1 1 7 0M6 13a8 8 0 1 1 12 0" /><circle cx="12" cy="19" r="2" /></>,
    power: <><path d="M12 2v10M7 5.5a8 8 0 1 0 10 0" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

type Category = {
  name: string;
  icon: IconName;
  columns: { title: string; items: string[] }[];
};

const categories: Category[] = [
  {
    name: "Thiết bị văn phòng", icon: "printer",
    columns: [
      { title: "Máy scan", items: ["Scan tài liệu ADF", "Scan phẳng Flatbed", "Scan khổ lớn A2/A1/A0", "Scan sách & số hóa", "Scan di động", "Scan chuyên dụng"] },
      { title: "Máy in", items: ["Máy in laser", "Máy in phun", "Máy in kim", "Máy in màu", "Máy in đa chức năng"] },
      { title: "Photocopy & vật tư", items: ["Máy photocopy", "Mực in chính hãng", "Mực in tương thích", "Phụ kiện máy in"] },
      { title: "Hãng nổi bật", items: ["Canon", "Epson", "HP", "Brother", "Ricoh / Fujitsu", "Fujifilm"] },
    ],
  },
  {
    name: "Máy tính", icon: "laptop",
    columns: [
      { title: "Laptop", items: ["Laptop Gaming - Đồ họa", "Laptop văn phòng", "Ultrabook mỏng nhẹ", "Laptop AI"] },
      { title: "Máy tính để bàn", items: ["PC đồng bộ", "All-in-One", "Mini PC", "Workstation"] },
      { title: "Máy chủ", items: ["Máy chủ", "Linh kiện máy chủ", "Máy tính công nghiệp"] },
      { title: "Hãng nổi bật", items: ["ASUS", "Lenovo", "Dell", "Acer", "MSI", "HP"] },
    ],
  },
  {
    name: "Thiết bị mạng", icon: "network",
    columns: [
      { title: "Mạng không dây", items: ["Router / Wi-Fi / 4G", "Mesh Wi-Fi", "Access Point", "Card mạng"] },
      { title: "Hạ tầng mạng", items: ["Switch", "Firewall", "Tủ rack", "Cáp & công cụ"] },
      { title: "Giải pháp", items: ["Module quang", "Nguồn PoE", "Cân bằng tải", "Mạng doanh nghiệp"] },
      { title: "Hãng", items: ["TP-Link", "ASUS", "APTEK", "Tenda", "Totolink", "Commscope"] },
    ],
  },
  {
    name: "Camera & giám sát", icon: "camera",
    columns: [
      { title: "Camera", items: ["Camera quan sát", "Camera IP", "Camera Wi-Fi", "Camera hội nghị PTZ"] },
      { title: "Lưu trữ", items: ["Ổ cứng camera", "Đầu ghi hình", "Thẻ nhớ", "Lưu trữ đám mây"] },
      { title: "Phụ kiện", items: ["Nguồn camera", "Chân đế", "Cáp tín hiệu", "Phụ kiện camera"] },
      { title: "Hãng", items: ["Imou", "EZVIZ", "Tenveo", "Western Digital", "Seagate"] },
    ],
  },
  {
    name: "Hội nghị & giáo dục", icon: "meeting",
    columns: [
      { title: "Thiết bị hội nghị", items: ["Camera hội nghị", "Loa & micro", "Bộ hội nghị trực tuyến", "Màn hình tương tác"] },
      { title: "Thiết bị giáo dục", items: ["Máy chiếu vật thể", "Bảng tương tác", "Phòng học thông minh", "Thiết bị trình chiếu"] },
      { title: "Giải pháp", items: ["Phòng họp nhỏ", "Phòng họp doanh nghiệp", "Lớp học hybrid", "Studio đào tạo"] },
      { title: "Dịch vụ", items: ["Tư vấn giải pháp", "Thiết kế hệ thống", "Lắp đặt tận nơi", "Bảo trì định kỳ"] },
    ],
  },
  {
    name: "Phần mềm bản quyền", icon: "software",
    columns: [
      { title: "Microsoft", items: ["Windows", "Office", "Microsoft 365", "Windows Server / SQL"] },
      { title: "Bảo mật", items: ["Kaspersky", "ESET", "Sophos", "Trend Micro", "Bitdefender"] },
      { title: "Sáng tạo", items: ["Adobe", "Autodesk", "Thiết kế đồ họa", "CAD"] },
      { title: "Tiện ích", items: ["Phần mềm AI", "Quản trị doanh nghiệp", "Sao lưu dữ liệu", "Bản quyền theo gói"] },
    ],
  },
  {
    name: "Thiết bị hình ảnh", icon: "camera",
    columns: [
      { title: "Máy ảnh", items: ["Máy ảnh Mirrorless", "Máy ảnh DSLR", "Máy ảnh compact", "Máy ảnh chuyên nghiệp"] },
      { title: "Video", items: ["Máy quay", "Action Cam", "Camera 360", "Thiết bị livestream"] },
      { title: "Phụ kiện", items: ["Ống kính", "Gimbal", "Studio & ánh sáng", "Thẻ nhớ / lưu trữ"] },
      { title: "Hãng", items: ["Canon", "Sony", "Fujifilm", "Nikon", "DJI", "GoPro"] },
    ],
  },
  {
    name: "IoT & công nghiệp", icon: "iot",
    columns: [
      { title: "IoT", items: ["Mô-đun IoT", "Thiết bị IoT", "Gateway IoT", "Cảm biến thông minh"] },
      { title: "Công nghiệp", items: ["Máy tính công nghiệp", "Màn hình công nghiệp", "Thiết bị nhúng", "Điều khiển tự động"] },
      { title: "Năng lượng", items: ["IoT năng lượng mặt trời", "Giám sát điện năng", "Bộ chuyển đổi", "Giải pháp xanh"] },
      { title: "Dịch vụ", items: ["Tư vấn dự án", "Tích hợp hệ thống", "Triển khai IoT", "Hỗ trợ kỹ thuật"] },
    ],
  },
  {
    name: "Âm thanh & nguồn điện", icon: "power",
    columns: [
      { title: "Âm thanh", items: ["Âm thanh IP", "Truyền thanh IP 4G", "Phát thanh / truyền hình", "Loa chuyên dụng"] },
      { title: "Nguồn điện", items: ["UPS / nguồn điện", "Chống sét", "Ổ cắm thông minh", "Bộ lưu điện doanh nghiệp"] },
      { title: "Linh kiện", items: ["Linh kiện RF", "Bộ khuếch đại", "Cáp âm thanh", "Phụ kiện nguồn"] },
      { title: "Hãng", items: ["TOA", "Saigonet", "APC", "Eaton", "Santak"] },
    ],
  },
];

const slides = [
  {
    eyebrow: "BÌNH MINH NEXT • 2027", title: "Công nghệ thích ứng.", accent: "Tăng tốc tương lai.",
    description: "Thiết bị AI-ready và giải pháp hạ tầng được tuyển chọn cho cách làm việc thế hệ mới.",
    image: "https://images.unsplash.com/photo-1565021324739-7493c5a74a13?auto=format&fit=crop&w=1400&q=85",
    theme: "bg-[#087c36]", label: "Laptop AI từ 18.990.000₫",
  },
  {
    eyebrow: "ADAPTIVE WORKSPACE", title: "Văn phòng tự vận hành.", accent: "Nhẹ hơn. Nhanh hơn.",
    description: "Máy scan, máy in và giải pháp tài liệu dành cho mọi quy mô doanh nghiệp.",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1400&q=85",
    theme: "bg-[#126f3a]", label: "Máy in giảm đến 25%",
  },
  {
    eyebrow: "CREATOR INTELLIGENCE", title: "Ý tưởng thành hình.", accent: "Không giới hạn.",
    description: "Máy ảnh, ống kính và thiết bị livestream cho nhà sáng tạo chuyên nghiệp.",
    image: "https://images.unsplash.com/photo-1535540878298-a155c6d065ef?auto=format&fit=crop&w=1400&q=85",
    theme: "bg-[#8f1117]", label: "Combo creator từ 12.490.000₫",
  },
];

const products = [
  { name: "Máy scan Epson ES-C320W", image: "https://images.unsplash.com/photo-1721830834983-f111ad63dbf4?auto=format&fit=crop&w=650&q=80", price: "8.790.000₫", old: "10.990.000₫", sale: "-20%", tag: "Scan 2 mặt • Wi-Fi" },
  { name: "Laptop Lenovo ThinkPad E14 Gen 7", image: "https://images.unsplash.com/photo-1638821734607-02db76d614a6?auto=format&fit=crop&w=650&q=80", price: "22.490.000₫", old: "25.990.000₫", sale: "-13%", tag: "Core Ultra • 16GB RAM" },
  { name: "Máy in Canon LBP 243DW II", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=650&q=80", price: "4.890.000₫", old: "5.990.000₫", sale: "-18%", tag: "In đảo mặt • Wi-Fi" },
  { name: "ASUS ROG Zephyrus G14", image: "https://images.unsplash.com/photo-1572509018340-1fc13b5df491?auto=format&fit=crop&w=650&q=80", price: "39.990.000₫", old: "45.990.000₫", sale: "-13%", tag: "Ryzen AI • RTX 4060" },
  { name: "Camera Sony Creator 4K", image: "https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?auto=format&fit=crop&w=650&q=80", price: "17.990.000₫", old: "20.490.000₫", sale: "-12%", tag: "4K • Chống rung" },
];

const quickCategories = [
  { name: "Máy scan", icon: "printer" as IconName },
  { name: "Máy in", icon: "printer" as IconName },
  { name: "Laptop gaming", icon: "laptop" as IconName },
  { name: "Laptop văn phòng", icon: "laptop" as IconName },
  { name: "Thiết bị mạng", icon: "network" as IconName },
  { name: "Camera", icon: "camera" as IconName },
  { name: "Phần mềm", icon: "software" as IconName },
  { name: "Xem tất cả", icon: "menu" as IconName },
];

const productPath = (name: string) => {
  const match = catalogProducts.find((product) => product.name === name || product.name.includes(name) || name.includes(product.name));
  return match ? `/san-pham/${match.slug}` : "/san-pham";
};

const categoryProducts = [
  {
    name: "Thiết bị văn phòng",
    icon: "printer" as IconName,
    products: [
      { name: "Máy scan Ricoh Fi-5530C2", spec: "ADF • 50 trang/phút", price: "19.690.000₫", old: "22.900.000₫", image: "https://images.unsplash.com/photo-1721830834983-f111ad63dbf4?auto=format&fit=crop&w=600&q=80" },
      { name: "Máy scan Canon LiDE 110", spec: "Flatbed • Khổ A4", price: "1.520.000₫", old: "1.890.000₫", image: "https://images.unsplash.com/photo-1706895040634-62055892cbbb?auto=format&fit=crop&w=600&q=80" },
      { name: "Máy in Canon LBP 243DW II", spec: "Laser • In đảo mặt", price: "4.890.000₫", old: "5.990.000₫", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80" },
      { name: "Máy in Brother HL-L3230CDN", spec: "Laser màu • LAN", price: "9.590.000₫", old: "11.200.000₫", image: "https://images.unsplash.com/photo-1650094980833-7373de26feb6?auto=format&fit=crop&w=600&q=80" },
      { name: "Photocopy Fujifilm Apeos C3060", spec: "Màu • A3 • 30 ppm", price: "Liên hệ", old: "", image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "Laptop & máy tính",
    icon: "laptop" as IconName,
    products: [
      { name: "Lenovo ThinkPad E14 Gen 7", spec: "Core Ultra • RAM 16GB", price: "22.490.000₫", old: "25.990.000₫", image: "https://images.unsplash.com/photo-1638821734607-02db76d614a6?auto=format&fit=crop&w=600&q=80" },
      { name: "ASUS ROG Zephyrus G14", spec: "Ryzen AI • RTX 4060", price: "39.990.000₫", old: "45.990.000₫", image: "https://images.unsplash.com/photo-1572509018340-1fc13b5df491?auto=format&fit=crop&w=600&q=80" },
      { name: "ASUS Vivobook S14 OLED", spec: "Core Ultra • OLED 3K", price: "24.790.000₫", old: "27.990.000₫", image: "https://images.unsplash.com/photo-1565021324739-7493c5a74a13?auto=format&fit=crop&w=600&q=80" },
      { name: "MSI Prestige 16 AI+", spec: "Intel Lunar Lake • 32GB", price: "35.490.000₫", old: "39.990.000₫", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=600&q=80" },
      { name: "HP Pro Tower 280 G9", spec: "Core i5 • SSD 512GB", price: "13.890.000₫", old: "15.490.000₫", image: "https://images.unsplash.com/photo-1538503529202-7a0e79cbb6f6?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "Thiết bị mạng",
    icon: "network" as IconName,
    products: [
      { name: "Router APTEK L300", spec: "Wi-Fi 6 • Gigabit", price: "1.390.000₫", old: "1.690.000₫", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=600&q=80" },
      { name: "TP-Link Archer NX200", spec: "5G • Wi-Fi 6 AX1800", price: "5.490.000₫", old: "6.290.000₫", image: "https://images.unsplash.com/photo-1565021324739-7493c5a74a13?auto=format&fit=crop&w=600&q=80" },
      { name: "ASUS RT-AX53U", spec: "Wi-Fi 6 • AiMesh", price: "1.790.000₫", old: "2.190.000₫", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=600&q=80" },
      { name: "USB Wi-Fi Tenda U2", spec: "150Mbps • Anten 6dBi", price: "179.000₫", old: "229.000₫", image: "https://images.unsplash.com/photo-1777861845855-edb4b29158af?auto=format&fit=crop&w=600&q=80" },
      { name: "Totolink A650USM", spec: "Dual Band • USB 2.0", price: "269.000₫", old: "329.000₫", image: "https://images.unsplash.com/photo-1538503529202-7a0e79cbb6f6?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "Camera & giám sát",
    icon: "camera" as IconName,
    products: [
      { name: "Camera Wi-Fi Imou Ranger 2", spec: "2K • Đàm thoại 2 chiều", price: "590.000₫", old: "790.000₫", image: "https://images.unsplash.com/photo-1643327269452-a291a5f3f72a?auto=format&fit=crop&w=600&q=80" },
      { name: "Camera EZVIZ C6N", spec: "Full HD • Xoay 360°", price: "649.000₫", old: "849.000₫", image: "https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?auto=format&fit=crop&w=600&q=80" },
      { name: "Camera hội nghị Tenveo PTZ", spec: "Full HD • Zoom quang", price: "8.290.000₫", old: "9.790.000₫", image: "https://images.unsplash.com/photo-1643327269452-a291a5f3f72a?auto=format&fit=crop&w=600&q=80" },
      { name: "Ổ cứng camera WD Purple 4TB", spec: "SATA 3 • Hoạt động 24/7", price: "2.490.000₫", old: "2.890.000₫", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=600&q=80" },
      { name: "Ổ cứng Seagate SkyHawk 6TB", spec: "Surveillance • 256MB cache", price: "3.890.000₫", old: "4.290.000₫", image: "https://images.unsplash.com/photo-1538503529202-7a0e79cbb6f6?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "Hội nghị & giáo dục",
    icon: "meeting" as IconName,
    products: [
      { name: "Bộ hội nghị trực tuyến ProMeet", spec: "Camera 4K • Micro đa hướng", price: "18.990.000₫", old: "21.900.000₫", image: "https://images.unsplash.com/photo-1643327269452-a291a5f3f72a?auto=format&fit=crop&w=600&q=80" },
      { name: "Camera PTZ Tenveo VHD20N", spec: "Zoom 20X • Full HD", price: "12.490.000₫", old: "14.290.000₫", image: "https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?auto=format&fit=crop&w=600&q=80" },
      { name: "Màn hình tương tác 65 inch", spec: "4K • Cảm ứng 20 điểm", price: "39.900.000₫", old: "45.900.000₫", image: "https://images.unsplash.com/photo-1565021324739-7493c5a74a13?auto=format&fit=crop&w=600&q=80" },
      { name: "Máy chiếu vật thể Joyusing", spec: "13MP • Khổ A3", price: "6.790.000₫", old: "7.990.000₫", image: "https://images.unsplash.com/photo-1706895040634-62055892cbbb?auto=format&fit=crop&w=600&q=80" },
      { name: "Loa hội nghị USB Speaker Pro", spec: "Khử ồn AI • 6 micro", price: "4.290.000₫", old: "5.190.000₫", image: "https://images.unsplash.com/photo-1768818928341-3b31b8965c6d?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "Phần mềm bản quyền",
    icon: "software" as IconName,
    products: [
      { name: "Microsoft Windows 11 Pro", spec: "Bản quyền vĩnh viễn • 1 PC", price: "4.590.000₫", old: "5.290.000₫", image: "https://images.unsplash.com/photo-1565021324739-7493c5a74a13?auto=format&fit=crop&w=600&q=80" },
      { name: "Microsoft 365 Business Standard", spec: "12 tháng • 1 người dùng", price: "3.290.000₫", old: "3.690.000₫", image: "https://images.unsplash.com/photo-1638821734607-02db76d614a6?auto=format&fit=crop&w=600&q=80" },
      { name: "Kaspersky Small Office Security", spec: "10 thiết bị • 1 năm", price: "2.790.000₫", old: "3.190.000₫", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=600&q=80" },
      { name: "Adobe Photoshop bản quyền", spec: "Creative Cloud • 12 tháng", price: "6.990.000₫", old: "7.990.000₫", image: "https://images.unsplash.com/photo-1538503529202-7a0e79cbb6f6?auto=format&fit=crop&w=600&q=80" },
      { name: "Microsoft Visio Plan 2", spec: "12 tháng • Cloud", price: "4.890.000₫", old: "5.490.000₫", image: "https://images.unsplash.com/photo-1572509018340-1fc13b5df491?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "Thiết bị hình ảnh",
    icon: "camera" as IconName,
    products: [
      { name: "Máy ảnh Sony Creator 4K", spec: "4K • Chống rung", price: "17.990.000₫", old: "20.490.000₫", image: "https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?auto=format&fit=crop&w=600&q=80" },
      { name: "Máy ảnh Canon Mirrorless", spec: "APS-C • Dual Pixel AF", price: "15.490.000₫", old: "17.990.000₫", image: "https://images.unsplash.com/photo-1535540878298-a155c6d065ef?auto=format&fit=crop&w=600&q=80" },
      { name: "Máy quay Sony 4K Handycam", spec: "Zoom quang 20X • 4K HDR", price: "24.990.000₫", old: "27.900.000₫", image: "https://images.unsplash.com/photo-1643327269452-a291a5f3f72a?auto=format&fit=crop&w=600&q=80" },
      { name: "Action Cam GoPro 4K", spec: "4K60 • Chống nước", price: "9.990.000₫", old: "11.490.000₫", image: "https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?auto=format&fit=crop&w=600&q=80" },
      { name: "Gimbal DJI Creator", spec: "Chống rung 3 trục", price: "3.890.000₫", old: "4.490.000₫", image: "https://images.unsplash.com/photo-1768818928341-3b31b8965c6d?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "IoT & công nghiệp",
    icon: "iot" as IconName,
    products: [
      { name: "Gateway IoT công nghiệp Edge 200", spec: "4G LTE • Modbus", price: "8.990.000₫", old: "10.490.000₫", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=600&q=80" },
      { name: "Máy tính công nghiệp Advantech", spec: "Fanless • Core i5", price: "24.900.000₫", old: "27.900.000₫", image: "https://images.unsplash.com/photo-1538503529202-7a0e79cbb6f6?auto=format&fit=crop&w=600&q=80" },
      { name: "Cảm biến nhiệt độ IoT Pro", spec: "LoRaWAN • IP67", price: "2.390.000₫", old: "2.790.000₫", image: "https://images.unsplash.com/photo-1777861845855-edb4b29158af?auto=format&fit=crop&w=600&q=80" },
      { name: "Bộ giám sát điện năng Solar", spec: "Cloud • Cảnh báo realtime", price: "6.490.000₫", old: "7.290.000₫", image: "https://images.unsplash.com/photo-1565021324739-7493c5a74a13?auto=format&fit=crop&w=600&q=80" },
      { name: "Mô-đun IoT điều khiển 8 kênh", spec: "Ethernet • RS485", price: "3.190.000₫", old: "3.690.000₫", image: "https://images.unsplash.com/photo-1572509018340-1fc13b5df491?auto=format&fit=crop&w=600&q=80" },
    ],
  },
  {
    name: "Âm thanh & nguồn điện",
    icon: "power" as IconName,
    products: [
      { name: "Loa âm thanh IP TOA", spec: "PoE • Công suất 15W", price: "5.890.000₫", old: "6.590.000₫", image: "https://images.unsplash.com/photo-1768818928341-3b31b8965c6d?auto=format&fit=crop&w=600&q=80" },
      { name: "Bộ truyền thanh IP 4G", spec: "Điều khiển từ xa • Cloud", price: "12.490.000₫", old: "14.900.000₫", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=600&q=80" },
      { name: "UPS APC Smart 1500VA", spec: "Line Interactive • LCD", price: "11.790.000₫", old: "13.290.000₫", image: "https://images.unsplash.com/photo-1538503529202-7a0e79cbb6f6?auto=format&fit=crop&w=600&q=80" },
      { name: "Bộ lưu điện Santak 1000VA", spec: "Offline • 600W", price: "2.390.000₫", old: "2.790.000₫", image: "https://images.unsplash.com/photo-1572509018340-1fc13b5df491?auto=format&fit=crop&w=600&q=80" },
      { name: "Thiết bị chống sét lan truyền", spec: "3 pha • Bảo vệ nguồn", price: "4.690.000₫", old: "5.290.000₫", image: "https://images.unsplash.com/photo-1777861845855-edb4b29158af?auto=format&fit=crop&w=600&q=80" },
    ],
  },
];

export default function App() {
  const [activeMega, setActiveMega] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 5000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const goToSlide = (next: number) => setSlide((next + slides.length) % slides.length);

  return (
    <div className="future-shell min-h-screen bg-[#f4f6f0]/80 text-[#183126]">
      <StoreHeader />

      <main>
        <section className="mx-auto max-w-[1320px] px-4 pb-5 pt-6 lg:px-6 lg:pt-8">
          <div className="relative grid gap-3 lg:grid-cols-[248px_minmax(0,1fr)_220px]">
            <div className="soft-card relative z-30 hidden rounded-[24px] bg-white/90 py-2 lg:block" onMouseLeave={() => setActiveMega(null)}>
              {categories.map((category, index) => (
                <button key={category.name} onMouseEnter={() => setActiveMega(index)} className={`flex h-[42px] w-full items-center gap-3 border-l-2 px-3 text-left text-[13px] font-semibold transition ${activeMega === index ? "border-[#e31820] bg-[#fff7e0] text-[#e31820]" : "border-transparent hover:bg-slate-50"}`}>
                  <span className={activeMega === index ? "text-[#e31820]" : "text-slate-500"}><Icon name={category.icon} size={18} /></span>{category.name}<span className="ml-auto text-slate-400"><Icon name="chevron" size={14} /></span>
                </button>
              ))}
              {activeMega !== null && (
                <div
                  className="mega-panel absolute left-full top-0 z-40 grid h-full min-h-[388px] w-[calc(1320px-248px-24px)] grid-cols-4 gap-7 overflow-hidden rounded-r-xl bg-white p-6 shadow-[0_14px_45px_rgba(8,124,54,0.18)]"
                  onMouseEnter={() => setActiveMega(activeMega)}
                >
                  {categories[activeMega].columns.map((column) => (
                    <div key={column.title}>
                      <p className="mb-3 text-sm font-extrabold text-[#e31820]">{column.title}</p>
                      {column.items.map((item) => (
                        <a
                          key={item}
                          href={`#category-section-${activeMega}`}
                          onClick={() => setActiveMega(null)}
                          className="mb-2.5 block rounded-md py-0.5 text-[13px] text-slate-600 transition hover:translate-x-0.5 hover:bg-[#fff7e0] hover:text-[#e31820]"
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  ))}
                  <div className="absolute bottom-0 right-0 h-1 w-1/3 bg-[#f6b511]" />
                </div>
              )}
            </div>

            <div className="soft-card relative h-[390px] overflow-hidden rounded-[28px] lg:h-[430px]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              {slides.map((item, index) => (
                <article key={item.eyebrow} className={`carousel-slide absolute inset-0 ${item.theme} ${index === slide ? "is-active" : ""}`}>
                  <img className="absolute inset-0 h-full w-full object-cover opacity-50" src={item.image} alt="" />
                  <div className="carousel-shade absolute inset-0" />
                  <div className="relative z-10 flex h-full max-w-[590px] flex-col justify-center px-7 text-white sm:px-11">
                    <span className="mb-3 text-[11px] font-extrabold tracking-[0.2em] text-[#f6b511]">{item.eyebrow}</span>
                    <h1 className="future-title text-4xl font-black leading-[1.02] sm:text-5xl lg:text-[52px]">{item.title}<br /><span className="text-[#f6b511]">{item.accent}</span></h1>
                    <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">{item.description}</p>
                    <a href="#san-pham" className="mt-5 w-fit rounded-full bg-[#e31820] px-5 py-3 text-xs font-extrabold transition hover:-translate-y-0.5 hover:bg-[#c5131a]">Khám phá ngay</a>
                  </div>
                  <span className="absolute bottom-5 right-5 z-10 rounded-xl bg-white/95 px-4 py-3 text-xs font-extrabold text-[#26352d] shadow-xl">{item.label}</span>
                </article>
              ))}
              <button onClick={() => goToSlide(slide - 1)} className="absolute left-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 rotate-180 place-items-center rounded-full bg-white/85 text-[#087c36] shadow-md" aria-label="Banner trước"><Icon name="chevron" size={17} /></button>
              <button onClick={() => goToSlide(slide + 1)} className="absolute right-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-[#087c36] shadow-md" aria-label="Banner tiếp theo"><Icon name="chevron" size={17} /></button>
              <div className="absolute bottom-5 left-7 z-20 flex gap-2 sm:left-11">{slides.map((item, index) => <button key={item.eyebrow} onClick={() => goToSlide(index)} className={`h-1.5 rounded-full transition-all ${index === slide ? "w-8 bg-[#e31820]" : "w-3 bg-white/60"}`} aria-label={`Xem banner ${index + 1}`} />)}</div>
            </div>

            <div className="hidden grid-rows-2 gap-3 lg:grid">
              <a href="#" className="group relative overflow-hidden rounded-2xl bg-[#fff8df] p-5">
                <img className="absolute inset-0 h-full w-full object-cover opacity-25 transition duration-500 group-hover:scale-105" src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=500&q=80" alt="" />
                <div className="relative"><span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e31820]">Văn phòng số</span><h2 className="mt-1 text-xl font-black leading-tight">Máy in<br />giảm đến 25%</h2><span className="mt-4 inline-block text-xs font-bold">Xem ưu đãi →</span></div>
              </a>
              <a href="#" className="group relative overflow-hidden rounded-2xl bg-[#07552a] p-5 text-white">
                <img className="absolute inset-0 h-full w-full object-cover opacity-35 transition duration-500 group-hover:scale-105" src="https://images.unsplash.com/photo-1587090564077-c7b8f2f1249e?auto=format&fit=crop&w=500&q=80" alt="" />
                <div className="relative"><span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f6b511]">Creator studio</span><h2 className="mt-1 text-xl font-black leading-tight">Combo quay<br />video chuyên nghiệp</h2><span className="mt-4 inline-block text-xs font-bold">Khám phá →</span></div>
              </a>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
            {quickCategories.map((category) => (
              <a key={category.name} href="#" className="tech-pill flex items-center gap-2 rounded-2xl px-3 py-3.5 text-xs font-bold transition hover:-translate-y-0.5 hover:text-[#e31820]">
                <span className="text-[#087c36]"><Icon name={category.icon} size={19} /></span>{category.name}
              </a>
            ))}
          </div>
        </section>

        <section id="san-pham" className="mx-auto max-w-[1320px] px-4 py-5 lg:px-6">
          <div className="relative overflow-hidden rounded-[32px] bg-[#064b27] p-4 shadow-[0_24px_70px_rgba(6,75,39,0.2)] sm:p-7">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 text-white">
              <div><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f6b511]">Live drop • Giá cập nhật theo thời gian thực</span><h2 className="future-title text-3xl font-black">Deal công nghệ chọn lọc</h2></div>
              <div className="flex items-center gap-2 text-xs font-bold"><span>Kết thúc sau</span>{["08", "24", "46"].map((time) => <span key={time} className="rounded-lg bg-white px-2.5 py-2 text-[#087c36]">{time}</span>)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {products.map((product, index) => (
                <article key={product.name} className="product-card group relative overflow-hidden rounded-[22px] bg-white p-3">
                  <span className="absolute left-2.5 top-2.5 z-10 rounded-md bg-[#f6b511] px-2 py-1 text-[10px] font-black text-[#26352d]">{product.sale}</span>
                  <button onClick={() => setLiked((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index])} className={`absolute right-2.5 top-2.5 z-10 grid h-8 w-8 place-items-center rounded-full bg-white shadow ${liked.includes(index) ? "text-red-500" : "text-slate-400"}`} aria-label="Yêu thích"><Icon name="heart" size={16} /></button>
                  <Link to={productPath(product.name)} className="mb-3 block h-32 overflow-hidden rounded-xl bg-slate-100 sm:h-40"><img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} /></Link>
                  <p className="mb-1 text-[10px] font-semibold text-slate-400">{product.tag}</p>
                  <Link to={productPath(product.name)} className="block min-h-10 text-xs font-bold leading-5 hover:text-[#e31820] sm:text-[13px]">{product.name}</Link>
                  <p className="mt-2 text-base font-black text-[#d71920]">{product.price}</p>
                  <p className="text-[10px] text-slate-400 line-through">{product.old}</p>
                  <button onClick={() => setCartCount((count) => count + 1)} className="mt-3 w-full rounded-lg bg-[#087c36] py-2.5 text-[11px] font-extrabold text-white transition hover:bg-[#e31820]">Thêm vào giỏ</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1320px] gap-3 px-4 py-4 sm:grid-cols-3 lg:px-6">
          {[
            { title: "Giải pháp số hóa tài liệu", text: "Máy scan • Lưu trữ • Quản trị", image: "https://images.unsplash.com/photo-1706895040634-62055892cbbb?auto=format&fit=crop&w=700&q=80" },
            { title: "Hạ tầng mạng doanh nghiệp", text: "Wi-Fi • Switch • Bảo mật", image: "https://images.unsplash.com/photo-1548092372-0d1bd40894a3?auto=format&fit=crop&w=700&q=80" },
            { title: "Studio sáng tạo nội dung", text: "Camera • Ánh sáng • Âm thanh", image: "https://images.unsplash.com/photo-1643327269452-a291a5f3f72a?auto=format&fit=crop&w=700&q=80" },
          ].map((banner) => (
            <a key={banner.title} href="#" className="group relative min-h-[170px] overflow-hidden rounded-2xl bg-[#087c36] p-6 text-white">
              <img className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-500 group-hover:scale-105" src={banner.image} alt="" />
              <div className="absolute inset-0 bg-[#173e2b]/30" />
              <div className="relative"><h3 className="max-w-[250px] text-xl font-black">{banner.title}</h3><p className="mt-2 text-xs text-slate-200">{banner.text}</p><span className="mt-5 inline-block text-xs font-extrabold text-[#f6b511]">Tìm hiểu thêm →</span></div>
            </a>
          ))}
        </section>

        <div className="py-4">
          {categoryProducts.map((category, categoryIndex) => (
            <section id={`category-section-${categoryIndex}`} key={category.name} className={`scroll-mt-5 ${categoryIndex % 2 === 1 ? "bg-white/60" : ""}`}>
              <div className="mx-auto max-w-[1320px] px-4 py-7 lg:px-6">
                <div className="mb-5 flex items-end justify-between gap-3">
                  <div>
                    {categoryIndex === 0 && <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e31820]">Mua sắm theo nhu cầu</span>}
                    <h2 className="mt-1 flex items-center gap-2 text-xl font-black tracking-[-0.03em] sm:text-2xl">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#087c36] text-white"><Icon name={category.icon} size={18} /></span>
                      {category.name}
                    </h2>
                  </div>
                  <a href="#" className="flex shrink-0 items-center gap-1 text-xs font-extrabold text-[#e31820]">
                    Xem tất cả <span className="hidden sm:inline">{category.name.toLowerCase()}</span> <Icon name="chevron" size={15} />
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
                  {category.products.map((product, productIndex) => {
                    const favoriteId = productIndex + 100 + categoryIndex * 10;
                    return (
                      <article key={product.name} className="product-card category-product group overflow-hidden rounded-[22px] border bg-white p-3 transition hover:-translate-y-1">
                        <div className="relative mb-3 h-32 overflow-hidden rounded-xl bg-slate-100 sm:h-40">
                          <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
                          <span className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-1 text-[9px] font-extrabold text-[#087c36] shadow-sm">CHÍNH HÃNG</span>
                          <button
                            onClick={() => setLiked((items) => items.includes(favoriteId) ? items.filter((item) => item !== favoriteId) : [...items, favoriteId])}
                            className={`absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white/95 shadow-sm transition ${liked.includes(favoriteId) ? "text-red-500" : "text-slate-400 hover:text-red-500"}`}
                            aria-label="Thêm vào yêu thích"
                          >
                            <Icon name="heart" size={14} />
                          </button>
                        </div>
                        <p className="mb-1 text-[10px] font-semibold text-slate-400">{product.spec}</p>
                        <Link to={productPath(product.name)} className="block min-h-10 text-xs font-bold leading-5 hover:text-[#e31820] sm:text-[13px]">{product.name}</Link>
                        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                          <p className="text-base font-black text-[#d71920]">{product.price}</p>
                          {product.old && <p className="text-[10px] text-slate-400 line-through">{product.old}</p>}
                        </div>
                        <button onClick={() => setCartCount((count) => count + 1)} className="mt-3 w-full rounded-lg border border-[#087c36] py-2.5 text-[11px] font-extrabold text-[#087c36] transition hover:bg-[#087c36] hover:text-white">Thêm vào giỏ</button>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-5 border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-6 px-4 py-7 lg:grid-cols-4 lg:px-6">
            {[
              { icon: "truck" as IconName, title: "Giao nhanh toàn quốc", text: "Theo dõi đơn hàng minh bạch" },
              { icon: "shield" as IconName, title: "Hàng chính hãng", text: "Đầy đủ CO/CQ và hóa đơn" },
              { icon: "refresh" as IconName, title: "Đổi mới 30 ngày", text: "Nếu có lỗi nhà sản xuất" },
              { icon: "headset" as IconName, title: "Tư vấn dự án", text: "Hotline 1800 6868 miễn phí" },
            ].map((feature) => <div key={feature.title} className="flex items-center gap-3 px-2 lg:border-r lg:border-slate-200 lg:px-5 lg:last:border-0"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff7e0] text-[#e31820]"><Icon name={feature.icon} /></span><span><b className="block text-xs sm:text-sm">{feature.title}</b><small className="text-[10px] text-slate-500 sm:text-[11px]">{feature.text}</small></span></div>)}
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-[#f6b511] bg-[#043d20] text-white">
        <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <div><div className="w-fit rounded-xl bg-white p-1"><img className="h-20 w-32 object-contain" src={binhMinhLogo} alt="Bình Minh - Kiến tạo tương lai" /></div><p className="mt-4 max-w-xs text-sm leading-6 text-green-100/70">Thiết bị và giải pháp công nghệ chính hãng cho cá nhân, doanh nghiệp và tổ chức.</p></div>
          <div><h4 className="mb-4 font-bold">Về Bình Minh</h4><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/gioi-thieu">Giới thiệu</Link><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/tin-tuc">Tin tức công nghệ</Link>{["Đối tác", "Tuyển dụng"].map((item) => <a key={item} className="mb-2 block text-sm text-green-100/70 hover:text-white" href="#">{item}</a>)}</div>
          <div><h4 className="mb-4 font-bold">Hỗ trợ khách hàng</h4>{["Chính sách bảo hành", "Giao nhận", "Đổi trả", "Mua hàng doanh nghiệp"].map((item) => <a key={item} className="mb-2 block text-sm text-slate-400 hover:text-white" href="#">{item}</a>)}</div>
          <div><h4 className="mb-4 font-bold">Tổng đài tư vấn</h4><p className="text-2xl font-black text-[#f6b511]">1800 6868</p><p className="mt-1 text-xs text-green-100/70">Miễn phí • 8:00 — 21:30 mỗi ngày</p></div>
        </div>
      </footer>
    </div>
  );
}
