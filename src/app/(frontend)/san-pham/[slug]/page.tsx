import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/components/ProductCard'
import { getProductBySlug } from '@/lib/storefront'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  return <main className="mx-auto max-w-[1320px] px-4 py-7 lg:px-6">
    <nav className="mb-5 text-xs text-slate-500"><Link href="/">Trang chủ</Link> <span className="mx-2">/</span><Link href="/san-pham">Sản phẩm</Link></nav>
    <section className="soft-card grid gap-8 rounded-[32px] bg-white p-5 sm:p-8 lg:grid-cols-2">
      <div className="relative min-h-[350px] overflow-hidden rounded-2xl bg-[#f7f8f5]">{product.image && <Image src={product.image.url} alt={product.image.alt || product.name} fill className="object-cover" priority />}</div>
      <div><p className="text-xs font-extrabold uppercase tracking-wider text-[#087c36]">{product.brand} • {product.category}</p><h1 className="future-title mt-3 text-3xl font-black sm:text-4xl">{product.name}</h1><p className="mt-3 text-xs text-slate-500">★ {product.rating}/5 • {product.reviews} đánh giá • Mã {product.sku}</p><p className="mt-5 text-sm leading-7 text-slate-600">{product.description}</p><div className="my-6 rounded-2xl bg-[#f4f6f0] p-5"><strong className="text-3xl font-black text-[#e31820]">{formatPrice(product.price)}</strong>{product.oldPrice && <span className="ml-3 text-sm text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>}</div><div className="rounded-2xl bg-[#e8f2e8] p-5"><p className="font-black text-[#087c36]">Có thể giao ngay</p><p className="mt-1 text-xs text-slate-600">Còn {product.stock} sản phẩm • Hỗ trợ xuất hóa đơn VAT</p></div><button className="mt-5 h-12 w-full rounded-xl bg-[#e31820] text-sm font-extrabold text-white">Liên hệ đặt hàng</button></div>
    </section>
    <section className="mt-8 grid gap-6 lg:grid-cols-2"><div className="rounded-2xl bg-white p-7"><h2 className="text-xl font-black">Điểm nổi bật</h2><div className="mt-4 space-y-3">{product.highlights.map((item) => <p key={item} className="rounded-xl bg-[#f4f6f0] p-4 text-sm font-semibold">{item}</p>)}</div></div><div className="rounded-2xl bg-white p-7"><h2 className="text-xl font-black">Thông số kỹ thuật</h2><dl className="mt-4">{product.specs.map((item) => <div key={item.label} className="grid grid-cols-[130px_1fr] border-b border-slate-100 py-3 text-xs"><dt className="text-slate-500">{item.label}</dt><dd className="font-semibold">{item.value}</dd></div>)}</dl></div></section>
  </main>
}
