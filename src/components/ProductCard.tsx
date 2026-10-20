import Link from 'next/link'
import type { StoreProduct } from '@/lib/storefront'
import { ProductVisual } from './ProductVisual'
import { ProductCardActions } from './ProductCardActions'

export const formatPrice = (value: number) => `${new Intl.NumberFormat('vi-VN').format(value)}₫`

export function ProductCard({ product }: { product: StoreProduct }) {
  return <article className="product-card group flex min-h-[360px] flex-col overflow-hidden rounded-2xl border bg-white p-3 transition hover:-translate-y-1">
    <Link href={`/san-pham/${product.slug}`} className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl bg-white sm:h-44">
      <ProductVisual image={product.image} name={product.name} category={product.category} />
      {product.badge && <span className="absolute left-2 top-2 rounded-md bg-[#f6b511] px-2 py-1 text-[10px] font-black">{product.badge}</span>}
    </Link>
    <div className="mt-3 flex flex-1 flex-col">
      <p className="text-[9px] font-extrabold uppercase tracking-wider text-[#087c36]">{product.brand} • {product.sku}</p>
      <Link href={`/san-pham/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-xs font-semibold leading-5 hover:text-[#e31820] sm:text-[13px]">{product.name}</Link>
      <p className="mt-1 truncate text-[10px] text-slate-400">{product.shortSpec}</p>
      {product.reviews > 0 && <div className="mt-2 text-[11px] font-bold text-[#f0a500]">★ {product.rating} <span className="text-slate-400">({product.reviews})</span></div>}
      <div className="mt-3">{!!product.oldPrice && product.oldPrice > product.price && <p className="text-[10px] text-slate-400 line-through">{formatPrice(product.oldPrice)}</p>}<strong className="text-lg font-black text-[#e31820]">{product.price > 0 ? formatPrice(product.price) : 'Liên hệ báo giá'}</strong></div>
      <ProductCardActions product={product} />
    </div>
  </article>
}


