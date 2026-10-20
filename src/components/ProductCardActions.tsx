import Link from 'next/link'
import type { StoreProduct } from '@/lib/storefront'
import { AddToCart } from './Cart'

export function ProductCardActions({ product }: { product: StoreProduct }) {
  return <div className="mt-auto flex items-center gap-2 pt-3">
    <Link href={`/san-pham/${product.slug}`} className="flex h-9 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#087c36]/25 bg-white px-2 text-[11px] font-bold text-[#087c36] transition hover:border-[#087c36] hover:bg-[#f0f7f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087c36]">
      Xem chi tiết <span aria-hidden="true">→</span>
    </Link>
    <AddToCart product={product} compact />
  </div>
}
