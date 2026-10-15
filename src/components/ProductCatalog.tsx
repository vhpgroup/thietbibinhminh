'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { StoreProduct } from '@/lib/storefront'
import { ProductCard } from './ProductCard'

export function ProductCatalog({ products }: { products: StoreProduct[] }) {
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get('search') ?? ''
  const [category, setCategory] = useState('Tất cả')
  const [brand, setBrand] = useState('Tất cả')
  const [sort, setSort] = useState('featured')
  const categories = ['Tất cả', ...new Set(products.map((item) => item.category).filter(Boolean))]
  const brands = ['Tất cả', ...new Set(products.map((item) => item.brand).filter(Boolean))]
  const filtered = useMemo(() => {
    const q = initialSearch.toLocaleLowerCase('vi')
    const result = products.filter((item) => (category === 'Tất cả' || item.category === category) && (brand === 'Tất cả' || item.brand === brand) && (!q || `${item.name} ${item.sku} ${item.brand}`.toLocaleLowerCase('vi').includes(q)))
    if (sort === 'price-asc') return [...result].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...result].sort((a, b) => b.price - a.price)
    if (sort === 'rating') return [...result].sort((a, b) => b.rating - a.rating)
    return result
  }, [brand, category, initialSearch, products, sort])

  return <main className="mx-auto max-w-[1420px] px-4 py-5 lg:px-6">
    <div className="soft-card rounded-2xl bg-white p-3.5"><div className="flex flex-wrap items-center gap-2.5"><strong className="text-[11px] uppercase">Bộ lọc</strong><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold">{categories.map((item) => <option key={item}>{item}</option>)}</select><select value={brand} onChange={(event) => setBrand(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold">{brands.map((item) => <option key={item}>{item}</option>)}</select><label className="ml-auto flex items-center gap-2 text-xs text-slate-500">Sắp xếp<select value={sort} onChange={(event) => setSort(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 font-bold text-slate-700"><option value="featured">Phù hợp nhất</option><option value="price-asc">Giá tăng dần</option><option value="price-desc">Giá giảm dần</option><option value="rating">Đánh giá tốt</option></select></label></div></div>
    <p className="my-5 text-sm text-slate-600">Có <strong>{filtered.length}</strong> sản phẩm phù hợp</p>
    {filtered.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-2xl bg-white p-16 text-center text-sm text-slate-500">Không tìm thấy sản phẩm phù hợp.</div>}
  </main>
}
