'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { StoreBanner, StoreProduct } from '@/lib/storefront'
import { ProductCard } from './ProductCard'

export function HomeExperience({ banners, products }: { banners: StoreBanner[]; products: StoreProduct[] }) {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    if (banners.length < 2) return
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % banners.length), 5000)
    return () => window.clearInterval(timer)
  }, [banners.length])

  const active = banners[slide]
  const categories = [...new Set(products.map((item) => item.category))].filter(Boolean)

  return <main>
    <section className="mx-auto max-w-[1320px] px-4 pb-6 pt-7 lg:px-6">
      <div className="grid gap-4 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="soft-card hidden rounded-[24px] bg-white p-3 lg:block"><p className="mb-2 px-2 text-[10px] font-black uppercase tracking-wider text-slate-400">Danh mục giải pháp</p>{categories.slice(0, 9).map((item) => <Link key={item} href={`/san-pham?category=${encodeURIComponent(item)}`} className="flex items-center justify-between rounded-xl px-3 py-3 text-[13px] font-bold hover:bg-[#e8f2e8] hover:text-[#087c36]"><span>{item}</span><span>›</span></Link>)}</aside>
        <div className="soft-card relative min-h-[390px] overflow-hidden rounded-[30px] bg-[#064b27] sm:min-h-[470px]">
          {active?.image ? <Image src={active.image.url} alt={active.image.alt || active.title} fill priority className={`object-cover ${active.displayMode === 'image-only' ? '' : 'opacity-55'}`} /> : null}
          {active?.displayMode !== 'image-only' && <><div className="carousel-shade absolute inset-0" /><div className="relative z-10 flex min-h-[390px] max-w-2xl flex-col justify-center p-8 text-white sm:min-h-[470px] sm:p-12"><p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f6b511]">{active?.eyebrow}</p><h1 className="future-title mt-4 text-4xl font-black leading-none sm:text-6xl">{active?.title}<br /><span className="text-[#f6b511]">{active?.accent}</span></h1><p className="mt-5 max-w-lg text-sm leading-7 text-white/75">{active?.description}</p><Link href={active?.ctaURL || '/san-pham'} className="mt-6 w-fit rounded-full bg-[#e31820] px-6 py-3 text-xs font-extrabold">{active?.ctaLabel || 'Khám phá ngay'}</Link></div></>}
          {banners.length > 1 && <div className="absolute bottom-5 left-8 z-20 flex gap-2">{banners.map((banner, index) => <button key={banner.id} onClick={() => setSlide(index)} aria-label={`Banner ${index + 1}`} className={`h-2 rounded-full ${index === slide ? 'w-8 bg-[#e31820]' : 'w-2 bg-white/70'}`} />)}</div>}
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-[1320px] px-4 py-7 lg:px-6">
      <div className="mb-6 flex items-end justify-between"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e31820]">Bình Minh select</p><h2 className="future-title mt-1 text-3xl font-black">Sản phẩm nổi bật</h2></div><Link href="/san-pham" className="text-xs font-extrabold text-[#087c36]">Xem tất cả →</Link></div>
      {products.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{products.slice(0, 10).map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="soft-card rounded-2xl bg-white p-12 text-center text-sm text-slate-500">Sản phẩm sẽ xuất hiện sau khi được xuất bản trong CMS.</div>}
    </section>

    <section className="mx-auto grid max-w-[1320px] gap-4 px-4 py-8 sm:grid-cols-3 lg:px-6">{[['Tư vấn đúng nhu cầu', 'Đội ngũ am hiểu giải pháp B2B/B2C'], ['Hàng chính hãng', 'Đầy đủ CO/CQ và hóa đơn VAT'], ['Hỗ trợ dài hạn', 'Đồng hành xuyên suốt vòng đời thiết bị']].map(([title, text]) => <div key={title} className="rounded-[24px] bg-[#e8f2e8] p-6"><h3 className="font-black text-[#087c36]">{title}</h3><p className="mt-2 text-xs leading-6 text-slate-600">{text}</p></div>)}</section>
  </main>
}
