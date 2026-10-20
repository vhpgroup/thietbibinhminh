'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import type { StoreBanner, StoreProduct } from '@/lib/storefront'
import { formatPrice } from './ProductCard'
import { ProductVisual } from './ProductVisual'
import { ProductCardActions } from './ProductCardActions'
import { CategoryMenuBranch, type CategoryMenuLink } from './CategoryMenuBranch'

type IconName = 'printer' | 'laptop' | 'network' | 'camera' | 'meeting' | 'software' | 'power' | 'menu' | 'chevron' | 'shield' | 'truck' | 'headset'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    printer: <><path d="M7 8V3h10v5M7 17H4V9h16v8h-3" /><rect x="7" y="14" width="10" height="7" /></>,
    laptop: <><rect x="4" y="4" width="16" height="12" rx="1" /><path d="M2 20h20" /></>,
    network: <><circle cx="12" cy="5" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="18" r="2" /><path d="m11 7-5 9m7-9 5 9M7 18h10" /></>,
    camera: <><path d="M4 7h3l2-2h6l2 2h3v12H4z" /><circle cx="12" cy="13" r="4" /></>,
    meeting: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2" /><path d="M2 20a6 6 0 0 1 12 0m0-4a5 5 0 0 1 8 4" /></>,
    software: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18m-12 5h6m-6 3h4" /></>,
    power: <><path d="M12 2v10M7 5.5a8 8 0 1 0 10 0" /></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    shield: <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />,
    truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    headset: <><path d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v5H4zm13 0h3v5h-3z" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const fallbackSlides = [
  { eyebrow: 'BÌNH MINH TECHNOLOGY', title: 'Hiệu suất bứt phá.', accent: 'Sẵn sàng tương lai.', description: 'Thiết bị công nghệ và giải pháp đồng bộ cho một ngày làm việc hiệu quả hơn.', ctaLabel: 'Khám phá sản phẩm', ctaURL: '/san-pham', image: null, displayMode: 'overlay' as const },
  { eyebrow: 'VĂN PHÒNG THÔNG MINH', title: 'Số hóa tinh gọn.', accent: 'Vận hành tối ưu.', description: 'Máy scan, máy in và thiết bị văn phòng đáp ứng nhu cầu của từng đội ngũ.', ctaLabel: 'Xem thiết bị văn phòng', ctaURL: '/san-pham?category=thiet-bi-van-phong', image: null, displayMode: 'overlay' as const },
  { eyebrow: 'KẾT NỐI BỀN VỮNG', title: 'Hạ tầng vững chắc.', accent: 'Sáng tạo không giới hạn.', description: 'Từ mạng doanh nghiệp đến thiết bị hình ảnh, Bình Minh cùng bạn mở rộng khả năng.', ctaLabel: 'Khám phá giải pháp', ctaURL: '/#giai-phap', image: null, displayMode: 'overlay' as const },
]

const categoryURL = (slug: string) => `/danh-muc/${encodeURIComponent(slug)}`

function HomeProductCard({ product, deal = false }: { product: StoreProduct; deal?: boolean }) {
  const discount = product.oldPrice && product.price > 0 && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  return <article className="home-product-card group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#e2eae2] bg-white p-3">
    <Link href={`/san-pham/${product.slug}`} className="relative mb-3 grid h-32 place-items-center overflow-hidden rounded-lg bg-white sm:h-40">
      <ProductVisual image={product.image} name={product.name} category={product.category} variant="home" />
      {discount > 0 && <span className="absolute left-2 top-2 rounded-md bg-[#f6b511] px-2 py-1 text-[10px] font-black text-[#26352d]">-{discount}%</span>}
    </Link>
    <p className="truncate text-[10px] font-semibold text-slate-400">{product.shortSpec || product.brand}</p>
    <Link href={`/san-pham/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-xs font-bold leading-5 hover:text-[#e31820] sm:text-[13px]">{product.name}</Link>
    <strong className="mt-2 text-base font-black text-[#d71920]">{product.price > 0 ? formatPrice(product.price) : 'Liên hệ báo giá'}</strong>
    {!!product.oldPrice && product.oldPrice > product.price && <span className="text-[10px] text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>}
    <ProductCardActions product={product} />
  </article>
}

export function HomeExperience({ banners, deals, sections, categories: homeCategories, news }: { banners: StoreBanner[]; deals: StoreProduct[]; sections: { key: string; products: StoreProduct[] }[]; news?: ReactNode; categories: {key: string; name: string; icon: IconName; primary: string; links: [string, string][]; groups: {name: string; slug: string; links: CategoryMenuLink[]}[]}[] }) {
  const [slide, setSlide] = useState(0)
  const [activeMega, setActiveMega] = useState<number | null>(null)
  const slides: StoreBanner[] = [{ id: 'microsoft-365', title: 'Microsoft 365 Business Standard và Business Premium', image: { url: '/microsoft-365-hero.png', alt: 'Bình Minh – Microsoft 365 Business Standard và Business Premium', width: 1672, height: 941 }, displayMode: 'image-only', ctaURL: '/danh-muc/microsoft-365' }, ...banners]
  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6000)
    return () => window.clearInterval(timer)
  }, [slides.length])
  const active = slides[slide % slides.length]
  const goToSlide = (direction: number) => setSlide((current) => (current + direction + slides.length) % slides.length)

  return <main className="home-landing">
    <section className="mx-auto max-w-[1320px] px-4 py-4 lg:px-6">
      <div className="relative grid gap-3 lg:grid-cols-[248px_minmax(0,1fr)_220px]">
        <aside className="z-30 hidden rounded-xl bg-white py-1 shadow-[0_5px_24px_rgba(8,124,54,0.1)] lg:block" onMouseLeave={() => setActiveMega(null)}>
          {homeCategories.map((category, index) => <Link key={category.key} href={categoryURL(category.primary)} onMouseEnter={() => setActiveMega(index)} onFocus={() => setActiveMega(index)} className={`flex h-[42px] items-center gap-3 border-l-2 px-3 text-[13px] font-semibold transition ${activeMega === index ? 'border-[#e31820] bg-[#fff7e0] text-[#e31820]' : 'border-transparent hover:bg-slate-50'}`}><span className={activeMega === index ? 'text-[#e31820]' : 'text-slate-500'}><Icon name={category.icon} /></span><span className="truncate">{category.name}</span><span className="ml-auto text-slate-400"><Icon name="chevron" size={14} /></span></Link>)}
          {activeMega !== null && <div className="mega-panel absolute left-[248px] right-0 top-0 z-40 h-full overflow-y-auto overscroll-contain rounded-r-xl border border-slate-100 bg-white p-8 shadow-[0_14px_45px_rgba(8,124,54,0.18)]"><div className="columns-3 gap-8 xl:columns-4">{homeCategories[activeMega].groups.map((group) => <div key={group.slug} className="mb-6 break-inside-avoid"><Link href={categoryURL(group.slug)} className="mb-3 block text-sm font-extrabold text-[#087c36] hover:text-[#e31820]">{group.name}</Link><ul className="space-y-1.5">{group.links.map((leaf) => <CategoryMenuBranch key={leaf.slug} item={leaf} />)}</ul></div>)}</div><Link href={categoryURL(homeCategories[activeMega].primary)} className="mt-7 inline-block text-xs font-bold text-[#e31820]">Xem tất cả {homeCategories[activeMega].name.toLowerCase()} →</Link></div>}
        </aside>

        <div className="home-hero relative h-[330px] overflow-hidden rounded-2xl bg-[#07552a] text-white lg:h-full lg:min-h-[388px]">
          {active.image && <Image src={active.image.url} alt={active.image.alt || active.title} fill priority sizes="(max-width: 1024px) 100vw, 850px" className={`object-cover ${active.displayMode === 'image-only' ? 'object-contain bg-white' : 'opacity-40'}`} />}
          {active.displayMode === 'image-only' && <Link href={active.ctaURL || '/san-pham'} className="absolute inset-0 z-10" aria-label={active.title} />}
          {active.displayMode !== 'image-only' && <><div className="home-hero-pattern absolute inset-0" /><div className="home-hero-shade absolute inset-0" /><div className="home-hero-device absolute right-[-4%] top-[12%] hidden h-[78%] w-[40%] rounded-[30px] border border-white/15 sm:block"><div className="absolute inset-7 rounded-2xl border border-white/20" /><div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f6b511]/50" /></div><div className="relative z-10 flex h-full max-w-[570px] flex-col justify-center px-8 sm:px-11"><span className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#f6b511]">{active.eyebrow}</span><h1 className="future-title text-3xl font-black leading-[1.08] sm:text-4xl lg:text-[44px]">{active.title}<br /><span className="text-[#f6b511]">{active.accent}</span></h1><p className="mt-4 max-w-md text-sm leading-6 text-white/80">{active.description}</p><Link href={active.ctaURL || '/san-pham'} className="mt-5 w-fit rounded-full bg-[#e31820] px-5 py-3 text-xs font-extrabold transition hover:bg-[#c5131a]">{active.ctaLabel || 'Khám phá ngay'}</Link></div></>}
          {slides.length > 1 && <><button onClick={() => goToSlide(-1)} className="absolute bottom-4 right-14 z-20 grid h-9 w-9 rotate-180 place-items-center rounded-full bg-white/85 text-[#087c36] shadow-md lg:bottom-auto lg:left-3 lg:right-auto lg:top-1/2 lg:-translate-y-1/2" aria-label="Banner trước"><Icon name="chevron" size={17} /></button><button onClick={() => goToSlide(1)} className="absolute bottom-4 right-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-[#087c36] shadow-md lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2" aria-label="Banner tiếp theo"><Icon name="chevron" size={17} /></button><div className="absolute bottom-5 left-8 z-20 flex gap-2 sm:left-11">{slides.map((item, index) => <button key={item.title} onClick={() => setSlide(index)} className={`h-1.5 rounded-full transition-all ${index === slide ? 'w-8 bg-[#e31820]' : 'w-3 bg-white/60'}`} aria-label={`Xem banner ${index + 1}`} />)}</div></>}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1 lg:grid-rows-2">
          <Link href={categoryURL('may-in-muc-in')} className="home-promo home-promo-light group relative overflow-hidden rounded-2xl p-5"><span className="text-[10px] font-extrabold uppercase tracking-widest text-[#e31820]">Văn phòng số</span><h2 className="relative mt-2 text-lg font-black leading-tight sm:text-xl">Máy in cho<br />mọi quy mô</h2><span className="relative mt-5 inline-block text-xs font-bold">Xem sản phẩm →</span><span className="home-promo-glyph">▣</span></Link>
          <Link href={categoryURL('thiet-bi-van-phong')} className="home-promo home-promo-dark group relative overflow-hidden rounded-2xl p-5 text-white"><span className="text-[10px] font-extrabold uppercase tracking-widest text-[#f6b511]">Kết nối cộng tác</span><h2 className="relative mt-2 text-lg font-black leading-tight sm:text-xl">Thiết bị hội nghị<br />thông minh</h2><span className="relative mt-5 inline-block text-xs font-bold">Khám phá →</span><span className="home-promo-glyph">◎</span></Link>
        </div>
      </div>
      <div className="campaign-strip mt-4 grid grid-cols-2 gap-3 rounded-2xl p-4 lg:grid-cols-4">{[{title: 'VĂN PHÒNG', subtitle: 'SỐ HÓA VĂN PHÒNG', slug: 'thiet-bi-van-phong', tone: 'blue', icon: 'printer' as IconName}, {title: 'LAPTOP', subtitle: 'HIỆU SUẤT BỨT PHÁ', slug: 'laptop', tone: 'green', icon: 'laptop' as IconName}, {title: 'HỘI NGHỊ', subtitle: 'KẾT NỐI THÔNG MINH', slug: 'thiet-bi-van-phong', tone: 'red', icon: 'meeting' as IconName}, {title: 'PHẦN MỀM', subtitle: 'BẢN QUYỀN CHÍNH HÃNG', slug: 'phan-mem-ban-quyen', tone: 'gold', icon: 'software' as IconName}].map((item) => <Link key={item.slug} href={categoryURL(item.slug)} className={`campaign-card campaign-${item.tone} group relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-2xl border-[3px] border-[#f6cf62] px-3 py-5 text-center text-white`}><span className="absolute -bottom-3 -right-3 rotate-[-12deg] text-white/15"><Icon name={item.icon} size={110} /></span><strong className="campaign-title relative text-2xl font-black italic sm:text-3xl">{item.title}</strong><span className="relative mt-1 text-[10px] font-extrabold sm:text-xs">{item.subtitle}</span><span className="relative mt-3 rounded-full bg-white px-5 py-1 text-[10px] font-black text-[#183126] transition group-hover:scale-105">KHÁM PHÁ NGAY →</span></Link>)}</div>
    </section>

    {deals.length > 0 && <section id="san-pham" className="mx-auto max-w-[1320px] px-4 py-5 lg:px-6"><div className="rounded-[24px] bg-[#e31820] p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-end justify-between gap-3 text-white"><div><span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-100">Sản phẩm có giá tham khảo tốt</span><h2 className="text-2xl font-black tracking-tight">Săn deal giá tốt</h2></div><Link href="/san-pham?sort=price-asc" className="rounded-full border border-white/50 px-4 py-2 text-xs font-bold hover:bg-white/10">Xem thêm sản phẩm →</Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{deals.map((product) => <HomeProductCard key={product.id} product={product} deal />)}</div></div></section>}

    <section id="giai-phap" className="mx-auto grid max-w-[1320px] gap-3 px-4 py-4 sm:grid-cols-3 lg:px-6">{[
      { title: 'Giải pháp số hóa tài liệu', text: 'Máy scan · Lưu trữ · Quản trị', href: categoryURL('thiet-bi-van-phong'), tone: 'green' },
      { title: 'Hạ tầng mạng doanh nghiệp', text: 'WiFi · Switch · Bảo mật', href: categoryURL('thiet-bi-mang-camera'), tone: 'deep' },
      { title: 'Không gian cộng tác hiện đại', text: 'Camera · Hội nghị · Âm thanh', href: categoryURL('thiet-bi-van-phong'), tone: 'gold' },
    ].map((item) => <Link key={item.title} href={item.href} className={`home-solution-banner home-solution-${item.tone} group relative min-h-[170px] overflow-hidden rounded-2xl p-6 text-white`}><div className="relative z-10"><h3 className="max-w-[260px] text-xl font-black">{item.title}</h3><p className="mt-2 text-xs text-white/80">{item.text}</p><span className="mt-5 inline-block text-xs font-extrabold text-[#f6b511]">Tìm hiểu thêm →</span></div><span className="absolute -bottom-12 right-3 text-[150px] font-light leading-none text-white/10">◎</span></Link>)}</section>

    <div id="du-an" className="py-3">{homeCategories.map((category, index) => {
      const products = sections.find((item) => item.key === category.key)?.products || []
      if (!products.length) return null
      return <section id={`category-${category.key}`} key={category.key} className={`scroll-mt-40 ${index % 2 === 1 ? 'bg-white/60' : ''}`}><div className="mx-auto max-w-[1320px] px-4 py-7 lg:px-6"><div className="mb-5 flex items-end justify-between gap-3"><div>{index === 0 && <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e31820]">Mua sắm theo nhu cầu</span>}<h2 className="mt-1 flex items-center gap-2 text-xl font-black tracking-[-0.03em] sm:text-2xl"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#087c36] text-white"><Icon name={category.icon} /></span>{category.name}</h2></div><Link href={categoryURL(category.primary)} className="shrink-0 text-xs font-extrabold text-[#e31820]">Xem tất cả →</Link></div><div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">{products.map((product) => <HomeProductCard key={product.id} product={product} />)}</div></div></section>
    })}</div>

    {news}

    <section className="mt-5 border-y border-slate-200 bg-white"><div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-y-6 px-4 py-7 lg:grid-cols-4 lg:px-6">{[
      { icon: 'truck' as IconName, title: 'Giao hàng toàn quốc', text: 'Tư vấn phương án giao nhận' },
      { icon: 'shield' as IconName, title: 'Thiết bị chính hãng', text: 'Nguồn gốc sản phẩm rõ ràng' },
      { icon: 'headset' as IconName, title: 'Tư vấn đúng nhu cầu', text: 'Chọn cấu hình phù hợp' },
      { icon: 'network' as IconName, title: 'Giải pháp đồng bộ', text: 'Thiết bị và hỗ trợ kỹ thuật' },
    ].map((feature) => <div key={feature.title} className="flex items-center gap-3 px-2 lg:border-r lg:border-slate-200 lg:px-5 lg:last:border-0"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#fff7e0] text-[#e31820]"><Icon name={feature.icon} /></span><span><b className="block text-xs sm:text-sm">{feature.title}</b><small className="text-[10px] text-slate-500 sm:text-[11px]">{feature.text}</small></span></div>)}</div></section>
  </main>
}








