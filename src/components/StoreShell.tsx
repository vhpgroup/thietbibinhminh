import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router";
import binhMinhLogo from "../assets/binh-minh-logo.png";

type HeaderIcon = "menu" | "search" | "map" | "user" | "cart" | "close";

function HeaderIcon({ name, size = 20 }: { name: HeaderIcon; size?: number }) {
  const paths: Record<HeaderIcon, ReactNode> = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    cart: <><path d="M3 4h2l2.2 11h10.9l2-7H6.2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export function StoreHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [["Trang chủ", "/"], ["Sản phẩm", "/san-pham"], ["Giải pháp", "/#giai-phap"], ["Dự án", "/#du-an"], ["Tin tức", "/tin-tuc"], ["Giới thiệu", "/gioi-thieu"], ["Liên hệ", "/lien-he"]];

  return (
    <>
      <header className="glass-header sticky top-0 z-50">
        <div className="signal-bar px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.08em] text-white">
          HỆ SINH THÁI CÔNG NGHỆ 2027 <span className="mx-2 text-[#f6b511]">✦</span> Miễn phí giao hàng toàn quốc cho đơn từ 1 triệu
        </div>
        <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 py-3 lg:px-6">
          <button className="text-[#183126] lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu"><HeaderIcon name="menu" size={25} /></button>
          <Link to="/" className="flex h-16 w-[152px] shrink-0 items-center justify-center sm:h-[72px] sm:w-[176px]" aria-label="Bình Minh">
            <img className="h-full w-full object-contain" src={binhMinhLogo} alt="Bình Minh - Kiến tạo tương lai" />
          </Link>
          <form className="relative hidden w-full max-w-[580px] md:ml-7 md:block" action="/san-pham">
            <input name="q" className="h-12 w-full rounded-2xl border border-[#087c36]/10 bg-[#f3f6f1] px-5 pr-14 text-sm outline-none transition focus:border-[#087c36]/40 focus:bg-white" placeholder="Tìm bằng tên, nhu cầu hoặc giải pháp AI..." />
            <button className="absolute right-1.5 top-1.5 grid h-9 w-11 place-items-center rounded-full bg-[#e31820] text-white" aria-label="Tìm kiếm"><HeaderIcon name="search" size={18} /></button>
          </form>
          <div className="ml-auto flex items-center gap-3 lg:gap-5">
            <button className="hidden items-center gap-2 text-left text-xs text-slate-500 xl:flex"><span className="text-slate-500"><HeaderIcon name="map" /></span><span><small className="block">Giao đến</small><b className="text-sm text-[#183126]">Hà Nội</b></span></button>
            <button className="hidden items-center gap-2 text-left text-xs text-slate-500 sm:flex"><span className="text-slate-500"><HeaderIcon name="user" /></span><span><small className="block">Tài khoản</small><b className="text-sm text-[#183126]">Đăng nhập</b></span></button>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-[#eef7f0] text-[#183126]" aria-label="Giỏ hàng"><HeaderIcon name="cart" /></button>
          </div>
        </div>
        <div className="mx-auto max-w-[1320px] px-4 pb-3 md:hidden">
          <form className="relative" action="/san-pham"><input name="q" className="h-10 w-full rounded-full bg-slate-100 px-5 pr-12 text-sm outline-none" placeholder="Tìm kiếm sản phẩm..." /><button className="absolute right-3 top-2 text-[#e31820]" aria-label="Tìm kiếm"><HeaderIcon name="search" /></button></form>
        </div>
        <nav className="border-t border-[#087c36]/10 bg-white/70 text-[#183126]">
          <div className="mx-auto hidden max-w-[1320px] items-center px-4 lg:flex lg:px-6">
            <Link to="/san-pham" className="my-1 flex w-[248px] shrink-0 items-center gap-2 rounded-full bg-[#087c36] px-4 py-2.5 text-[12px] font-extrabold text-white"><HeaderIcon name="menu" size={19} /> DANH MỤC SẢN PHẨM</Link>
            {navItems.map(([label, to]) => (
              <NavLink key={label} to={to} end={to === "/"} className={({ isActive }) => `my-1 flex-1 rounded-full py-2.5 text-center text-[11px] font-extrabold uppercase transition hover:bg-[#e9f6ed] ${isActive ? "text-[#087c36]" : ""}`}>{label}</NavLink>
            ))}
          </div>
        </nav>
      </header>

      {mobileOpen && <div className="fixed inset-0 z-[70] bg-[#173e2b]/50" onClick={() => setMobileOpen(false)}>
        <aside className="h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5" onClick={(event) => event.stopPropagation()}>
          <div className="mb-6 flex items-center justify-between"><img className="h-16 w-32 object-contain" src={binhMinhLogo} alt="Bình Minh" /><button onClick={() => setMobileOpen(false)} aria-label="Đóng menu"><HeaderIcon name="close" /></button></div>
          <Link to="/san-pham" onClick={() => setMobileOpen(false)} className="mb-3 flex items-center gap-2 rounded-xl bg-[#087c36] px-4 py-3 text-xs font-extrabold text-white"><HeaderIcon name="menu" size={18} /> DANH MỤC SẢN PHẨM</Link>
          {navItems.map(([label, to]) => <Link key={label} to={to} onClick={() => setMobileOpen(false)} className="block border-b border-slate-100 px-2 py-3 text-sm font-bold">{label}</Link>)}
        </aside>
      </div>}
    </>
  );
}

export function StoreFooter() {
  return (
    <footer className="mt-16 border-t-4 border-[#f6b511] bg-[#043d20] text-white">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div><div className="w-fit rounded-xl bg-white p-1"><img className="h-20 w-32 object-contain" src={binhMinhLogo} alt="Bình Minh" /></div><p className="mt-4 max-w-xs text-sm leading-6 text-green-100/70">Thiết bị và giải pháp công nghệ chính hãng cho cá nhân, doanh nghiệp và tổ chức.</p></div>
        <div><h4 className="mb-4 font-bold">Về Bình Minh</h4><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/gioi-thieu">Giới thiệu</Link><Link className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/tin-tuc">Tin tức công nghệ</Link>{["Đối tác", "Tuyển dụng"].map((item) => <Link key={item} className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/">{item}</Link>)}</div>
        <div><h4 className="mb-4 font-bold">Hỗ trợ khách hàng</h4>{["Chính sách bảo hành", "Giao nhận", "Đổi trả", "Mua hàng doanh nghiệp"].map((item) => <Link key={item} className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/">{item}</Link>)}</div>
        <div><h4 className="mb-4 font-bold">Tổng đài tư vấn</h4><p className="text-2xl font-black text-[#f6b511]">1800 6868</p><p className="mt-1 text-xs text-green-100/70">Miễn phí • 8:00 — 21:30 mỗi ngày</p></div>
      </div>
    </footer>
  );
}

export function StorePage({ children }: { children: ReactNode }) {
  return <div className="future-shell min-h-screen bg-[#f4f6f0]/80 text-[#183126]"><StoreHeader />{children}<StoreFooter /></div>;
}
