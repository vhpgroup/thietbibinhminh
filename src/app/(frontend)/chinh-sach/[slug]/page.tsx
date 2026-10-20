import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { getPolicies } from '@/lib/policies'

const findPolicy = cache(async (slug: string) => {
  const pages = await getPolicies()
  const page = pages.find(p => p.slug === slug)
  if (!page) notFound()
  return { page, pages }
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { page } = await findPolicy((await params).slug)
  return { title: `${page.title} | Bình Minh`, description: page.summary, alternates: { canonical: `/chinh-sach/${page.slug}` } }
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { page, pages } = await findPolicy((await params).slug)
  return <main className="mx-auto max-w-[1200px] px-4 py-8"><nav className="mb-7 text-sm text-slate-500"><Link href="/">Trang chủ</Link> / Chính sách / {page.title}</nav><div className="grid items-start gap-8 lg:grid-cols-[250px_1fr]"><aside className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="mb-4 font-bold">Hỗ trợ khách hàng</h2><nav className="space-y-1">{pages.map(p => <Link key={p.slug} href={`/chinh-sach/${p.slug}`} aria-current={p.slug === page.slug ? 'page' : undefined} className={`block rounded-lg px-3 py-3 text-sm ${p.slug === page.slug ? 'bg-green-50 font-bold text-[#087c36]' : 'text-slate-600 hover:bg-slate-50'}`}>{p.title}</Link>)}</nav><a href="tel:0876645432" className="mt-5 block border-t pt-5 font-bold text-[#087c36]">Hỗ trợ: 0876 645 432</a></aside><article className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-9"><h1 className="text-3xl font-bold leading-tight">{page.title}</h1><p className="mt-4 border-b border-slate-100 pb-6 text-slate-500">{page.summary}</p><div className="mt-7 space-y-7">{page.content.split(/\n\s*\n/).map((block, i) => {
    const [heading, ...body] = block.split('\n')
    return <section key={i}>{body.length ? <><h2 className="mb-2 text-lg font-bold text-[#087c36]">{heading}</h2><p className="whitespace-pre-line text-sm leading-7 text-slate-600">{body.join('\n')}</p></> : <p className="text-sm leading-7 text-slate-600">{heading}</p>}</section>
  })}</div><Link href="/lien-he" className="mt-8 inline-block rounded-xl bg-[#087c36] px-5 py-3 text-sm font-bold text-white">Gửi yêu cầu hỗ trợ →</Link></article></div></main>
}
