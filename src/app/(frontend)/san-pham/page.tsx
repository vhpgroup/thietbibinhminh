import { ProductCatalog } from '@/components/ProductCatalog'
import { getCatalogPage, type CatalogFilters } from '@/lib/storefront'

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const filtered = Boolean(params.search || params.category || params.brand || params.sort)
  const page = typeof params.page === 'string' ? Math.max(1, parseInt(params.page, 10) || 1) : 1
  return { title: 'Sản phẩm | Bình Minh', description: 'Thiết bị và giải pháp công nghệ tại Bình Minh.', alternates: { canonical: `/san-pham${page>1?`?page=${page}`:''}` }, robots: { index: !filtered, follow: true } }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const one = (name: string) => typeof params[name] === 'string' ? params[name] as string : ''

  const filters: CatalogFilters = {
    search: one('search').trim().slice(0, 100),
    category: one('category'),
    brand: one('brand'),
    sort: one('sort') || 'featured',
    page: Math.max(1, Number.parseInt(one('page') || '1', 10) || 1),
  }
  const catalog = await getCatalogPage(filters)
  return <ProductCatalog {...catalog} filters={filters} />
}

