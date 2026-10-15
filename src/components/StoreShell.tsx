import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import binhMinhLogo from "../assets/binh-minh-logo.png";

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export function StoreHeader() {
  return (
    <>
      <div className="signal-bar px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.08em] text-white">
        HỆ SINH THÁI CÔNG NGHỆ 2027 <span className="mx-2 text-[#f6b511]">✦</span> Miễn phí giao hàng toàn quốc cho đơn từ 1 triệu
      </div>
      <header className="glass-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 py-2 lg:px-6">
          <Link to="/" className="flex h-16 w-[152px] shrink-0 items-center justify-center sm:h-[72px] sm:w-[176px]" aria-label="Bình Minh">
            <img className="h-full w-full object-contain" src={binhMinhLogo} alt="Bình Minh - Kiến tạo tương lai" />
          </Link>
          <form className="relative hidden w-full max-w-[580px] md:ml-6 md:block" action="/san-pham">
            <input name="q" className="h-12 w-full rounded-2xl border border-[#087c36]/10 bg-[#f3f6f1] px-5 pr-14 text-sm outline-none transition focus:border-[#087c36]/40 focus:bg-white" placeholder="Tìm bằng tên, nhu cầu hoặc giải pháp AI..." />
            <button className="absolute right-1.5 top-1.5 grid h-8 w-10 place-items-center rounded-full bg-[#e31820] text-white" aria-label="Tìm kiếm"><SearchIcon /></button>
          </form>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right text-xs text-slate-500 lg:block"><span className="block">Tư vấn miễn phí</span><b className="text-sm text-[#087c36]">1800 6868</b></div>
            <Link to="/san-pham" className="tech-pill rounded-full px-4 py-2.5 text-xs font-extrabold text-[#087c36]">Khám phá sản phẩm</Link>
          </div>
        </div>
        <nav className="border-t border-[#087c36]/10 bg-white/70 text-[#183126]">
          <div className="mx-auto flex max-w-[1320px] overflow-x-auto px-4 lg:px-6">
            {[["Trang chủ", "/"], ["Sản phẩm", "/san-pham"], ["Giải pháp", "/#giai-phap"], ["Tin tức", "/tin-tuc"], ["Giới thiệu", "/gioi-thieu"], ["Liên hệ", "/lien-he"]].map(([label, to]) => (
              <NavLink key={label} to={to} end={to === "/"} className={({ isActive }) => `my-1 shrink-0 rounded-full px-5 py-2.5 text-[11px] font-extrabold uppercase tracking-wide transition hover:bg-[#e9f6ed] ${isActive ? "bg-[#087c36] text-white" : ""}`}>{label}</NavLink>
            ))}
          </div>
        </nav>
      </header>
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
