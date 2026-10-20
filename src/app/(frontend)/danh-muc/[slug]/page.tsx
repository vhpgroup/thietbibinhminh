import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { StructuredData } from '@/components/StructuredData'
import { siteURL } from '@/lib/site-url'
import { notFound } from 'next/navigation'
import { slugCandidates } from '@/lib/slug'
import Link from 'next/link'
import { getPayloadClient } from '@/lib/payload'
import { getCatalogPage } from '@/lib/storefront'
import { ProductCard } from '@/components/ProductCard'

const findCategory = cache(unstable_cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({ collection: 'product-categories', where: { slug: { in: slugCandidates(slug) } }, limit: 1, depth: 1, overrideAccess: false })
  if (!result.docs[0]) notFound()
  return result.docs[0]
}, ['category-by-slug'], { tags: ['products'], revalidate: 300 }))

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{page?:string}> }) {
  const category = await findCategory((await params).slug)
  const page = Math.max(1, parseInt((await searchParams).page || '1', 10) || 1)
  return { title: category.seoTitle || category.name, description: category.seoDescription || category.description,
    alternates: { canonical: `/danh-muc/${category.slug}${page>1?`?page=${page}`:''}` }, robots: { index: category.indexable !== false, follow: true } }
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{slug: string}>; searchParams: Promise<{page?: string}> }) {
  const category = await findCategory((await params).slug)
  const page = Math.max(1, parseInt((await searchParams).page || '1', 10) || 1)
  const catalog = await getCatalogPage({ search: '', brand: '', category: category.slug, sort: 'featured', page })
  const children = catalog.categories.filter((item) => item.parent === category.id)
  return <main className="mx-auto max-w-[1320px] px-4 py-8">
    <StructuredData value={{'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{name:'Trang chủ',url:siteURL()},{name:category.name,url:siteURL(`/danh-muc/${category.slug}`)}].map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:item.url}))}}/>
    <nav className="text-sm"><Link href="/">Trang chủ</Link> / {category.parent && typeof category.parent === 'object' && <><Link href={`/danh-muc/${category.parent.slug}`}>{category.parent.name}</Link> / </>}{category.name}</nav>
    <h1 className="my-5 text-3xl font-bold">{category.name}</h1><p className="mb-6">{category.description}</p>
    {children.length > 0 && <nav aria-label="Danh mục con" className="mb-6 flex flex-wrap gap-2">{children.map((child) => <Link key={child.id} href={`/danh-muc/${child.slug}`} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:border-[#087c36] hover:text-[#087c36]">{child.name}</Link>)}</nav>}
    <p className="mb-4 text-sm text-slate-500">{catalog.totalDocs.toLocaleString('vi-VN')} sản phẩm</p>
    {catalog.totalDocs > 0 ? <><div className="grid grid-cols-2 gap-4 lg:grid-cols-5">{catalog.products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
    <nav className="my-6 flex gap-6">{page > 1 && <Link href={`?page=${page-1}`}>← Trước</Link>}<span>{page} / {catalog.totalPages || 1}</span>{page < catalog.totalPages && <Link href={`?page=${page+1}`}>Sau →</Link>}</nav></> : <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center"><h2 className="text-lg font-bold text-[#183126]">Danh mục chưa có sản phẩm</h2><p className="mt-3 text-sm leading-6 text-slate-500">Hiện chưa có sản phẩm phù hợp trong dữ liệu của danh mục này. Bạn có thể xem các danh mục khác hoặc liên hệ để được tư vấn.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/san-pham" className="rounded-lg bg-[#087c36] px-5 py-3 text-sm font-bold text-white">Xem tất cả sản phẩm</Link><Link href="/lien-he" className="rounded-lg border border-[#087c36] px-5 py-3 text-sm font-bold text-[#087c36]">Liên hệ tư vấn</Link></div></div>}
  </main>
}
