import Link from 'next/link'
import type { StorePost } from '@/lib/storefront'
import { NewsImage } from './NewsImage'

const articleURL = (post: StorePost) => `/tin-tuc/${post.slug}`
const date = (value: string) => new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh',
}).format(new Date(value))

export function HomeNews({ posts }: { posts: StorePost[] }) {
  const lead = posts.find((post) => post.featured) || posts[0]
  if (!lead) return null
  const articles = posts.filter((post) => post.id !== lead.id).slice(0, 4)

  return <section id="tin-tuc" aria-labelledby="home-news-title" className="scroll-mt-44 border-t border-slate-100 bg-white py-10 sm:py-12">
    <div className="mx-auto max-w-[1320px] px-4 lg:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e31820]">Góc công nghệ Bình Minh</p>
          <h2 id="home-news-title" className="text-2xl font-black tracking-tight text-[#173e2b] sm:text-3xl">Tin tức & kinh nghiệm</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Cập nhật công nghệ, chọn đúng thiết bị và sử dụng hiệu quả hơn.</p>
        </div>
        <Link href="/tin-tuc" className="inline-flex items-center gap-3 rounded-full border border-[#087c36]/20 px-4 py-2.5 text-xs font-bold text-[#087c36] transition hover:border-[#087c36] hover:bg-[#f0f7f1]">Xem tất cả tin tức <span aria-hidden="true">↗</span></Link>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
        <article className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <Link href={articleURL(lead)} tabIndex={-1} aria-hidden="true" className="block overflow-hidden"><NewsImage image={lead.image} title={lead.title} /></Link>
          <div className="p-5 sm:p-6">
            <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px]"><span className="rounded-full bg-[#edf7ef] px-3 py-1 font-bold text-[#087c36]">{lead.category || 'Tin công nghệ'}</span><time dateTime={lead.publishedAt} className="text-slate-400">{date(lead.publishedAt)}</time></div>
            <h3 className="line-clamp-3 text-lg font-extrabold leading-snug tracking-tight text-[#173e2b] transition group-hover:text-[#087c36] sm:text-2xl"><Link href={articleURL(lead)}>{lead.title}</Link></h3>
            {lead.excerpt && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{lead.excerpt}</p>}
            <Link href={articleURL(lead)} className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-[#087c36]">Đọc bài viết <span aria-hidden="true">→</span></Link>
          </div>
        </article>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-5">
          {articles.map((post) => <article key={post.id} className="group min-w-0">
            <Link href={articleURL(post)} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-xl"><NewsImage image={post.image} title={post.title} /></Link>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]"><span className="font-bold text-[#087c36]">{post.category || 'Tin công nghệ'}</span><span aria-hidden="true" className="text-slate-300">·</span><time dateTime={post.publishedAt} className="text-slate-400">{date(post.publishedAt)}</time></div>
            <h3 className="mt-1.5 line-clamp-3 text-sm font-bold leading-6 text-[#173e2b] transition group-hover:text-[#087c36]"><Link href={articleURL(post)}>{post.title}</Link></h3>
          </article>)}
        </div>
      </div>
    </div>
  </section>
}
