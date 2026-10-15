'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'

type IconName = 'menu' | 'search' | 'map' | 'user' | 'cart' | 'close'

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    cart: <><path d="M3 4h2l2.2 11h10.9l2-7H6.2" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export function SiteHeader({ announcement, shippingMessage }: { announcement?: string | null; shippingMessage?: string | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const nav = [['Trang chủ', '/'], ['Sản phẩm', '/san-pham'], ['Giải pháp', '/#giai-phap'], ['Dự án', '/#du-an'], ['Tin tức', '/tin-tuc'], ['Giới thiệu', '/gioi-thieu'], ['Liên hệ', '/lien-he']]

  return <>
    <header className="glass-header sticky top-0 z-50">
      <div className="signal-bar px-4 py-2.5 text-center text-[11px] font-bold tracking-[0.08em] text-white">{announcement ?? 'HỆ SINH THÁI CÔNG NGHỆ 2027'} <span className="mx-2 text-[#f6b511]">✦</span> {shippingMessage ?? 'Miễn phí giao hàng toàn quốc'}</div>
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 py-3 lg:px-6">
        <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Mở menu"><Icon name="menu" size={25} /></button>
        <Link href="/" className="relative h-16 w-[152px] shrink-0 sm:h-[72px] sm:w-[176px]" aria-label="Bình Minh"><Image src="/binh-minh-logo.png" alt="Bình Minh" fill className="object-contain" priority /></Link>
        <form className="relative hidden w-full max-w-[580px] md:ml-7 md:block" action="/san-pham"><input name="search" className="h-12 w-full rounded-2xl border border-[#087c36]/10 bg-[#f3f6f1] px-5 pr-14 text-sm outline-none focus:border-[#087c36]/40" placeholder="Tìm bằng tên, nhu cầu hoặc giải pháp AI..." /><button className="absolute right-1.5 top-1.5 grid h-9 w-11 place-items-center rounded-full bg-[#e31820] text-white" aria-label="Tìm kiếm"><Icon name="search" size={18} /></button></form>
        <div className="ml-auto flex items-center gap-3 lg:gap-5">
          <div className="hidden items-center gap-2 text-xs text-slate-500 xl:flex"><Icon name="map" /><span><small className="block">Giao đến</small><b className="text-sm text-[#183126]">Hà Nội</b></span></div>
          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><Icon name="user" /><span><small className="block">Tài khoản</small><b className="text-sm text-[#183126]">Đăng nhập</b></span></div>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-[#eef7f0]" aria-label="Giỏ hàng"><Icon name="cart" /></button>
        </div>
      </div>
      <div className="mx-auto max-w-[1320px] px-4 pb-3 md:hidden"><form className="relative" action="/san-pham"><input name="search" className="h-10 w-full rounded-full bg-slate-100 px-5 pr-12 text-sm outline-none" placeholder="Tìm kiếm sản phẩm..." /><button className="absolute right-3 top-2 text-[#e31820]" aria-label="Tìm kiếm"><Icon name="search" /></button></form></div>
      <nav className="border-t border-[#087c36]/10 bg-white/70"><div className="mx-auto hidden max-w-[1320px] items-center px-4 lg:flex lg:px-6">
        <Link href="/san-pham" className="my-1 flex w-[248px] shrink-0 items-center gap-2 rounded-full bg-[#087c36] px-4 py-2.5 text-[12px] font-extrabold text-white"><Icon name="menu" size={19} /> DANH MỤC SẢN PHẨM</Link>
        {nav.map(([label, href]) => <Link key={label} href={href} className="my-1 flex-1 rounded-full py-2.5 text-center text-[11px] font-extrabold uppercase hover:bg-[#e9f6ed]">{label}</Link>)}
      </div></nav>
    </header>
    {mobileOpen && <div className="fixed inset-0 z-[70] bg-[#173e2b]/50" onClick={() => setMobileOpen(false)}><aside className="h-full w-[86%] max-w-sm bg-white p-5" onClick={(event) => event.stopPropagation()}><div className="mb-6 flex items-center justify-between"><Image src="/binh-minh-logo.png" alt="Bình Minh" width={128} height={80} className="h-16 w-32 object-contain" /><button onClick={() => setMobileOpen(false)} aria-label="Đóng menu"><Icon name="close" /></button></div>{nav.map(([label, href]) => <Link key={label} href={href} onClick={() => setMobileOpen(false)} className="block border-b border-slate-100 py-3 text-sm font-bold">{label}</Link>)}</aside></div>}
  </>
}
