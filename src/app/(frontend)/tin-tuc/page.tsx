import Image from 'next/image'
import Link from 'next/link'
import { getPosts, type StorePost } from '@/lib/storefront'

const dateLabel = (value: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))

function Meta({ post, light = false }: { post: StorePost; light?: boolean }) {
  return <p className={`mt-2 text-[10px] font-semibold ${light ? 'text-white/75' : 'text-slate-400'}`}><span className={light ? 'text-[#f6b511]' : 'text-[#087c36]'}>{post.category}</span> • {dateLabel(post.publishedAt)}</p>
}

export default async function NewsPage() {
  const posts = await getPosts()
  const [featured, ...rest] = posts
  if (!featured) return <main className="mx-auto max-w-[1240px] px-4 py-20 text-center"><h1 className="text-3xl font-black">Tin công nghệ</h1><p className="mt-3 text-sm text-slate-500">Bài viết sẽ xuất hiện sau khi được xuất bản trong CMS.</p></main>
  return <main className="bg-white">
    <div className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1240px] gap-2 overflow-x-auto px-4 py-3">{['Tất cả', ...new Set(posts.map((item) => item.category))].map((item, index) => <span key={item} className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold ${index === 0 ? 'bg-[#087c36] text-white' : 'text-slate-600'}`}>{item}</span>)}</div></div>
    <section className="mx-auto max-w-[1240px] px-4 py-8">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#e31820]">Bình Minh Newsroom</p><h1 className="future-title mt-1 text-4xl font-black text-[#07552a]">Tin được quan tâm</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <article className="group relative min-h-[420px] overflow-hidden rounded-2xl">{featured.image && <Image src={featured.image.url} alt={featured.image.alt || featured.title} fill priority className="object-cover transition duration-700 group-hover:scale-105" />}<div className="absolute inset-0 bg-gradient-to-t from-[#042e19] via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-7 text-white"><span className="rounded bg-[#e31820] px-2 py-1 text-[10px] font-black">NỔI BẬT</span><h2 className="mt-4 max-w-3xl text-3xl font-black">{featured.title}</h2><Meta post={featured} light /><p className="mt-3 max-w-2xl text-sm text-white/70">{featured.excerpt}</p></div></article>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">{rest.slice(0, 2).map((post) => <article key={post.id}>{post.image && <Image src={post.image.url} alt={post.image.alt || post.title} width={post.image.width} height={post.image.height} className="h-40 w-full rounded-xl object-cover lg:h-[190px]" />}<h2 className="mt-3 line-clamp-2 text-sm font-black leading-6">{post.title}</h2><Meta post={post} /></article>)}</div>
      </div>
      <div className="mt-6 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">{rest.slice(2, 5).map((post) => <article key={post.id} className="flex gap-3">{post.image && <Image src={post.image.url} alt="" width={120} height={80} className="h-20 w-28 rounded-lg object-cover" />}<div><h2 className="line-clamp-3 text-sm font-bold">{post.title}</h2><Meta post={post} /></div></article>)}</div>
    </section>
    <section className="bg-[#f8faf7]"><div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-10 lg:grid-cols-[minmax(0,795px)_365px]"><div><h2 className="border-b border-slate-200 pb-3 text-2xl font-black uppercase text-[#07552a]">Tin mới nhất</h2><div className="mt-2">{rest.slice(0, 7).map((post) => <article key={post.id} className="grid gap-4 border-b border-slate-200 py-5 sm:grid-cols-[220px_1fr]">{post.image && <Image src={post.image.url} alt={post.image.alt || post.title} width={post.image.width} height={post.image.height} className="h-32 w-full rounded-xl object-cover" />}<div><h3 className="text-lg font-black">{post.title}</h3><Meta post={post} /><p className="mt-2 text-xs leading-6 text-slate-500">{post.excerpt}</p></div></article>)}</div></div><aside className="h-fit lg:sticky lg:top-40"><h2 className="border-b border-slate-300 pb-3 text-xl font-black uppercase">Mẹo & hướng dẫn</h2>{posts.filter((post) => post.category === 'Góc tư vấn' || post.category === 'Sản phẩm').map((post, index) => <div key={post.id} className="flex gap-3 border-b border-slate-200 py-4"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8f2e8] text-xs font-black text-[#087c36]">{index + 1}</span><div><p className="text-sm font-bold">{post.title}</p><Meta post={post} /></div></div>)}<Link href="/lien-he" className="mt-6 block rounded-2xl bg-[#07552a] p-6 text-white"><span className="text-[10px] font-bold uppercase text-[#f6b511]">Cần tư vấn?</span><strong className="mt-2 block text-xl">Trao đổi cùng chuyên gia Bình Minh →</strong></Link></aside></div></section>
  </main>
}
