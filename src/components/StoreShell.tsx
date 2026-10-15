import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";
import binhMinhLogo from "../assets/binh-minh-logo.png";

function SearchIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>;
}

export function StoreHeader() {
  return (
    <>
      <div className="bg-[#087c36] px-4 py-2 text-center text-xs font-semibold tracking-wide text-white">
        GIẢI PHÁP CÔNG NGHỆ CHÍNH HÃNG — Miễn phí giao hàng toàn quốc cho đơn từ 1 triệu
      </div>
      <header className="sticky top-0 z-50 bg-white shadow-[0_3px_18px_rgba(8,124,54,0.1)]">
        <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 py-2 lg:px-6">
          <Link to="/" className="flex h-14 w-[136px] shrink-0 items-center justify-center sm:h-16 sm:w-[156px]" aria-label="Bình Minh">
            <img className="h-full w-full object-contain" src={binhMinhLogo} alt="Bình Minh - Kiến tạo tương lai" />
          </Link>
          <form className="relative hidden w-full max-w-[580px] md:ml-6 md:block" action="/san-pham">
            <input name="q" className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 px-5 pr-14 text-sm outline-none transition focus:border-[#e31820] focus:bg-white" placeholder="Tìm kiếm sản phẩm..." />
            <button className="absolute right-1.5 top-1.5 grid h-8 w-10 place-items-center rounded-full bg-[#e31820] text-white" aria-label="Tìm kiếm"><SearchIcon /></button>
          </form>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right text-xs text-slate-500 lg:block"><span className="block">Tư vấn miễn phí</span><b className="text-sm text-[#087c36]">1800 6868</b></div>
            <Link to="/san-pham" className="rounded-full bg-[#eef7f0] px-4 py-2.5 text-xs font-extrabold text-[#087c36]">Sản phẩm</Link>
          </div>
        </div>
        <nav className="border-t border-slate-100 bg-[#076b31] text-white">
          <div className="mx-auto flex max-w-[1320px] overflow-x-auto px-4 lg:px-6">
            {[["Trang chủ", "/"], ["Sản phẩm", "/san-pham"], ["Giải pháp", "/#giai-phap"], ["Dự án", "/#du-an"], ["Tin tức", "/#tin-tuc"], ["Liên hệ", "/#lien-he"]].map(([label, to]) => (
              <NavLink key={label} to={to} end={to === "/"} className={({ isActive }) => `shrink-0 px-5 py-3 text-xs font-bold uppercase transition hover:bg-white/10 ${isActive ? "bg-[#e31820]" : ""}`}>{label}</NavLink>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}

export function StoreFooter() {
  return (
    <footer className="mt-14 bg-[#07552a] text-white">
      <div className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div><div className="w-fit rounded-xl bg-white p-1"><img className="h-20 w-32 object-contain" src={binhMinhLogo} alt="Bình Minh" /></div><p className="mt-4 max-w-xs text-sm leading-6 text-green-100/70">Thiết bị và giải pháp công nghệ chính hãng cho cá nhân, doanh nghiệp và tổ chức.</p></div>
        <div><h4 className="mb-4 font-bold">Về Bình Minh</h4>{["Giới thiệu", "Dự án", "Đối tác", "Tuyển dụng"].map((item) => <Link key={item} className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/">{item}</Link>)}</div>
        <div><h4 className="mb-4 font-bold">Hỗ trợ khách hàng</h4>{["Chính sách bảo hành", "Giao nhận", "Đổi trả", "Mua hàng doanh nghiệp"].map((item) => <Link key={item} className="mb-2 block text-sm text-green-100/70 hover:text-white" to="/">{item}</Link>)}</div>
        <div><h4 className="mb-4 font-bold">Tổng đài tư vấn</h4><p className="text-2xl font-black text-[#f6b511]">1800 6868</p><p className="mt-1 text-xs text-green-100/70">Miễn phí • 8:00 — 21:30 mỗi ngày</p></div>
      </div>
    </footer>
  );
}

export function StorePage({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#f7f8f4] text-[#26352d]"><StoreHeader />{children}<StoreFooter /></div>;
}
