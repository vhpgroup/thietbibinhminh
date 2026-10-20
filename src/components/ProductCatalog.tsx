import Link from 'next/link'
import type { CatalogFilters, StoreProduct } from '@/lib/storefront'
import { ProductCard } from './ProductCard'
import { CatalogFilterBar } from './CatalogFilterBar'

type Option = { name: string; slug: string }

export function ProductCatalog({
  products, totalDocs, totalPages, page, categories, brands, filters,
}: {
  products: StoreProduct[]
  totalDocs: number
  totalPages: number
  page: number
  categories: (Option & {id:number;parent:number|null})[]
  brands: Option[]
  filters: CatalogFilters
}) {
  const pageURL = (nextPage: number) => {
    const params = new URLSearchParams()
    if (filters.search) params.set('search', filters.search)
    if (filters.category) params.set('category', filters.category)
    if (filters.brand) params.set('brand', filters.brand)
    if (filters.sort !== 'featured') params.set('sort', filters.sort)
    params.set('page', String(nextPage))
    return `/san-pham?${params.toString()}`
  }

  return <main className="mx-auto max-w-[1420px] px-4 py-8 lg:px-6">
    <h1 className="sr-only">Sản phẩm Bình Minh</h1>
    <CatalogFilterBar categories={categories} brands={brands} filters={filters} />
    <p className="my-6 text-sm text-slate-600">Có <strong>{totalDocs.toLocaleString('vi-VN')}</strong> sản phẩm phù hợp</p>
    {products.length ? <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="rounded-2xl bg-white p-16 text-center text-sm text-slate-500">Không tìm thấy sản phẩm phù hợp. Hãy chọn danh mục hoặc thương hiệu khác.</div>}
    {totalPages > 1 && <nav aria-label="Trang sản phẩm" className="mt-9 flex items-center justify-center gap-3 text-sm"><Link href={pageURL(Math.max(1, page - 1))} aria-disabled={page <= 1} className={`rounded-full border px-5 py-2.5 font-bold ${page <= 1 ? 'pointer-events-none opacity-40' : 'bg-white'}`}>← Trước</Link><span className="px-2 font-bold">{page} / {totalPages}</span><Link href={pageURL(Math.min(totalPages, page + 1))} aria-disabled={page >= totalPages} className={`rounded-full border px-5 py-2.5 font-bold ${page >= totalPages ? 'pointer-events-none opacity-40' : 'bg-white'}`}>Sau →</Link></nav>}
  </main>
}

