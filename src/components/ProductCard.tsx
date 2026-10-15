import Image from 'next/image'
import Link from 'next/link'
import type { StoreProduct } from '@/lib/storefront'

export const formatPrice = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}₫`

export function ProductCard({ product }: { product: StoreProduct }) {
  return <article className="product-card group flex min-h-[390px] flex-col overflow-hidden rounded-2xl border bg-white p-3 transition hover:-translate-y-1">
    <Link href={`/san-pham/${product.slug}`} className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-[#f7f8f5] sm:h-44">
      {product.image ? <Image src={product.image.url} alt={product.image.alt || product.name} width={product.image.width} height={product.image.height} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <span className="text-xs text-slate-400">Chưa có ảnh</span>}
      {product.badge && <span className="absolute left-2 top-2 rounded-md bg-[#f6b511] px-2 py-1 text-[10px] font-black">{product.badge}</span>}
    </Link>
    <div className="mt-3 flex flex-1 flex-col">
      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#087c36]">{product.brand} • {product.sku}</p>
      <Link href={`/san-pham/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-xs font-semibold leading-5 hover:text-[#e31820] sm:text-[13px]">{product.name}</Link>
      <p className="mt-1 truncate text-[10px] text-slate-400">{product.shortSpec}</p>
      <div className="mt-2 flex items-center justify-between"><span className="text-[11px] font-bold text-[#f0a500]">★ {product.rating} <span className="text-slate-400">({product.reviews})</span></span><span className="text-[10px] font-semibold text-[#087c36]">● Còn hàng</span></div>
      <div className="mt-3"><p className="h-4 text-[10px] text-slate-400 line-through">{product.oldPrice ? formatPrice(product.oldPrice) : ''}</p><strong className="text-lg font-black text-[#e31820]">{formatPrice(product.price)}</strong></div>
      <Link href={`/san-pham/${product.slug}`} className="mt-auto block rounded-xl bg-[#e31820] py-2.5 text-center text-xs font-bold text-white">Xem sản phẩm</Link>
    </div>
  </article>
}
