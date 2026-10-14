import { useState } from "react";

type IconName =
  | "menu"
  | "search"
  | "map"
  | "user"
  | "cart"
  | "heart"
  | "chevron"
  | "truck"
  | "shield"
  | "refresh"
  | "headset"
  | "tv"
  | "snow"
  | "washer"
  | "kitchen"
  | "phone"
  | "laptop"
  | "close";

function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    cart: <><path d="M3 4h2l2.2 11h10.9l2-7H6.2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    shield: <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 9a7 7 0 0 1 11.5-2.6L20 9M4 15l2.4 2.6A7 7 0 0 0 18 15" /></>,
    headset: <><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><path d="M6 14H4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2zM18 14h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2zM18 20c0 1-2 2-4 2" /></>,
    tv: <><rect x="3" y="5" width="18" height="13" rx="2" /><path d="M8 22h8M12 18v4" /></>,
    snow: <><path d="M12 2v20M4 7l16 10M20 7 4 17" /><path d="m9 4 3 3 3-3M9 20l3-3 3 3" /></>,
    washer: <><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="14" r="5" /><path d="M7 6h.01M11 6h5" /></>,
    kitchen: <><path d="M5 3v18M9 3v6c0 2-4 2-4 0M16 3v18M16 3c5 3 5 8 0 10" /></>,
    phone: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M10 18h4" /></>,
    laptop: <><rect x="4" y="4" width="16" height="12" rx="1" /><path d="M2 20h20M8 16l-1 4M16 16l1 4" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const categories: { label: string; icon: IconName; color: string }[] = [
  { label: "Tivi", icon: "tv", color: "bg-blue-50 text-blue-700" },
  { label: "Điều hòa", icon: "snow", color: "bg-cyan-50 text-cyan-700" },
  { label: "Tủ lạnh", icon: "kitchen", color: "bg-amber-50 text-amber-700" },
  { label: "Máy giặt", icon: "washer", color: "bg-violet-50 text-violet-700" },
  { label: "Gia dụng", icon: "kitchen", color: "bg-rose-50 text-rose-700" },
  { label: "Điện thoại", icon: "phone", color: "bg-emerald-50 text-emerald-700" },
  { label: "Laptop", icon: "laptop", color: "bg-indigo-50 text-indigo-700" },
  { label: "Xem tất cả", icon: "menu", color: "bg-slate-100 text-slate-700" },
];

const products = [
  {
    name: "Smart TV 4K Vision AI 55 inch",
    image: "https://images.unsplash.com/photo-1581791836186-7609d9ecfd38?auto=format&fit=crop&w=720&q=82",
    price: "10.990.000₫",
    old: "15.990.000₫",
    sale: "-31%",
    gift: "Tặng gói truyền hình 12 tháng",
  },
  {
    name: "Tủ lạnh Inverter Multi Door 525L",
    image: "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?auto=format&fit=crop&w=720&q=82",
    price: "18.490.000₫",
    old: "23.990.000₫",
    sale: "-23%",
    gift: "Miễn phí lắp đặt tận nhà",
  },
  {
    name: "Máy giặt cửa trước EcoWash 10kg",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=720&q=82",
    price: "8.790.000₫",
    old: "12.490.000₫",
    sale: "-30%",
    gift: "Tặng bộ chăm sóc vải cao cấp",
  },
  {
    name: "Điều hòa Inverter CoolAir 1.5HP",
    image: "https://images.unsplash.com/photo-1762341123870-d706f257a12e?auto=format&fit=crop&w=720&q=82",
    price: "9.290.000₫",
    old: "12.990.000₫",
    sale: "-28%",
    gift: "Tặng công lắp đặt tiêu chuẩn",
  },
];

const features = [
  { icon: "truck" as IconName, title: "Giao nhanh miễn phí", text: "Trong bán kính 30km" },
  { icon: "shield" as IconName, title: "Hàng chính hãng", text: "Cam kết 100% nguồn gốc" },
  { icon: "refresh" as IconName, title: "Đổi mới 30 ngày", text: "Nếu có lỗi từ nhà sản xuất" },
  { icon: "headset" as IconName, title: "Hỗ trợ tận tâm", text: "Hotline 1800 6868 miễn phí" },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [liked, setLiked] = useState<number[]>([]);

  const addToCart = () => setCartCount((count) => count + 1);
  const toggleLiked = (index: number) =>
    setLiked((items) => items.includes(index) ? items.filter((item) => item !== index) : [...items, index]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#14213d]">
      <div className="bg-[#0a2342] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white sm:text-sm">
        MỞ BÁN CUỐI TUẦN — Giảm thêm 10% qua VNPAY, miễn phí giao lắp toàn quốc
      </div>

      <header className="sticky top-0 z-50 bg-white shadow-[0_3px_18px_rgba(10,35,66,0.08)]">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-4 py-4 lg:px-8">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu">
            <Icon name="menu" size={26} />
          </button>
          <a href="#" className="flex shrink-0 items-center gap-2" aria-label="Nova Home">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff6b35] font-black text-white">N</span>
            <span className="leading-none">
              <b className="block text-xl font-black tracking-[-0.04em] text-[#0a2342] sm:text-2xl">NOVA</b>
              <span className="text-[9px] font-bold tracking-[0.28em] text-[#ff6b35]">HOME</span>
            </span>
          </a>

          <form className="relative hidden flex-1 md:block" onSubmit={(event) => event.preventDefault()}>
            <input
              className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 px-5 pr-14 text-sm outline-none transition focus:border-[#ff6b35] focus:bg-white"
              placeholder="Bạn cần tìm sản phẩm gì?"
              aria-label="Tìm kiếm sản phẩm"
            />
            <button className="absolute right-1.5 top-1.5 grid h-9 w-10 place-items-center rounded-full bg-[#ff6b35] text-white" aria-label="Tìm kiếm">
              <Icon name="search" size={19} />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-2 lg:gap-4">
            <button className="hidden items-center gap-2 text-left text-xs font-medium text-slate-500 xl:flex">
              <Icon name="map" />
              <span><small className="block">Xem giá tại</small><b className="text-sm text-[#14213d]">Hà Nội</b></span>
            </button>
            <button className="hidden items-center gap-2 text-left text-xs font-medium text-slate-500 sm:flex">
              <Icon name="user" />
              <span><small className="block">Xin chào!</small><b className="text-sm text-[#14213d]">Tài khoản</b></span>
            </button>
            <button className="relative grid h-11 w-11 place-items-center rounded-full bg-[#eef3f8]" aria-label={`Giỏ hàng có ${cartCount} sản phẩm`}>
              <Icon name="cart" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#ff6b35] px-1 text-[10px] font-bold text-white">{cartCount}</span>}
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1280px] px-4 pb-3 md:hidden">
          <form className="relative" onSubmit={(event) => event.preventDefault()}>
            <input className="h-11 w-full rounded-full bg-slate-100 px-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#ff6b35]/40" placeholder="Tìm kiếm sản phẩm..." />
            <button className="absolute right-3 top-2.5 text-[#ff6b35]" aria-label="Tìm kiếm"><Icon name="search" /></button>
          </form>
        </div>

        <nav className="hidden border-t border-slate-100 lg:block">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8">
            {["Tivi", "Tủ lạnh", "Điều hòa", "Máy giặt", "Gia dụng", "Điện thoại", "Laptop", "Khuyến mãi"].map((item, index) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`px-3 py-3.5 text-sm font-bold transition hover:text-[#ff6b35] ${index === 7 ? "text-[#ff6b35]" : ""}`}>{item}</a>
            ))}
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-[#08182c]/50" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-[82%] max-w-sm bg-white p-6" onClick={(event) => event.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between">
              <b className="text-xl font-black text-[#0a2342]">NOVA <span className="text-[#ff6b35]">HOME</span></b>
              <button onClick={() => setMobileOpen(false)} aria-label="Đóng menu"><Icon name="close" /></button>
            </div>
            {["Tivi", "Tủ lạnh", "Điều hòa", "Máy giặt", "Gia dụng", "Điện thoại", "Laptop", "Khuyến mãi"].map((item) => (
              <a key={item} href="#" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-slate-100 py-4 font-bold">
                {item}<Icon name="chevron" size={17} />
              </a>
            ))}
          </aside>
        </div>
      )}

      <main>
        <section className="mx-auto max-w-[1280px] px-4 py-5 lg:px-8 lg:py-7">
          <div className="hero-grid overflow-hidden rounded-[28px] bg-[#0a2342] text-white">
            <div className="relative z-10 flex flex-col justify-center px-7 py-10 sm:px-12 lg:px-16 lg:py-14">
              <span className="mb-4 w-fit rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]">Mega sale tháng 6</span>
              <h1 className="max-w-xl text-4xl font-black leading-[1.03] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                Nâng tầm tổ ấm.<br /><span className="text-[#ffb000]">Giá tốt bất ngờ.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-6 text-blue-100 sm:text-base">
                Hàng ngàn thiết bị điện máy chính hãng, công nghệ mới nhất cùng ưu đãi lên đến 50%.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#san-pham" className="rounded-full bg-[#ff6b35] px-6 py-3.5 text-sm font-extrabold shadow-[0_8px_22px_rgba(255,107,53,0.3)] transition hover:-translate-y-0.5 hover:bg-[#ff7b4a]">Mua ngay</a>
                <a href="#danh-muc" className="rounded-full border border-white/35 px-6 py-3.5 text-sm font-extrabold transition hover:bg-white hover:text-[#0a2342]">Khám phá sản phẩm</a>
              </div>
              <div className="mt-8 flex gap-8 text-xs text-blue-100">
                <span><b className="block text-xl text-white">50+</b>Thương hiệu</span>
                <span><b className="block text-xl text-white">10K+</b>Sản phẩm</span>
                <span><b className="block text-xl text-white">4.9/5</b>Khách hàng</span>
              </div>
            </div>
            <div className="relative min-h-[320px] overflow-hidden lg:min-h-[500px]">
              <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1581791836186-7609d9ecfd38?auto=format&fit=crop&w=1200&q=85" alt="Không gian phòng khách hiện đại với TV thông minh" />
              <div className="absolute inset-0 bg-[#0a2342]/20 lg:hidden" />
              <div className="absolute bottom-6 left-6 rounded-2xl bg-white p-4 text-[#14213d] shadow-2xl">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-orange-100 font-black text-[#ff6b35]">-35%</span>
                  <span className="text-xs text-slate-500">Smart TV thế hệ mới<b className="block text-base text-[#0a2342]">Chỉ từ 6.990.000₫</b></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="danh-muc" className="mx-auto max-w-[1280px] px-4 py-7 lg:px-8">
          <div className="mb-5 flex items-end justify-between">
            <div><span className="section-kicker">MUA SẮM DỄ DÀNG</span><h2 className="section-title">Danh mục nổi bật</h2></div>
            <a href="#" className="hidden items-center gap-1 text-sm font-bold text-[#ff6b35] sm:flex">Xem tất cả <Icon name="chevron" size={16} /></a>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {categories.map((category) => (
              <a key={category.label} href="#" className="group rounded-2xl bg-white px-2 py-5 text-center shadow-[0_4px_18px_rgba(10,35,66,0.05)] transition hover:-translate-y-1 hover:shadow-[0_10px_28px_rgba(10,35,66,0.1)]">
                <span className={`mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl transition group-hover:scale-105 ${category.color}`}><Icon name={category.icon} size={25} /></span>
                <b className="text-xs sm:text-sm">{category.label}</b>
              </a>
            ))}
          </div>
        </section>

        <section id="san-pham" className="mx-auto max-w-[1280px] px-4 py-8 lg:px-8">
          <div className="sale-shell rounded-[28px] bg-[#ff6b35] p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 text-white">
              <div><span className="text-xs font-bold uppercase tracking-[0.18em] text-orange-100">Ưu đãi có hạn</span><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Giá sốc hôm nay</h2></div>
              <div className="flex items-center gap-2 text-center text-xs font-bold">
                <span>Kết thúc sau</span>
                {["08", "24", "46"].map((time, index) => <span key={time} className="rounded-lg bg-white px-2.5 py-2 text-[#0a2342]">{time}<small className="block text-[8px] text-slate-400">{["GIỜ", "PHÚT", "GIÂY"][index]}</small></span>)}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product, index) => (
                <article key={product.name} className="group relative overflow-hidden rounded-2xl bg-white p-3.5 shadow-lg">
                  <span className="absolute left-3 top-3 z-10 rounded-lg bg-[#ff6b35] px-2 py-1 text-xs font-black text-white">{product.sale}</span>
                  <button onClick={() => toggleLiked(index)} className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white shadow-md transition ${liked.includes(index) ? "text-red-500" : "text-slate-400 hover:text-red-500"}`} aria-label="Yêu thích">
                    <Icon name="heart" size={18} />
                  </button>
                  <div className="mb-4 h-44 overflow-hidden rounded-xl bg-slate-100 sm:h-48">
                    <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
                  </div>
                  <h3 className="min-h-12 text-sm font-bold leading-5">{product.name}</h3>
                  <p className="mt-2 text-lg font-black text-[#ff4d1c]">{product.price}</p>
                  <p className="text-xs text-slate-400 line-through">{product.old}</p>
                  <p className="mt-3 border-t border-dashed border-slate-200 pt-3 text-[11px] font-semibold text-slate-600">{product.gift}</p>
                  <button onClick={addToCart} className="mt-4 w-full rounded-xl bg-[#0a2342] py-3 text-xs font-extrabold text-white transition hover:bg-[#ff6b35]">Thêm vào giỏ</button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1280px] gap-4 px-4 py-8 md:grid-cols-2 lg:px-8">
          <a href="#" className="promo-card relative min-h-[245px] overflow-hidden rounded-[26px] bg-[#dff4ff] p-8">
            <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1628745277862-bc0b2d68c50c?auto=format&fit=crop&w=900&q=82" alt="Gian bếp hiện đại" />
            <div className="absolute inset-0 bg-white/50" />
            <div className="relative z-10 max-w-[250px]">
              <span className="text-xs font-black uppercase tracking-widest text-[#ff6b35]">Bếp xinh, nhà chất</span>
              <h3 className="mt-2 text-3xl font-black tracking-tight">Combo gia dụng<br />giảm đến 40%</h3>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-black">Khám phá ngay <Icon name="chevron" size={16} /></span>
            </div>
          </a>
          <a href="#" className="promo-card relative min-h-[245px] overflow-hidden rounded-[26px] bg-[#0a2342] p-8 text-white">
            <img className="absolute inset-0 h-full w-full object-cover opacity-45" src="https://images.unsplash.com/photo-1724582586508-8f06117dc979?auto=format&fit=crop&w=900&q=82" alt="Phòng khách thông minh" />
            <div className="relative z-10 max-w-[280px]">
              <span className="text-xs font-black uppercase tracking-widest text-[#ffb000]">Sống thông minh hơn</span>
              <h3 className="mt-2 text-3xl font-black tracking-tight">Hệ sinh thái<br />Smart Home</h3>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-black">Xem giải pháp <Icon name="chevron" size={16} /></span>
            </div>
          </a>
        </section>

        <section className="mt-6 border-y border-slate-200 bg-white">
          <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-y-7 px-4 py-8 lg:grid-cols-4 lg:px-8">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-3 px-2 lg:border-r lg:border-slate-200 lg:last:border-0 lg:px-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-orange-50 text-[#ff6b35]"><Icon name={feature.icon} /></span>
                <span><b className="block text-sm">{feature.title}</b><small className="text-[11px] text-slate-500">{feature.text}</small></span>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-[#071b33] text-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <b className="text-2xl font-black">NOVA <span className="text-[#ff6b35]">HOME</span></b>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">Hệ thống bán lẻ điện máy và giải pháp sống thông minh dành cho mọi gia đình Việt.</p>
          </div>
          <div><h4 className="mb-4 font-bold">Về Nova Home</h4>{["Giới thiệu", "Tuyển dụng", "Hệ thống cửa hàng", "Tin tức"].map((item) => <a key={item} className="mb-2 block text-sm text-slate-400 hover:text-white" href="#">{item}</a>)}</div>
          <div><h4 className="mb-4 font-bold">Hỗ trợ khách hàng</h4>{["Chính sách bảo hành", "Giao nhận & lắp đặt", "Đổi trả sản phẩm", "Hướng dẫn mua hàng"].map((item) => <a key={item} className="mb-2 block text-sm text-slate-400 hover:text-white" href="#">{item}</a>)}</div>
          <div>
            <h4 className="mb-4 font-bold">Tổng đài hỗ trợ</h4>
            <p className="text-2xl font-black text-[#ff8a60]">1800 6868</p>
            <p className="mt-1 text-xs text-slate-400">Miễn phí • 8:00 — 21:30 mỗi ngày</p>
            <div className="mt-5 flex gap-2"><span className="rounded-md bg-white/10 px-3 py-2 text-xs font-bold">VISA</span><span className="rounded-md bg-white/10 px-3 py-2 text-xs font-bold">VNPAY</span><span className="rounded-md bg-white/10 px-3 py-2 text-xs font-bold">COD</span></div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">© 2025 Nova Home. Thiết kế trải nghiệm điện máy hiện đại.</div>
      </footer>
    </div>
  );
}
