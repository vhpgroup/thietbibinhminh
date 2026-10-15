import { ProductCatalog } from '@/components/ProductCatalog'
import { getProducts } from '@/lib/storefront'
import { Suspense } from 'react'

export default async function ProductsPage() {
  const products = await getProducts()
  return <Suspense fallback={<div className="mx-auto max-w-[1420px] p-10 text-sm text-slate-500">Đang tải danh mục...</div>}><ProductCatalog products={products} /></Suspense>
}
